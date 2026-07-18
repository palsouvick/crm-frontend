import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Megaphone,
  UserCircle,
  ClipboardList,
  Clock,
  FileText,
  Mail,
  LogOut,
} from "lucide-react";
import clsx from "clsx";
import logo from "../assets/download.svg";
import { isAdmin } from "../utils/auth";

const navItems = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard, end: true },
  { to: "/users", label: "Users", Icon: Users, adminOnly: true },
  { to: "/company", label: "Company", Icon: Building2 },
  { to: "/campaigns", label: "Campaigns", Icon: Megaphone, adminOnly: true },
  { to: "/customers", label: "Customers", Icon: UserCircle },
  { to: "/leads", label: "Leads", Icon: ClipboardList },
  { to: "/follow-up", label: "Follow Up", Icon: Clock },
  { to: "/activity-logs", label: "Activity Logs", Icon: FileText },
  { to: "/email-templates", label: "Email Templates", Icon: Mail },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="w-56 shrink-0 sticky top-0 h-screen bg-surface border-r border-border flex flex-col">
      {/* LOGO */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border">
        <img src={logo} alt="FlowCRM" className="w-8" />
        <span className="text-xl font-bold text-primary-600">FlowCRM</span>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          if (item.adminOnly && !isAdmin()) return null;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 px-4 py-2 rounded-control text-sm font-medium transition",
                  isActive
                    ? "bg-primary-600 text-white"
                    : "text-ink-muted hover:bg-surface-hover hover:text-ink"
                )
              }
            >
              <item.Icon size={18} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-control text-sm font-medium text-danger-600 hover:bg-danger-100 cursor-pointer"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
