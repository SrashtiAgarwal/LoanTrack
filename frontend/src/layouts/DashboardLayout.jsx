import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom'; // <-- useNavigate import kiya
import Sidebar from '../components/Sidebar';

function DashboardLayout() {
  const navigate = useNavigate(); // <-- Navigate hook initialize kiya
  const [userName, setUserName] = useState("User");
  const [userRole, setUserRole] = useState("role");

  useEffect(() => {
    // LocalStorage se logged-in user ka naam nikalna
    const savedName = localStorage.getItem("user_name");
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  useEffect(() => {
    // LocalStorage se logged-in user ka naam nikalna
    const savedRole = localStorage.getItem("role");
    
    if (savedRole) {
      setUserRole(savedRole);
    }
  }, []);
  
  

  // Initials (Jaise Srashti Agarwal -> SA) generate karne ke liye helper
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleLogout = () => {
    // 1. Token ko localStorage se delete karna
    localStorage.removeItem("access_token");
    
    // 2. User ko login page par redirect karna
    navigate("/login", { replace: true });
  };

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
                {getInitials(userName)}
              </div>
              <div className="text-left">
                <span className="block text-sm font-semibold text-slate-900">{userName}</span>
                <span className="block text-[11px] text-slate-500">{userRole}</span>
              </div>
            </div>

            {/* Logout Button added here */}
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

export default DashboardLayout;