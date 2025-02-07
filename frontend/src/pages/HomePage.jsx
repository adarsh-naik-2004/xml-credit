import { Link } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  ArrowRight,
  CheckCircle,
  Users,
  Database
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-b from-fuchsia-300 via-white to-white">
      <section className="relative overflow-hidden min-h-[calc(100vh-4rem)] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-0 w-72 h-72 bg-blue-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 right-0 w-72 h-72 bg-indigo-200 rounded-full filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            {/* Hero Text */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Streamline Your Credit Reports
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Transform your XML files into actionable credit insights.
              <span className="block">Fast, secure, and effortless.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-20">
              <Button to="/upload" primary>
                <UploadCloud size={20} />
                 Upload XML 
                <ArrowRight size={16} />
              </Button>
              <Button to="/reports">
                <FileText size={20} />
                View Reports
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center gap-8">
              <TrustIndicator
                icon={<CheckCircle className="text-green-500" size={20} />}
                text="Secured"
              />
              <TrustIndicator
                icon={<Users className="text-blue-500" size={20} />}
                text="Management"
              />
              <TrustIndicator
                icon={<Database className="text-purple-500" size={20} />}
                text="MongoDB"
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Button({ to, primary, children }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-semibold
        transition-all duration-300 hover:transform hover:scale-105 ${
          primary
            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200"
            : "bg-white text-gray-800 hover:bg-gray-50 shadow-lg border border-gray-200"
        }`}
    >
      {children}
    </Link>
  );
}

function TrustIndicator({ icon, text }) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
      {icon}
      <span className="text-gray-700 font-medium">{text}</span>
    </div>
  );
}
