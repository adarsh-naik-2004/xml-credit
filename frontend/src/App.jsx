// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import ReportsList from './pages/ReportsList';
import ReportDetails from './pages/ReportDetails';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/reports" element={<ReportsList />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}