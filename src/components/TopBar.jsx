import { useState } from "react";
import { useNavigate } from "react-router-dom";

const TopBar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white px-6 py-3 shadow-sm flex justify-between items-center">
      
      {/* PAGE TITLE */}
      <h1 className="text-lg font-semibold text-gray-800">
        Dashboard
      </h1>

      {/* RIGHT ACTIONS */}
      <div className="flex items-center gap-4 relative">
        
        {/* SEARCH (optional, future ready) */}
        <input
          type="text"
          placeholder="Search..."
          className="hidden md:block px-3 py-1.5 border rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* USER AVATAR */}
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold"
        >
          U
        </button>

        {/* DROPDOWN */}
        {open && (
          <div className="absolute right-0 top-12 w-40 bg-white border rounded-lg shadow-md overflow-hidden">
            <button
              onClick={() => {
                setOpen(false);
                navigate("/profile");
              }}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              👤 Profile
            </button>

            <button
              onClick={logout}
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default TopBar;
