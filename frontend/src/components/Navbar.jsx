import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, UploadCloud, FileText, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: <strong>Home</strong>, icon: <Home size={20} /> },
    { path: "/upload", label: <strong>Upload XML</strong>, icon: <UploadCloud size={20} /> },
    { path: "/reports", label: <strong>View Reports</strong>, icon: <FileText size={20} /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-fuchsia-500 to-violet-600 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center gap-3 transform hover:scale-105 transition-transform duration-200"
          >
           
            <div className="flex flex-col leading-tight">
              <span className="text-2xl sm:text-3xl font-extrabold text-white 
                bg-clip-text text-transparent bg-gradient-to-r 
                from-white via-white to-white/70 
                tracking-wide"
              >
                CreditSea
              </span>
              <span className="text-xs text-white/70 -mt-1 ml-1">
                Credit Insights Platform
              </span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 ">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path}>
                {link.icon}
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white shadow-lg">
            <div className="px-4 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <MobileNavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </MobileNavLink>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-2 text-sm font-medium text-white/80 px-4 py-2 rounded-lg
        hover:text-white hover:bg-white/10 hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        {children}
      </div>
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-gray-600
        hover:text-blue-600 hover:bg-blue-50 hover:-translate-y-0.5 rounded-lg transition-all duration-200"
    >
      <div className="flex items-center gap-2">
        {children}
      </div>
    </Link>
  );
}