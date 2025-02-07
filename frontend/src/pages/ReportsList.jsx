import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { 
  Search, GanttChart, ArrowLeft, ArrowRight, 
  BadgeCheck, Phone, CreditCard, Activity,
  Trophy, AlertTriangle, User, ArrowRightCircle,
  Loader2, TrendingUp, TrendingDown, Minus
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
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/reports`)
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
    const matchesPAN = report.pan?.toLowerCase().includes(search.toLowerCase())
    const score = report.creditScore || 0
    const matchesMin = minScore ? score >= +minScore : true
    const matchesMax = maxScore ? score <= +maxScore : true
    return (matchesName || matchesPAN) && matchesMin && matchesMax
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
    <div className="container mx-auto p-6 bg-gradient-to-br from-indigo-50 via-white to-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-900 flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
        <GanttChart className="w-10 h-10 text-indigo-600" />
        Credit Reports
      </h1>

      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <SearchInput
            icon={<Search className="w-5 h-5 text-indigo-600" />}
            placeholder="Search by name or PAN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <SearchInput
            icon={<Activity className="w-5 h-5 text-emerald-600" />}
            placeholder="Min score"
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
            type="number"
          />
          <SearchInput
            icon={<Activity className="w-5 h-5 text-amber-600" />}
            placeholder="Max score"
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
            type="number"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Average Score" 
            value={stats.avg.toFixed(1)} 
            color="blue" 
            icon={<Activity className="w-7 h-7" />}
            trend="neutral"
          />
          <StatCard 
            title="Highest Score" 
            value={stats.max} 
            color="green"
            icon={<Trophy className="w-7 h-7" />}
            trend="positive"
          />
          <StatCard 
            title="Lowest Score" 
            value={stats.min} 
            color="red"
            icon={<AlertTriangle className="w-7 h-7" />}
            trend="negative"
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
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-indigo-100 to-purple-100">
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

function TableHeader({ children }) {
  return (
    <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase tracking-wider">
      {children}
    </th>
  )
}

function TableRow({ report }) {
  return (
    <tr className="hover:bg-indigo-50 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 flex items-center gap-3">
          <User className="w-5 h-5 text-indigo-600" />
          {report.name}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 inline-flex items-center text-sm font-semibold rounded-full bg-indigo-100 text-indigo-800 gap-2">
          <BadgeCheck className="w-4 h-4" />
          {report.creditScore}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-gray-600 flex items-center gap-2">
        <CreditCard className="w-5 h-5 text-violet-600" />
        {report.pan}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <Link
          to={`/reports/${report._id}`}
          className="text-indigo-600 hover:text-indigo-900 font-medium flex items-center gap-2 transform hover:translate-x-1 transition-all"
        >
          Details <ArrowRightCircle className="w-5 h-5" />
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
    <div className="flex items-center justify-between mt-8 bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="text-sm text-gray-700 flex items-center gap-2">
        <GanttChart className="w-5 h-5 text-indigo-600" />
        <span>
          Showing <span className="font-semibold">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
          <span className="font-semibold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
          <span className="font-semibold">{totalItems}</span> results
        </span>
      </div>
      <nav className="flex space-x-2">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" /> Previous
        </button>
        
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`px-4 py-2 rounded-md transition-all ${
              currentPage === number 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-indigo-50'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-500 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          Next <ArrowRight className="w-5 h-5" />
        </button>
      </nav>
    </div>
  )
}

function StatCard({ title, value, color, icon, trend }) {
  const trendIcons = {
    positive: <TrendingUp className="w-5 h-5" />,
    negative: <TrendingDown className="w-5 h-5" />,
    neutral: <Minus className="w-5 h-5" />
  }

  const colorClasses = {
    blue: {
      bg: "bg-indigo-100",
      text: "text-indigo-800",
      iconBg: "bg-indigo-200"
    },
    green: {
      bg: "bg-green-100",
      text: "text-green-800",
      iconBg: "bg-green-200"
    },
    red: {
      bg: "bg-red-100",
      text: "text-red-800",
      iconBg: "bg-red-200"
    }
  }

  const selectedColor = colorClasses[color] || colorClasses.blue

  return (
    <div className={`${selectedColor.bg} p-5 rounded-2xl flex items-center justify-between transform transition-all hover:scale-105 hover:shadow-lg`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${selectedColor.iconBg}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${selectedColor.text}`}>{value}</p>
        </div>
      </div>
      <div className={`p-2 rounded-full ${
        trend === 'positive' ? 'bg-green-200 text-green-600' :
        trend === 'negative' ? 'bg-red-200 text-red-600' :
        'bg-blue-200 text-blue-600'
      }`}>
        {trendIcons[trend]}
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
        className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
      />
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-40">
      <Loader2 className="animate-spin w-16 h-16 text-indigo-600" />
    </div>
  )
}

function ErrorMessage({ message }) {
  return (
    <div className="text-center py-10 flex flex-col items-center gap-4">
      <AlertTriangle className="w-16 h-16 text-red-500 animate-pulse" />
      <p className="text-red-700 text-2xl font-semibold">{message}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-10 flex flex-col items-center gap-4">
      <Search className="w-16 h-16 text-gray-400 animate-bounce" />
      <p className="text-gray-600 text-2xl font-semibold">No reports found</p>
    </div>
  )
}