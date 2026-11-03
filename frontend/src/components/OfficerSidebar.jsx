import React from 'react';
import { NavLink } from 'react-router-dom';

function OfficerSidebar() {
  const menuItems = [
    { path: '/officer/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/officer/loans', label: 'Loans', icon: '💼' },
    { path: '/officer/beneficiaries', label: 'Beneficiaries', icon: '👥' },
    { path: '/officer/pending-reviews', label: 'Pending Reviews', icon: '⏳' },
    { path: '/officer/verified-applications', label: 'Verified Applications', icon: '✅' },
    { path: '/officer/rejected-applications', label: 'Rejected Applications', icon: '❌' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0">
      <div>
        {/* Portal Branding Header */}
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md shadow-indigo-600/20">
            🛡️
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-tight">LoanTrack</h1>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600">Officer Portal</span>
          </div>
        </div>

        {/* Sidebar Menu Items */}
        <nav className="p-4 space-y-1.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Support Card / Assistance Footer */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 text-center">
          <p className="text-xs font-semibold text-slate-800">Officer Helpdesk</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Need help with verification audits?</p>
          <button className="mt-2 text-xs font-bold text-indigo-600 hover:underline">
            Contact Admin
          </button>
        </div>
      </div>
    </aside>
  );
}

export default OfficerSidebar;