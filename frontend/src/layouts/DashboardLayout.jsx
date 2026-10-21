import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-xs">
          <div className="text-sm font-semibold text-slate-600">
            Loan Utilization & Verification Portal
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition">
              🔔
            </button>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-semibold flex items-center justify-center text-xs shadow-sm shadow-blue-600/20">
                SA
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-slate-900">Srashti Agarwal</span>
                <span className="block text-[11px] text-slate-500">Beneficiary</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Area */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;