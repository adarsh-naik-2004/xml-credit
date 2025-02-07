import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, UploadCloud, FileText, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Home", icon: <Home className="text-white" size={20} /> },
    { path: "/upload", label: "Upload XML", icon: <UploadCloud className="text-white" size={20} /> },
    { path: "/reports", label: "View Reports", icon: <FileText className="text-white" size={20} /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-blue-700 to-blue-400 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2 transform hover:scale-105 transition-transform duration-200"
          >
            <span className="text-white text-2xl sm:text-3xl font-extrabold tracking-tight drop-shadow-lg">
              CreditSea
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            {navLinks.map((link) => (
              <NavLink key={link.path} to={link.path}>
                {link.icon}
                <span className="text-white">{link.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-white hover:text-blue-100 focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gradient-to-r from-blue-700 to-blue-400 border-t border-blue-400">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <MobileNavLink 
                  key={link.path} 
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.icon}
                  <span className="text-white">{link.label}</span>
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
      className="flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md
        hover:bg-blue-600/30 transition-colors duration-200"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 text-base font-medium
        hover:bg-blue-600/30 rounded-md transition-colors duration-200"
    >
      {children}
    </Link>
  );
}