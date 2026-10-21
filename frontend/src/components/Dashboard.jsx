import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const [stats] = useState({
    totalLoans: 3,
    verificationSubmitted: 5,
    pendingReview: 2,
    approvedSubmissions: 3,
    declinedSubmissions: 0,
  });

  const [recentActivities] = useState([
    {
      id: 1,
      title: 'Machinery Purchase Bill Uploaded',
      loanId: 'LN-2026-8942',
      date: '12 Oct 2026',
      status: 'Pending Review',
      statusColor: 'text-amber-700 bg-amber-50 border-amber-200',
    },
    {
      id: 2,
      title: 'Raw Material Invoice Verified',
      loanId: 'LN-2026-8942',
      date: '08 Oct 2026',
      status: 'Approved',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
    {
      id: 3,
      title: 'Initial Utilization Proof Submitted',
      loanId: 'LN-2026-3109',
      date: '01 Oct 2026',
      status: 'Approved',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    },
  ]);

  return (
    <div className="p-8 space-y-8 bg-slate-50/50 min-h-full">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-slate-200/80 p-7 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, Srashti 👋</h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your registered loans, submit expenditure proofs, and monitor approval status.
          </p>
        </div>
        <button
          onClick={() => navigate('/submit-verification')}
          className="px-5 py-3.5 bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-semibold rounded-xl text-sm shadow-lg shadow-blue-600/20 transition duration-150 flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <span>➕</span> Submit for Verification
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Registered Loans</span>
            <span className="text-lg">🏦</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.totalLoans}</p>
          <p className="text-xs text-slate-400 mt-2">Active loan accounts</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Submitted Proofs</span>
            <span className="text-lg">📤</span>
          </div>
          <p className="text-3xl font-bold text-slate-900">{stats.verificationSubmitted}</p>
          <p className="text-xs text-slate-400 mt-2">Total proofs uploaded</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Review</span>
            <span className="text-lg">⏳</span>
          </div>
          <p className="text-3xl font-bold text-amber-600">{stats.pendingReview}</p>
          <p className="text-xs text-slate-400 mt-2">Awaiting bank action</p>
        </div>

        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Approved / Declined</span>
            <span className="text-lg">✅</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-600">{stats.approvedSubmissions}</span>
            <span className="text-slate-300 text-lg">/</span>
            <span className="text-xl font-semibold text-rose-600">{stats.declinedSubmissions}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">Verification breakdown</p>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
          <button
            onClick={() => navigate('/my-submissions')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition"
          >
            View All Submissions →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5 rounded-l-xl">Submission Details</th>
                <th className="px-4 py-3.5">Loan ID</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50/60 transition">
                  <td className="px-4 py-4 font-medium text-slate-900">{activity.title}</td>
                  <td className="px-4 py-4 font-mono text-xs text-slate-500">{activity.loanId}</td>
                  <td className="px-4 py-4 text-xs text-slate-500">{activity.date}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${activity.statusColor}`}
                    >
                      {activity.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;