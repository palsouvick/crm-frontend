import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded transition ${
      isActive
        ? "bg-blue-600 text-white"
        : "text-gray-700 hover:bg-gray-200"
    }`;

  return (
    <aside className="w-64 bg-white shadow">
      <div className="p-4 text-xl font-bold border-b">
        CRM System
      </div>

      <nav className="p-4 space-y-2">
        <NavLink to="/" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/users" className={linkClass}>
          Users
        </NavLink>
        
        <NavLink to="/customers" className={linkClass}>
          Customers
        </NavLink>

        <NavLink to="/leads" className={linkClass}>
          Leads
        </NavLink>
        
        <NavLink to="/follow-up" className={linkClass}>
          Follow Up
        </NavLink>

        <NavLink to="/activity-logs" className={linkClass}>
          Activity Logs
        </NavLink>

        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 rounded text-red-600 hover:bg-red-100"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
