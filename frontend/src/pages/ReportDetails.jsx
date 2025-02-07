"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { useParams, Link } from "react-router-dom"
import { 
  AlertTriangle, ArrowLeft, BadgeDollarSign, Banknote, 
  CreditCard, Landmark, Loader2, Phone, UserRound, 
  Wallet, XCircle, CheckCircle2, BarChart, Search, 
  TrendingUp, TrendingDown, Minus, ShieldCheck, ShieldAlert
} from 'lucide-react'

export default function ReportDetails() {
  const { id } = useParams()
  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports/${id}`)
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
    <div className="container mx-auto p-6 bg-gradient-to-br from-indigo-50 via-white to-white min-h-screen">
      <div className="mb-6">
        <Link 
          to="/reports" 
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Reports
        </Link>
      </div>

      <h1 className="text-4xl font-extrabold mb-8 text-indigo-900 flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        <BarChart className="w-10 h-10 text-indigo-600" />
        Credit Report Details
      </h1>

      <div className="space-y-8">
        {/* Basic Details Section */}
        <Section 
          title="Basic Information" 
          icon={<UserRound className="w-5 h-5 text-indigo-600" />}
          bgColor="bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Detail 
              icon={<UserRound className="w-5 h-5 text-indigo-600" />}
              label="Full Name"
              value={report.name}
              bgColor="bg-indigo-50"
            />
            <Detail 
              icon={<Phone className="w-5 h-5 text-emerald-600" />}
              label="Mobile Number"
              value={report.mobile}
              bgColor="bg-emerald-50"
            />
            <Detail 
              icon={<CreditCard className="w-5 h-5 text-violet-600" />}
              label="PAN Number"
              value={report.pan}
              bgColor="bg-violet-50"
            />
            <Detail 
              icon={<BadgeDollarSign className="w-5 h-5 text-amber-600" />}
              label="Credit Score"
              value={report.creditScore}
              status={report.creditScore < 600 ? 'warning' : 'success'}
              bgColor="bg-amber-50"
            />
          </div>
        </Section>

        {/* Financial Overview Section */}
        <Section 
          title="Financial Overview" 
          icon={<Landmark className="w-5 h-5 text-green-600" />}
          bgColor="bg-white"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SummaryCard
              icon={<Wallet className="w-6 h-6 text-blue-600" />}
              title="Total Accounts"
              value={report.reportSummary?.totalAccounts}
              trend="neutral"
            />
            <SummaryCard
              icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
              title="Active Accounts"
              value={report.reportSummary?.activeAccounts}
              trend="positive"
            />
            <SummaryCard
              icon={<XCircle className="w-6 h-6 text-red-600" />}
              title="Closed Accounts"
              value={report.reportSummary?.closedAccounts}
              trend="negative"
            />
            <SummaryCard
              icon={<Search className="w-6 h-6 text-purple-600" />}
              title="Recent Enquiries"
              value={report.reportSummary?.last7DaysEnquiries}
              trend={report.reportSummary?.last7DaysEnquiries > 0 ? 'warning' : 'neutral'}
            />
            
            <div className="col-span-full">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Detail 
                  icon={<Banknote className="w-5 h-5 text-green-600" />}
                  label="Current Balance"
                  value={`₹${formatNumber(report.reportSummary?.currentBalance)}`}
                  bgColor="bg-green-50"
                />
                <Detail 
                  icon={<ShieldCheck className="w-5 h-5 text-blue-600" />}
                  label="Secured Amount"
                  value={`₹${formatNumber(report.reportSummary?.securedAmount)}`}
                  bgColor="bg-blue-50"
                />
                <Detail 
                  icon={<ShieldAlert className="w-5 h-5 text-amber-600" />}
                  label="Unsecured Amount"
                  value={`₹${formatNumber(report.reportSummary?.unsecuredAmount)}`}
                  bgColor="bg-amber-50"
                />
              </div>
            </div>
          </div>
        </Section>

        {/* Credit Accounts Section */}
        <Section 
          title="Credit Accounts" 
          icon={<CreditCard className="w-5 h-5 text-violet-600" />}
          bgColor="bg-white"
        >
          <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
                <tr>
                  {["Type", "Bank", "Address", "Account Number", "Overdue Amount", "Balance"].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {report.creditAccounts?.map((account, i) => (
                  <tr 
                    key={i} 
                    className={`transition-colors ${
                      account.amountOverdue > 0 
                        ? 'bg-red-50 hover:bg-red-100' 
                        : 'bg-green-50 hover:bg-green-100'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        {account.creditCard}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {account.bank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap max-w-[200px] truncate text-gray-700">
                      {account.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-600">
                      {account.accountNumber}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap ${
                      account.amountOverdue > 0 
                        ? 'text-red-700 font-semibold' 
                        : 'text-green-700 font-semibold'
                    }`}>
                      <div className="flex items-center gap-2">
                        {account.amountOverdue > 0 ? (
                          <XCircle className="w-5 h-5 text-red-600" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        )}
                        <span>
                          ₹{formatNumber(account.amountOverdue)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
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
function Section({ title, icon, children, bgColor = "bg-white" }) {
  return (
    <div className={`${bgColor} rounded-2xl shadow-lg overflow-hidden`}>
      <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="p-2 rounded-lg">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-indigo-900">{title}</h2>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  )
}

function Detail({ icon, label, value, status, bgColor = "bg-gray-50" }) {
  const statusColor = {
    warning: 'text-orange-600 bg-orange-100',
    success: 'text-green-600 bg-green-100',
    default: 'text-gray-600 bg-gray-100'
  }[status || 'default']

  return (
    <div className={`${bgColor} p-4 rounded-xl border border-gray-100 shadow-sm transform transition-all hover:scale-105 hover:shadow-md`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm font-medium text-gray-600">{label}</span>
      </div>
      <div className={`text-lg font-bold ${statusColor} px-3 py-1 rounded-md inline-block`}>
        {value || 'N/A'}
      </div>
    </div>
  )
}

function SummaryCard({ icon, title, value, trend }) {
  const trendIcons = {
    positive: <TrendingUp className="w-5 h-5" />,
    negative: <TrendingDown className="w-5 h-5" />,
    neutral: <Minus className="w-5 h-5" />
  }

  const trendColor = {
    positive: 'text-green-600 bg-green-100',
    negative: 'text-red-600 bg-red-100',
    neutral: 'text-blue-600 bg-blue-100'
  }[trend]

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-md transform transition-all hover:scale-105 hover:shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${trendColor}`}>
          {icon}
        </div>
        <div className={`${trendColor} p-1 rounded-full`}>
          {trendIcons[trend]}
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-500 mb-1">{title}</div>
        <div className="text-3xl font-extrabold text-indigo-900">{value}</div>
      </div>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gradient-to-br from-indigo-100 via-white to-white">
      <Loader2 className="w-16 h-16 animate-spin text-indigo-600" />
      <div className="text-xl text-gray-600 font-semibold">Loading report details...</div>
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-indigo-600 animate-progress" />
      </div>
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-red-50 via-white to-white">
      <div className="bg-red-100 p-6 rounded-full animate-pulse">
        <AlertTriangle className="w-16 h-16 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-red-800">{message}</h2>
      <Link
        to="/reports"
        className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg hover:shadow-xl"
      >
        <ArrowLeft className="w-5 h-5" />
        Return to Reports
      </Link>
    </div>
  )
}

// Utility function
function formatNumber(number) {
  return Number(number || 0).toLocaleString('en-IN')
}