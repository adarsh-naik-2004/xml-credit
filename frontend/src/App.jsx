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
      <div className="min-h-screen bg-gradient-to-b from-fuchsia-200 via-white to-white">
        <Navbar />
        <main className="container mx-auto ">
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