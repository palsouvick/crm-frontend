import logo from "../assets/download.svg";

// Shared shell for the auth pages (Login, Register, Forgot Password):
// the brand panel + centered form column. Each page supplies its own
// heading/description for the brand panel and its form as children.
const AuthLayout = ({ heading, description, children }) => {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* LEFT BRAND PANEL */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-indigo-600 to-indigo-500 text-white">
        <div>
          <img src={logo} alt="FlowCRM" className="w-12 mb-6" />
          <h1 className="text-4xl font-bold mb-4">{heading}</h1>
          <p className="text-indigo-100 max-w-md">{description}</p>
        </div>

        <p className="text-sm text-indigo-200">
          © {new Date().getFullYear()} FlowCRM. All rights reserved.
        </p>
      </div>

      {/* RIGHT FORM COLUMN */}
      <div className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;
