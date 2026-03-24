import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const { login, authLoading, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    const result = await login(form);
    if (result.ok) navigate(from, { replace: true });
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Login to continue booking your next trip.</p>

        {authError ? <div className="mt-4"><Alert type="error" message={authError} /></div> : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="space-y-1">
            <span className="label">Email</span>
            <input className="input" name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label className="space-y-1">
            <span className="label">Password</span>
            <input className="input" name="password" type="password" value={form.password} onChange={onChange} required />
          </label>
          <button className="btn-primary w-full" disabled={authLoading} type="submit">
            {authLoading ? "Signing in..." : "Login"}
          </button>
        </form>

        {authLoading ? <Loader label="Authenticating..." /> : null}

        <p className="mt-4 text-sm text-slate-600">
          No account?{" "}
          <Link className="font-semibold text-brand-700 hover:underline" to="/register">
            Register
          </Link>
        </p>
      </div>
    </section>
  );
}

