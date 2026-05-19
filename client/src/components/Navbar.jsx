import { Link, NavLink, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import WalletConnect from "./WalletConnect";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <Link to="/" className="font-heading text-xl font-bold text-teal-800">
          BlockCertify
        </Link>
        <nav className="flex items-center gap-2 md:gap-4">
          <NavLink
            to="/verify"
            className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100"
          >
            Verify
          </NavLink>
          {user?.role === "admin" && (
            <NavLink
              to="/admin"
              className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Admin
            </NavLink>
          )}
          {user?.role === "student" && (
            <NavLink
              to="/student"
              className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              Student
            </NavLink>
          )}
          <WalletConnect />
          {user ? (
            <button type="button" className="btn-primary text-sm" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link className="btn-primary text-sm" to="/login">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
