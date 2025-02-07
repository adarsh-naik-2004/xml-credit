"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"
import { 
  AlertTriangle, ArrowLeft, BadgeDollarSign, Banknote, 
  CreditCard, Landmark, Loader2, Phone, UserRound, 
  Wallet, XCircle, CheckCircle2, BarChart, Search
} from 'lucide-react'

export default function ReportDetails() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`/api/reports/${id}`)
        setReport(res.data)
      } catch (err) {
        setError("Report not found")
      } finally {
        setLoading(false)
      }
    }
    fetchReport()
  }, [id])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link 
          to="/reports" 
          className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Reports
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8 text-blue-800 flex items-center gap-2">
        <BarChart className="w-8 h-8" />
        Credit Report Details
      </h1>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
        {/* Basic Details Section */}
        <Section title="Basic Information" icon={<UserRound className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Detail 
              icon={<UserRound className="w-4 h-4" />}
              label="Full Name"
              value={report.name}
            />
            <Detail 
              icon={<Phone className="w-4 h-4" />}
              label="Mobile Number"
              value={report.mobile}
            />
            <Detail 
              icon={<CreditCard className="w-4 h-4" />}
              label="PAN Number"
              value={report.pan}
            />
            <Detail 
              icon={<BadgeDollarSign className="w-4 h-4" />}
              label="Credit Score"
              value={report.creditScore}
              status={report.creditScore < 600 ? 'warning' : 'success'}
            />
          </div>
        </Section>

        {/* Report Summary Section */}
        <Section title="Financial Overview" icon={<Landmark className="w-5 h-5" />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon={<Wallet className="w-6 h-6" />}
              title="Total Accounts"
              value={report.reportSummary?.totalAccounts}
              trend="neutral"
            />
            <SummaryCard
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Active Accounts"
              value={report.reportSummary?.activeAccounts}
              trend="positive"
            />
            <SummaryCard
              icon={<XCircle className="w-6 h-6" />}
              title="Closed Accounts"
              value={report.reportSummary?.closedAccounts}
              trend="negative"
            />
            <SummaryCard
              icon={<Search className="w-6 h-6" />}
              title="Last 7 Days Enquiries"
              value={report.reportSummary?.last7DaysEnquiries}
              trend={report.reportSummary?.last7DaysEnquiries > 0 ? 'warning' : 'neutral'}
            />
            
            <div className="col-span-full">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Detail 
                  icon={<Banknote className="w-4 h-4" />}
                  label="Current Balance"
                  value={`₹${formatNumber(report.reportSummary?.currentBalance)}`}
                />
                <Detail 
                  icon={<Landmark className="w-4 h-4" />}
                  label="Secured Amount"
                  value={`₹${formatNumber(report.reportSummary?.securedAmount)}`}
                />
                <Detail 
                  icon={<CreditCard className="w-4 h-4" />}
                  label="Unsecured Amount"
                  value={`₹${formatNumber(report.reportSummary?.unsecuredAmount)}`}
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Credit Accounts Section */}
        <Section title="Credit Accounts" icon={<CreditCard className="w-5 h-5" />}>
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-50">
                <tr>
                  {["Type", "Bank", "Address", "Account Number", "Status", "Balance"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.creditAccounts?.map((account, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        {account.creditCard}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {account.bank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate">
                      {account.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      {account.accountNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                        account.amountOverdue > 0 
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {account.amountOverdue > 0 ? (
                          <>
                            <XCircle className="w-4 h-4" />
                            Overdue
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-4 h-4" />
                            Current
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      ₹{formatNumber(account.currentBalance)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      </div>
    </div>
  )
}

// Helper Components
function Section({ title, icon, children }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4 border-b pb-2">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          {icon}
        </div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  )
}

function Detail({ icon, label, value, status }) {
  const statusColor = {
    warning: 'text-orange-600 bg-orange-50',
    success: 'text-green-600 bg-green-50',
    default: 'text-gray-600 bg-gray-50'
  }[status || 'default']

  return (
    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center gap-2 mb-2 text-gray-500">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className={`text-lg font-semibold ${statusColor} px-2 py-1 rounded-md`}>
        {value || 'N/A'}
      </span>
    </div>
  )
}

function SummaryCard({ icon, title, value, trend }) {
  const trendColor = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-blue-600 bg-blue-100'
  }[trend]

  return (
    <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${trendColor}`}>
          {icon}
        </div>
        <div>
          <div className="text-sm text-gray-500">{title}</div>
          <div className="text-2xl font-bold text-gray-800">{value}</div>
        </div>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      <div className="text-gray-600">Loading report details...</div>
      <div className="w-48 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-blue-600 animate-progress" />
      </div>
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <div className="bg-red-100 p-4 rounded-full">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      <h2 className="text-xl font-semibold text-gray-800">{message}</h2>
      <Link
        to="/reports"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Reports
      </Link>
    </div>
  )
}

// Utility function
function formatNumber(number) {
  return Number(number || 0).toLocaleString('en-IN')
}