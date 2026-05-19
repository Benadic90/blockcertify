import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: searchParams.get("role") === "student" ? "student" : "admin"
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    navigate(user.role === "admin" ? "/admin" : "/student", { replace: true });
  }, [navigate, user]);

  const onChange = (event) => {
    setFormData((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const loggedInUser = await login(formData.email, formData.password);
      if (loggedInUser.role !== formData.role) {
        toast("Logged in, role switched by account settings.", { icon: "ℹ️" });
      } else {
        toast.success("Login successful.");
      }
      navigate(loggedInUser.role === "admin" ? "/admin" : "/student", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-md items-center px-4 py-10">
      <section className="glass-card w-full p-6">
        <h1 className="font-heading text-2xl font-bold text-slate-900">Login to BlockCertify</h1>
        <p className="mt-1 text-sm text-slate-600">Role-based secure access for admin and students.</p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
              placeholder={formData.role === "admin" ? "admin@blockcertify.com" : "student@email.com"}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={onChange}
              className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2 focus:border-teal-600 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default LoginPage;
