import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import OfficerSidebar from '../components/OfficerSidebar'; // Officer Sidebar

function OfficerLayout() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("Officer");
  const [userRole, setUserRole] = useState("Loan Officer");

  useEffect(() => {
    const savedName = localStorage.getItem("user_name");
    const savedRole = localStorage.getItem("role");
    if (savedName) setUserName(savedName);
    if (savedRole) setUserRole(savedRole);
  }, []);

  const getInitials = (name) => {
    if (!name) return "O";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_name");
    localStorage.removeItem("role");
    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <OfficerSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-xs">
          <div className="text-sm font-semibold text-slate-600">
            Loan Utilization & Verification Portal — <span className="text-indigo-600 font-bold">Officer Management</span>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2.5 text-slate-500 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition">
              🔔
            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-semibold flex items-center justify-center text-xs shadow-sm shadow-indigo-600/20">
                {getInitials(userName)}
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-slate-900">{userName}</span>
                <span className="block text-[11px] text-slate-500 font-medium">{userRole}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold text-xs py-2 px-3 rounded-xl transition flex items-center gap-1 border border-red-100"
              title="Logout"
            >
              Logout
            </button>
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

export default OfficerLayout;