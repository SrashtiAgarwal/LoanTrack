import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Auth Components
import Login from './components/Login';
import Register from './components/Register';
import VerifyOtp from './components/VerifyOtp';

// Layout & Dashboard Components
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './components/Dashboard';

// Loan & Verification Components
import MyLoans from './components/MyLoans';
import SubmitVerification from './components/SubmitVerification'; // <-- SubmitVerification import kar liya

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} /> 

        {/* Protected Dashboard Routes (Wrapped inside DashboardLayout) */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-loans" element={<MyLoans />} />
          
          {/* Real SubmitVerification Component attached here */}
          <Route path="/submit-verification" element={<SubmitVerification />} />
          
          <Route path="/my-submissions" element={<div className="p-8 text-2xl font-bold text-slate-800">My Submissions Page (Coming Soon)</div>} />
          <Route path="/verification-status" element={<div className="p-8 text-2xl font-bold text-slate-800">Verification Status Page (Coming Soon)</div>} />
          <Route path="/notifications" element={<div className="p-8 text-2xl font-bold text-slate-800">Notifications Page (Coming Soon)</div>} />
          <Route path="/profile" element={<div className="p-8 text-2xl font-bold text-slate-800">My Profile Page (Coming Soon)</div>} />
        </Route>

        {/* Default Redirect to Login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;