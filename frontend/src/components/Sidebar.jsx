import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'My Loans', path: '/my-loans', icon: '🏦' },
  { name: 'Submit Verification', path: '/submit-verification', icon: '📄' },
  { name: 'My Submissions', path: '/my-submissions', icon: '📁' },
  { name: 'Verification Status', path: '/verification-status', icon: '⏳' },
  { name: 'Notifications', path: '/notifications', icon: '🔔' },
  { name: 'My Profile', path: '/profile', icon: '👤' },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between min-h-screen shadow-sm">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="m8 14 2.5 2.5L16 11" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                Loan<span className="text-blue-600">Track</span>
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Asset Loan Verification
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="p-4 space-y-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Support Box */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-xs text-slate-500 text-center">
          <p className="font-semibold text-slate-700">Need Assistance?</p>
          <p className="mt-0.5">Contact Loan Officer Support</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;