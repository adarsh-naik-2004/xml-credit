"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { 
  Search, GanttChart, ArrowLeft, ArrowRight, 
  BadgeCheck, Phone, CreditCard, Activity,
  Trophy, AlertTriangle, User, ArrowRightCircle,
  Loader2
} from 'lucide-react'

export default function ReportsList() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState("")
  const [minScore, setMinScore] = useState("")
  const [maxScore, setMaxScore] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("/api/reports")
        setReports(res.data)
      } catch (err) {
        setError("Failed to load reports")
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [])

  const filteredReports = reports.filter((report) => {
    const matchesName = report.name?.toLowerCase().includes(search.toLowerCase())
    const score = report.creditScore || 0
    const matchesMin = minScore ? score >= +minScore : true
    const matchesMax = maxScore ? score <= +maxScore : true
    return matchesName && matchesMin && matchesMax
  })

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredReports.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)

  const stats = {
    avg: filteredReports.reduce((sum, r) => sum + (r.creditScore || 0), 0) / (filteredReports.length || 1),
    max: Math.max(...filteredReports.map((r) => r.creditScore || 0)),
    min: Math.min(...filteredReports.map((r) => r.creditScore || Number.POSITIVE_INFINITY)),
  }

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-blue-800 flex items-center gap-2">
        <GanttChart className="w-8 h-8" />
        Credit Reports
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <SearchInput
            icon={<Search className="w-4 h-4" />}
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchInput
            icon={<Activity className="w-4 h-4" />}
            placeholder="Min score"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            type="number"
          />
          <SearchInput
            icon={<Activity className="w-4 h-4" />}
            placeholder="Max score"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            type="number"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <StatCard 
            title="Average Score" 
            value={stats.avg.toFixed(1)} 
            color="blue" 
            icon={<Activity className="w-6 h-6" />}
          />
          <StatCard 
            title="Highest Score" 
            value={stats.max} 
            color="green"
            icon={<Trophy className="w-6 h-6" />}
          />
          <StatCard 
            title="Lowest Score" 
            value={stats.min} 
            color="red"
            icon={<AlertTriangle className="w-6 h-6" />}
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : filteredReports.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-50">
                  <tr>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Credit Score</TableHeader>
                    <TableHeader>PAN</TableHeader>
                    <TableHeader>Details</TableHeader>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map((report) => (
                    <TableRow key={report._id} report={report} />
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              paginate={paginate}
              itemsPerPage={itemsPerPage}
              totalItems={filteredReports.length}
            />
          </>
        )}
      </div>
    </div>
  )
}

// Helper Components

function TableHeader({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
      {children}
    </th>
  )
}

function TableRow({ report }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 flex items-center gap-2">
          <User className="w-4 h-4 text-gray-400" />
          {report.name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-2 inline-flex items-center text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 gap-1">
          <BadgeCheck className="w-3 h-3" />
          {report.creditScore}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-600 flex items-center gap-1">
        <CreditCard className="w-4 h-4 text-gray-400" />
        {report.pan}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          to={`/reports/${report._id}`}
          className="text-blue-600 hover:text-blue-900 font-medium flex items-center gap-1"
        >
          Details <ArrowRightCircle className="w-4 h-4" />
        </Link>
      </td>
    </tr>
  )
}

function Pagination({ currentPage, totalPages, paginate, itemsPerPage, totalItems }) {
  const pageNumbers = []

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-700 flex items-center gap-1">
        <GanttChart className="w-4 h-4 text-gray-400" />
        <span>
          Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-medium">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </span>
      </div>
      <nav className="flex space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-3 py-1 rounded-md ${
              currentPage === number 
                ? 'bg-blue-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          Next <ArrowRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  )
}

function StatCard({ title, value, color, icon }) {
  const bgColor = `bg-${color}-50`
  const textColor = `text-${color}-700`
  return (
    <div className={`${bgColor} p-4 rounded-lg flex items-center gap-3`}>
      <div className={`p-2 rounded-lg ${textColor} bg-${color}-100`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      </div>
    </div>
  )
}

function SearchInput({ icon, ...props }) {
  return (
    <div className="relative">
      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
        {icon}
      </span>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-40">
      <Loader2 className="animate-spin w-12 h-12 text-blue-600" />
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div className="text-center py-10 flex flex-col items-center gap-2">
      <AlertTriangle className="w-12 h-12 text-red-500" />
      <p className="text-red-500 text-xl">{message}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-10 flex flex-col items-center gap-2">
      <Search className="w-12 h-12 text-gray-400" />
      <p className="text-gray-500 text-xl">No reports found</p>
    </div>
  )
}
