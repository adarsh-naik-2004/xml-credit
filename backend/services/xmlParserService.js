const xml2js = require('xml2js');
const logger = require('../config/logger');

const parseXML = xml => new Promise((resolve, reject) => {
  const parser = new xml2js.Parser({ explicitArray: false });
  parser.parseString(xml, (err, result) => {
    if (err) reject(err);
    else resolve(result);
  });
});

const extractData = (xmlData) => {
    try {
      const { INProfileResponse } = xmlData;
      
      // Safe navigation with defaults
      const basic = INProfileResponse?.Current_Application?.Current_Application_Details?.Current_Applicant_Details || {};
      const summary = INProfileResponse?.CAIS_Account?.CAIS_Summary || {};
      const creditAccounts = INProfileResponse?.CAIS_Account?.CAIS_Account_DETAILS || [];
      const score = INProfileResponse?.SCORE || {};
  
      // Handle PAN extraction safely
      const panNumbers = [];
      const accounts = Array.isArray(creditAccounts) ? creditAccounts : [creditAccounts];
      
      accounts.forEach(account => {
        const details = account?.CAIS_Holder_ID_Details || {};
        if (Array.isArray(details)) {
          details.forEach(d => panNumbers.push(d?.Income_TAX_PAN));
        } else {
          panNumbers.push(details?.Income_TAX_PAN);
        }
      });
  
      // Basic details with defaults
      const basicDetails = {
        name: `${basic?.First_Name || ''} ${basic?.Last_Name || ''}`.trim(),
        mobile: basic?.MobilePhoneNumber || 'N/A',
        pan: panNumbers[0] || 'N/A',
        creditScore: parseInt(score?.BureauScore) || 0
      };
  
      // Report summary with defaults
      const reportSummary = {
        totalAccounts: parseInt(summary?.Credit_Account?.CreditAccountTotal) || 0,
        activeAccounts: parseInt(summary?.Credit_Account?.CreditAccountActive) || 0,
        closedAccounts: parseInt(summary?.Credit_Account?.CreditAccountClosed) || 0,
        currentBalance: parseInt(summary?.Total_Outstanding_Balance?.Outstanding_Balance_All) || 0,
        securedAmount: parseInt(summary?.Total_Outstanding_Balance?.Outstanding_Balance_Secured) || 0,
        unsecuredAmount: parseInt(summary?.Total_Outstanding_Balance?.Outstanding_Balance_UnSecured) || 0,
        last7DaysEnquiries: parseInt(INProfileResponse?.TotalCAPS_Summary?.TotalCAPSLast7Days) || 0
      };
  
      // Process accounts safely
      const processAccounts = (accounts) => {
        return accounts.map(acc => ({
          creditCard: acc?.Account_Type || 'N/A',
          bank: acc?.Subscriber_Name?.trim() || 'N/A',
          address: [
            acc?.CAIS_Holder_Address_Details?.First_Line_Of_Address_non_normalized,
            acc?.CAIS_Holder_Address_Details?.Second_Line_Of_Address_non_normalized,
            acc?.CAIS_Holder_Address_Details?.City_non_normalized
          ].filter(Boolean).join(', ') || 'N/A',
          accountNumber: acc?.Account_Number || 'N/A',
          amountOverdue: parseInt(acc?.Amount_Past_Due) || 0,
          currentBalance: parseInt(acc?.Current_Balance) || 0
        }));
      };
  
      return {
        ...basicDetails,
        reportSummary,
        creditAccounts: processAccounts(creditAccounts)
      };
    } catch (err) {
      logger.error('Data extraction error:', err);
      throw new Error('Invalid XML structure: ' + err.message);
    }
  };

module.exports = { parseXML, extractData };