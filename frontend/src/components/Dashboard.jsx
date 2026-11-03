import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [userName, setUserName] = useState("User");
  const [stats, setStats] = useState({
    totalLoans: 0,
    totalSubmissions: 0,
    pendingCount: 0,
    approvedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // User ka naam fetch karein
    const savedName = localStorage.getItem("user_name");
    if (savedName) {
      // Sirf First Name nikalne ke liye (e.g. Srashti)
      const firstName = savedName.split(" ")[0];
      setUserName(firstName);
    }});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const headers = { "Authorization": `Bearer ${token}` };

        // 1. Fetch Loans
        const loansRes = await fetch("http://localhost:8000/api/loans/my-loans", { headers });
        const loansData = await loansRes.json();
        const loans = loansData.loans || [];

        // 2. Fetch Submissions
        const subRes = await fetch("http://localhost:8000/api/verification/my-submissions", { headers });
        const subData = await subRes.json();
        const submissions = subData.submissions || [];

        // Calculate Stats
        const pending = submissions.filter(s => s.status === 'Pending').length;
        const approved = submissions.filter(s => s.status === 'Approved').length;

        setStats({
          totalLoans: loans.length,
          totalSubmissions: submissions.length,
          pendingCount: pending,
          approvedCount: approved,
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-600 font-medium">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-900 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome back, {userName} 👋</h1>
          <p className="text-blue-100 text-sm max-w-lg">
          please submit your loan utilization proofs and track live verification status.
          </p>
        </div>
        <Link
          to="/submit-verification"
          className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-5 py-2.5 rounded-xl shadow-sm text-sm transition whitespace-nowrap"
        >
          + Quick Submit
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-sm font-medium text-slate-500">Active Loans</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">{stats.totalLoans}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-sm font-medium text-slate-500">Total Submissions</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{stats.totalSubmissions}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-sm font-medium text-slate-500">Pending Review</span>
          <span className="text-3xl font-bold text-yellow-600 mt-2">{stats.pendingCount}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-sm font-medium text-slate-500">Approved Verifications</span>
          <span className="text-3xl font-bold text-green-600 mt-2">{stats.approvedCount}</span>
        </div>
      </div>

      {/* Modern Action Bar Hub */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        {/* <h2 className="text-lg font-bold text-slate-800 mb-4">Portal Actions & Navigation</h2> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Action 1: Submit Verification */}
          <Link
            to="/submit-verification"
            className="group p-4 border border-slate-200 rounded-xl hover:border-blue-500 hover:bg-blue-50/50 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 font-bold text-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition">
              📷
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-blue-600 transition">
                Submit New Proof
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Capture asset photos & bills</p>
            </div>
          </Link>

          {/* Action 2: View History */}
          <Link
            to="/my-submissions"
            className="group p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 font-bold text-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              📋
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                View History & Status
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">View Records</p>
            </div>
          </Link>

          {/* Action 3: My Loans List */}
          <Link
            to="/my-loans"
            className="group p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-bold text-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              💼
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition">
                View Active Loans
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Check active loan schemes</p>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;