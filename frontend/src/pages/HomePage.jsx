import { Link } from "react-router-dom";
import { UploadCloud, FileText } from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-gradient-to-br from-blue-400 to-blue-600 min-h-screen flex items-center justify-center p-6">
      <div className="text-center p-12 bg-white rounded-3xl shadow-2xl max-w-3xl transform hover:shadow-3xl transition-all duration-300">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-blue-800 
          bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent drop-shadow-lg">
          Welcome to CreditSea
        </h1>
        <p className="text-lg sm:text-xl text-gray-900 mb-12 leading-relaxed">
          Upload XML Files and view credit reports with ease.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-6 sm:space-y-0 sm:space-x-6">
          <Button to="/upload" primary>
            <UploadCloud size={20} className="mr-2" /> Upload XML
          </Button>
          <Button to="/reports">
            <FileText size={20} className="mr-2" /> View Reports
          </Button>
        </div>
      </div>
    </div>
  );
}

function Button({ to, primary, children }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center px-8 py-4 rounded-full text-lg font-semibold 
        transition-all duration-300 transform hover:scale-110 hover:shadow-xl shadow-md ${
          primary
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-400/50"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300 shadow-gray-400/30"
        }`}
    >
      {children}
    </Link>
  );
}
