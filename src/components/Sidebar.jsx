import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/download.svg";
import { isAdmin } from "../utils/auth";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition
     ${
       isActive ? "bg-indigo-600 text-white" : "text-gray-700 hover:bg-gray-100"
     }`;

  return (
    <aside className="w-56 bg-white shadow-sm flex flex-col">
      {/* LOGO */}
      <div className="flex items-center gap-3 px-6 py-4 border-b">
        <img src={logo} alt="FlowCRM" className="w-8" />
        <span className="text-xl font-bold text-indigo-600">FlowCRM</span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        <NavLink to="/" className={linkClass}>
          📊 Dashboard
        </NavLink>

        {isAdmin() && (
          <NavLink to="/users" className={linkClass}>
            👥 Users
          </NavLink>
        )}
        <NavLink to="/company" className={linkClass}>
          🏢 Company
        </NavLink>
        <NavLink to="/campaigns" className={linkClass}>
          🎯 Campaigns
        </NavLink>

        <NavLink to="/customers" className={linkClass}>
          🧑 Customers
        </NavLink>

        <NavLink to="/leads" className={linkClass}>
          📋 Leads
        </NavLink>

        <NavLink to="/follow-up" className={linkClass}>
          ⏰ Follow Up
        </NavLink>

        <NavLink to="/activity-logs" className={linkClass}>
          📝 Activity Logs
        </NavLink>

        <NavLink to="/email-templates" className={linkClass}>
            📧 Email Templates
        </NavLink>
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
