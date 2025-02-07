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
    const basic = INProfileResponse.Current_Application.Current_Application_Details.Current_Applicant_Details;
    const summary = INProfileResponse.CAIS_Account.CAIS_Summary;
    const creditAccounts = INProfileResponse.CAIS_Account.CAIS_Account_DETAILS;
    const score = INProfileResponse.SCORE;

    const panNumbers = [];
    if (Array.isArray(INProfileResponse.CAIS_Account.CAIS_Account_DETAILS)) {
        INProfileResponse.CAIS_Account.CAIS_Account_DETAILS.forEach(account => {
        if (Array.isArray(account.CAIS_Holder_ID_Details)) {
            account.CAIS_Holder_ID_Details.forEach(detail => panNumbers.push(detail.Income_TAX_PAN));
        } else {
            panNumbers.push(account.CAIS_Holder_ID_Details.Income_TAX_PAN);
        }
    });
    } else {
        const singleAccount = INProfileResponse.CAIS_Account.CAIS_Account_DETAILS;
        if (Array.isArray(singleAccount.CAIS_Holder_ID_Details)) {
        singleAccount.CAIS_Holder_ID_Details.forEach(detail => panNumbers.push(detail.Income_TAX_PAN));
        } else {
        panNumbers.push(singleAccount.CAIS_Holder_ID_Details.Income_TAX_PAN);
        }
    }


    const basicDetails = {
      name: `${basic.First_Name || ''} ${basic.Last_Name || ''}`.trim(),
      mobile: basic.MobilePhoneNumber,
      pan: panNumbers[0],
      creditScore: parseInt(score.BureauScore)
    };

    const reportSummary = {
      totalAccounts: summary.Credit_Account.CreditAccountTotal,
      activeAccounts: summary.Credit_Account.CreditAccountActive,
      closedAccounts: summary.Credit_Account.CreditAccountClosed,
      currentBalance: summary.Total_Outstanding_Balance.Outstanding_Balance_All,
      securedAmount: summary.Total_Outstanding_Balance.Outstanding_Balance_Secured,
      unsecuredAmount: summary.Total_Outstanding_Balance.Outstanding_Balance_UnSecured,
      last7DaysEnquiries: INProfileResponse.TotalCAPS_Summary.TotalCAPSLast7Days
    };

    const processAccounts = (accounts) => {
      return accounts.map(acc => ({
        creditCard: acc.Account_Type,
        bank: acc.Subscriber_Name?.trim(),
        address: [
          acc.CAIS_Holder_Address_Details?.First_Line_Of_Address_non_normalized,
          acc.CAIS_Holder_Address_Details?.Second_Line_Of_Address_non_normalized,
          acc.CAIS_Holder_Address_Details?.City_non_normalized
        ].filter(Boolean).join(', '),
        accountNumber: acc.Account_Number,
        amountOverdue: parseInt(acc.Amount_Past_Due) || 0,
        currentBalance: parseInt(acc.Current_Balance) || 0
      }));
    };

    return {
      ...basicDetails,
      reportSummary,
      creditAccounts: processAccounts(accounts)
    };
  } catch (err) {
    logger.error('Data extraction error:', err);
    throw new Error('Invalid XML structure');
  }
};

module.exports = { parseXML, extractData };