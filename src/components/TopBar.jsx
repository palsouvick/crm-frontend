import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Sun, Moon, User as UserIcon, LogOut } from "lucide-react";
import Input from "./ui/Input";
import { getUser } from "../utils/auth";
import { getTheme, toggleTheme } from "../lib/theme";

const ROUTE_TITLES = [
  { path: "/", title: "Dashboard" },
  { path: "/profile", title: "Profile" },
  { path: "/campaigns", title: "Campaigns" },
  { path: "/users", title: "Users" },
  { path: "/customers", title: "Customers" },
  { path: "/leads", title: "Leads" },
  { path: "/follow-up", title: "Follow Up" },
  { path: "/activity-logs", title: "Activity Logs" },
  { path: "/email-templates", title: "Email Templates" },
  { path: "/company", title: "Company" },
];

const getPageTitle = (pathname) => {
  const exact = ROUTE_TITLES.find((r) => r.path === pathname);
  if (exact) return exact.title;

  const match = ROUTE_TITLES.filter(
    (r) => r.path !== "/" && pathname.startsWith(r.path)
  ).sort((a, b) => b.path.length - a.path.length)[0];

  return match?.title || "FlowCRM";
};

const TopBar = ({ onSearch }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [theme, setThemeState] = useState(getTheme());
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleThemeToggle = () => {
    setThemeState(toggleTheme());
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <header className="sticky top-0 z-10 bg-surface border-b border-border px-6 py-3 flex justify-between items-center">
      {/* PAGE TITLE */}
      <h1 className="text-h4 font-semibold text-ink">
        {getPageTitle(location.pathname)}
      </h1>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4 relative">
        <div className="hidden md:block w-56">
          <Input
            size="sm"
            type="text"
            placeholder="Search..."
            value={search}
            leftIcon={<Search size={16} />}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearch?.(e.target.value);
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleThemeToggle}
          aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
          className="w-9 h-9 rounded-full flex items-center justify-center text-ink-muted hover:bg-surface-hover cursor-pointer"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-primary-600 text-white flex items-center justify-center font-semibold cursor-pointer"
        >
          {initials}
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-40 bg-surface border border-border rounded-control shadow-lg overflow-hidden">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-ink hover:bg-surface-hover cursor-pointer"
            >
              <UserIcon size={16} />
              Profile
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-danger-600 hover:bg-danger-100 cursor-pointer"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
