import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const OfficerDashboard = () => {
  const [officerName, setOfficerName] = useState('Officer');
  const [stats, setStats] = useState({
    totalLoans: 0,
    totalBeneficiaries: 0,
    pendingReviews: 0,
    approvedCount: 0,
    rejectedCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStorage se officer name nikalna
    const savedName = localStorage.getItem('user_name');
    if (savedName) {
      setOfficerName(savedName.split(' ')[0]);
    }

    const fetchOfficerStats = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = { Authorization: `Bearer ${token}` };

        // Real API endpoint call
        const response = await fetch('http://localhost:8000/api/officer/dashboard-stats', { headers });
        const data = await response.json();

        if (response.ok) {
          setStats({
            totalLoans: data.total_loans || 0,
            totalBeneficiaries: data.total_beneficiaries || 0,
            pendingReviews: data.pending_reviews || 0,
            approvedCount: data.approved_count || 0,
            rejectedCount: data.rejected_count || 0,
          });
        }
      } catch (err) {
        console.error('Failed to fetch officer stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOfficerStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-slate-600 font-medium">Loading officer portal...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1">Welcome Officer, {officerName}! 🛡️</h1>
          <p className="text-indigo-200 text-sm max-w-lg">
            Review loan utilization submissions, register new beneficiaries, and Issues loan schemes.
          </p>
        </div>
        <Link
          to="/officer/pending-reviews"
          className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-5 py-2.5 rounded-xl shadow-sm text-sm transition whitespace-nowrap"
        >
          Review Submissions →
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Loans</span>
          <span className="text-3xl font-bold text-slate-800 mt-2">{stats.totalLoans}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Beneficiaries</span>
          <span className="text-3xl font-bold text-blue-600 mt-2">{stats.totalBeneficiaries}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Reviews</span>
          <span className="text-3xl font-bold text-amber-600 mt-2">{stats.pendingReviews}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved</span>
          <span className="text-3xl font-bold text-emerald-600 mt-2">{stats.approvedCount}</span>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Rejected</span>
          <span className="text-3xl font-bold text-rose-600 mt-2">{stats.rejectedCount}</span>
        </div>
      </div>

      {/* Quick Action Hub */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Officer Quick Management Hub</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: Pending Reviews */}
          <Link
            to="/officer/pending-reviews"
            className="group p-4 border border-slate-200 rounded-xl hover:border-amber-500 hover:bg-amber-50/50 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 font-bold text-xl flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition">
              ⏳
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-amber-700 transition">
                Pending Audits
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{stats.pendingReviews} submissions awaiting review</p>
            </div>
          </Link>

          {/* Action 2: Beneficiaries List & Register */}
          <Link
            to="/officer/beneficiaries"
            className="group p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50/50 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 font-bold text-xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition">
              👥
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition">
                Manage Beneficiaries
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Register & view beneficiaries</p>
            </div>
          </Link>

          {/* Action 3: Loans & Sanctions */}
          <Link
            to="/officer/loans"
            className="group p-4 border border-slate-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50/50 transition flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-bold text-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition">
              💼
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-emerald-600 transition">
                Sanction New Loan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Create loan records for users</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OfficerDashboard;