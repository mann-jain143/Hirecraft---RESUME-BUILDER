import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/builder/:resumeId" element={<ProtectedRoute><Builder /></ProtectedRoute>} />
            <Route path="/builder" element={<Navigate to="/builder/new" replace />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <footer className="w-full py-4 mt-auto border-t border-gray-800/80 bg-slate-950/50 backdrop-blur-md z-50">
          <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center">
            <p className="text-gray-400 text-sm font-medium tracking-wider">
              &copy; 2026 <span className="text-purple-500 font-bold hover:text-purple-400 transition-colors cursor-pointer">@mannjain</span>. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;