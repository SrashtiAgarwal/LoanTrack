import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Public / Auth Pages
import Login from './components/Login';
import Register from './components/Register';
import VerifyOtp from './components/VerifyOtp';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import OfficerLayout from './layouts/OfficerLayout';

// Beneficiary Pages
import Dashboard from './components/Dashboard';
import MyLoans from './components/MyLoans';
import SubmitVerification from './components/SubmitVerification';
import MySubmissions from './components/MySubmissions';

// Officer Pages
import OfficerDashboard from './components/OfficerDashboard';
import OfficerLoans from './components/OfficerLoans'
import OfficerBeneficiaries from './components/OfficerBeneficiaries';
import OfficerPendingReviews from './components/OfficerPendingReviews';
import OfficerVerifiedApplications from './components/OfficerVerifiedApplications';
import OfficerRejectedApplications from './components/OfficerRejectedApplications';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Redirect: Jab koi http://localhost:5173/ khole, toh seedha Login par jaye */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* 1. Beneficiary Portal Routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-loans" element={<MyLoans />} />
          <Route path="/submit-verification" element={<SubmitVerification />} />
          <Route path="/my-submissions" element={<MySubmissions />} />
        </Route>

        {/* 2. Officer / Auditor Portal Routes */}
        <Route element={<OfficerLayout />}>
          <Route path="/officer/dashboard" element={<OfficerDashboard />} />
          <Route path="/officer/loans" element={<OfficerLoans />} />
          <Route path="/officer/beneficiaries" element={<OfficerBeneficiaries />} />
          <Route path="/officer/pending-reviews" element={<OfficerPendingReviews />} />
          <Route path="/officer/verified-applications" element={<OfficerVerifiedApplications />} />
          <Route path="/officer/rejected-applications" element={<OfficerRejectedApplications />} />
        </Route>

        {/* Default Catch-all Redirect for unknown URLs */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;