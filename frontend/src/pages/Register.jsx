import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../components/Alert.jsx";
import Loader from "../components/Loader.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register, authLoading, authError } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [formError, setFormError] = useState("");

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setFormError("");
    if (form.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (result.ok) navigate("/dashboard");
  }

  return (
    <section className="mx-auto w-full max-w-md">
      <div className="card p-6">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-500">Start booking and tracking your trips.</p>

        {formError ? <div className="mt-4"><Alert type="error" message={formError} /></div> : null}
        {authError ? <div className="mt-4"><Alert type="error" message={authError} /></div> : null}

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <label className="space-y-1">
            <span className="label">Full name</span>
            <input className="input" name="name" value={form.name} onChange={onChange} required />
          </label>
          <label className="space-y-1">
            <span className="label">Email</span>
            <input className="input" name="email" type="email" value={form.email} onChange={onChange} required />
          </label>
          <label className="space-y-1">
            <span className="label">Password</span>
            <input className="input" name="password" type="password" value={form.password} onChange={onChange} required />
          </label>
          <label className="space-y-1">
            <span className="label">Confirm password</span>
            <input
              className="input"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={onChange}
              required
            />
          </label>
          <button className="btn-primary w-full" disabled={authLoading} type="submit">
            {authLoading ? "Creating account..." : "Register"}
          </button>
        </form>

        {authLoading ? <Loader label="Creating your account..." /> : null}

        <p className="mt-4 text-sm text-slate-600">
          Already have an account?{" "}
          <Link className="font-semibold text-brand-700 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </div>
    </section>
  );
}

