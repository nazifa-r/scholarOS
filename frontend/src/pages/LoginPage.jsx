import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import AuthLayout from "../layout/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import { cn } from "../utils/cn.js";

const initialState = {
  email: "",
  password: "",
  remember: true,
};

const ALLOWED_USERS = {
  "tanjim@gmail.com": "12345678",
  "nazifa@gmail.com": "12345678",
  "asif@gmail.com": "12345678",
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const inputClass = useMemo(
    () =>
      "w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface-elevated)] px-4 py-3.5 text-[var(--text-primary)] shadow-sm outline-none backdrop-blur-xl placeholder:text-[var(--text-muted)] focus:border-blue-300 focus:ring-4 focus:ring-blue-100",
    [],
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});

    const { email, password } = form;

    if (ALLOWED_USERS[email] && ALLOWED_USERS[email] === password) {
      localStorage.setItem("scholaros_user", "true");
      navigate("/dashboard");
    } else {
      setErrors({ general: "Invalid email or password. Please try again." });
    }
  };

  return (
    <AuthLayout
      title="Login to your workspace"
      subtitle="Access your papers, projects, collaborators, and publication pipeline in one place."
      sideTitle="Secure access for focused research operations."
      sideDescription="ScholarOS gives researchers a premium collaboration environment without the noise of generic productivity tools."
      footerText="Don’t have an account?"
      footerAction={
        <Link
          to="/register"
          className="font-semibold text-[var(--badge-blue-text)] hover:text-blue-800"
        >
          Create one
        </Link>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-600 text-center"
          >
            {errors.general}
          </motion.div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Email address
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="email"
              value={form.email}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  email: event.target.value,
                }))
              }
              placeholder="you@institution.edu"
              className={cn(
                inputClass,
                "pl-11",
                errors.general &&
                  "border-rose-300 focus:border-rose-300 focus:ring-rose-100",
              )}
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-primary)]">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  password: event.target.value,
                }))
              }
              placeholder="Enter your password"
              className={cn(
                inputClass,
                "pl-11 pr-11",
                errors.general &&
                  "border-rose-300 focus:border-rose-300 focus:ring-rose-100",
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-sm text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-3">
            <input
              type="checkbox"
              checked={form.remember}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  remember: event.target.checked,
                }))
              }
              className="h-4 w-4 rounded border-[var(--border)] text-blue-600 focus:ring-blue-200"
            />
            Remember me
          </label>
          <a
            href="/"
            className="font-medium text-[var(--badge-blue-text)] hover:text-blue-800"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          className="w-full justify-center py-3.5 text-base"
        >
          Login
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-[28px] border border-blue-100 bg-blue-50/70 p-5 text-sm leading-7 text-slate-600"
        >
          <p className="font-semibold text-slate-800 mb-1">Demo Credentials:</p>
          <div className="space-y-1 text-slate-500 text-xs">
            <p>tanjim@gmail.com / 12345678</p>
            <p>nazifa@gmail.com / 12345678</p>
            <p>asif@gmail.com / 12345678</p>
          </div>
        </motion.div>
      </form>
    </AuthLayout>
  );
}
