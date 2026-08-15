import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("nazifa@gmail.com");
  const [password, setPassword] = useState("••••••••");
  const [taskNotifications, setTaskNotifications] = useState(true);
  const [paperReviewNotifications, setPaperReviewNotifications] =
    useState(true);
  const [projectActivityNotifications, setProjectActivityNotifications] =
    useState(true);
  const [projectInvitationNotifications, setProjectInvitationNotifications] =
    useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [publishedVisibility, setPublishedVisibility] = useState(true);
  const [allowProjectInvitations, setAllowProjectInvitations] = useState(true);
  const [theme, setTheme] = useState("Light");
  const [language, setLanguage] = useState("English (US)");
  const [timezone, setTimezone] = useState("GMT+6 · Dhaka");
  const [notice, setNotice] = useState(null);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2600);
  };

  const saveChanges = () => showNotice("Settings saved successfully.");
  const handleDeactivate = () => {
    setIsDeactivateModalOpen(false);
    showNotice("Account deactivation request submitted. (Placeholder)");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-8 w-full relative"
    >
      <div>
        <div className="mb-1 text-xs font-medium text-slate-500">Account</div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#171827]">
          Settings
        </h1>
      </div>

      <div className="space-y-5">
        {/* Account & Security */}
        <section className="rounded-[24px] border border-white/80 bg-white/65 p-7 shadow-[0_16px_36px_rgba(35,42,83,0.07)] backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Login
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1d2030]">
            Account & Security
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#1d2030]">
                Email Address
              </span>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 text-sm text-[#1d2030] outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/60"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#1d2030]">
                Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200/80 bg-white/70 px-4 text-sm text-[#1d2030] outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/60"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => showNotice("Password change flow initiated.")}
              className="h-10 rounded-xl border border-slate-200/80 bg-white/65 px-5 text-sm font-bold text-slate-500 transition-colors"
            >
              Change Password
            </button>
            <button
              type="button"
              onClick={() =>
                showNotice("Two-factor authentication setup started.")
              }
              className="h-10 rounded-xl border border-slate-200/80 bg-white/65 px-5 text-sm font-bold text-slate-500 transition-colors"
            >
              Enable Two-Factor Authentication
            </button>
          </div>

          <div className="mt-5 border-t border-slate-200/80 pt-5">
            <p className="text-sm font-bold text-[#1d2030]">
              Active login sessions
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Chrome on macOS · Dhaka, BD · Current device
            </p>
            <button
              type="button"
              onClick={() => showNotice("All other devices signed out.")}
              className="mt-3 h-10 rounded-xl border border-slate-200/80 bg-white/65 px-5 text-sm font-bold text-slate-500 transition-colors"
            >
              Sign out everywhere else
            </button>
          </div>
        </section>

        {/* Notification Settings */}
        <section className="rounded-[24px] border border-white/80 bg-white/65 p-7 shadow-[0_16px_36px_rgba(35,42,83,0.07)] backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Preferences
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1d2030]">
            Notification Settings
          </h2>

          <div className="mt-5 divide-y divide-slate-200/80">
            <ToggleRow
              label="Task assignments"
              description="Get notified when you're assigned a new task."
              checked={taskNotifications}
              onChange={setTaskNotifications}
            />
            <ToggleRow
              label="Paper review comments"
              description="Get notified when someone comments on your paper."
              checked={paperReviewNotifications}
              onChange={setPaperReviewNotifications}
            />
            <ToggleRow
              label="Project activity"
              description="Get notified about updates within your active projects."
              checked={projectActivityNotifications}
              onChange={setProjectActivityNotifications}
            />
            <ToggleRow
              label="Project invitations"
              description="Get notified when you're invited to a project."
              checked={projectInvitationNotifications}
              onChange={setProjectInvitationNotifications}
            />
            <ToggleRow
              label="Weekly digest email"
              description="A summary of activity across your workspace."
              checked={weeklyDigest}
              onChange={setWeeklyDigest}
            />
          </div>
        </section>

        {/* Privacy Settings */}
        <section className="rounded-[24px] border border-white/80 bg-white/65 p-7 shadow-[0_16px_36px_rgba(35,42,83,0.07)] backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            Visibility
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1d2030]">
            Privacy
          </h2>

          <div className="mt-5 divide-y divide-slate-200/80">
            <ToggleRow
              label="Public researcher profile"
              description="Allow other researchers to view your profile and publications."
              checked={publicProfile}
              onChange={setPublicProfile}
            />
            <ToggleRow
              label="Show email on profile"
              description="Display your email address to other logged-in researchers."
              checked={showEmail}
              onChange={setShowEmail}
            />
            <ToggleRow
              label="Who can view published research"
              description="Allow everyone or only collaborators to view your published works."
              checked={publishedVisibility}
              onChange={setPublishedVisibility}
            />
            <ToggleRow
              label="Allow project invitations"
              description="Let faculty invite you to new research projects directly."
              checked={allowProjectInvitations}
              onChange={setAllowProjectInvitations}
            />
          </div>
        </section>

        {/* Preferences */}
        <section className="rounded-[24px] border border-white/80 bg-white/65 p-7 shadow-[0_16px_36px_rgba(35,42,83,0.07)] backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
            General
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1d2030]">
            Preferences
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#1d2030]">
                Theme
              </span>
              <select
                value={theme}
                onChange={(event) => setTheme(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200/80 bg-white/70 px-4 pr-10 text-sm text-[#1d2030] outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/60"
              >
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#1d2030]">
                Language
              </span>
              <select
                value={language}
                onChange={(event) => setLanguage(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200/80 bg-white/70 px-4 pr-10 text-sm text-[#1d2030] outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/60"
              >
                <option>English (US)</option>
                <option>English (UK)</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-[#1d2030]">
                Time Zone
              </span>
              <select
                value={timezone}
                onChange={(event) => setTimezone(event.target.value)}
                className="h-11 w-full appearance-none rounded-xl border border-slate-200/80 bg-white/70 px-4 pr-10 text-sm text-[#1d2030] outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100/60"
              >
                <option>GMT+6 · Dhaka</option>
                <option>GMT-5 · New York</option>
                <option>GMT+0 · London</option>
                <option>GMT+1 · Berlin</option>
              </select>
            </label>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="rounded-[24px] border border-red-200/60 bg-white/65 p-7 shadow-[0_16px_36px_rgba(220,38,38,0.08)] backdrop-blur-md">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-500">
            Danger Zone
          </p>
          <h2 className="text-xl font-extrabold tracking-tight text-[#1d2030]">
            Deactivate Account
          </h2>

          <div className="mt-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-red-500">
                Deactivate my account
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">
                Your profile and data will be hidden from other researchers.
                This can be reversed by contacting your department admin.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsDeactivateModalOpen(true)}
              className="h-10 rounded-xl border border-red-200/60 bg-red-50 px-5 text-sm font-bold text-red-500 transition-colors"
            >
              Deactivate
            </button>
          </div>
        </section>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="h-11 rounded-xl border border-slate-200/80 bg-white/65 px-6 text-sm font-bold text-slate-500 shadow-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={saveChanges}
            className="h-11 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-6 text-sm font-bold text-white shadow-lg shadow-indigo-300/35 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>

      {/* Confirmation Dialog for Deactivate */}
      <AnimatePresence>
        {isDeactivateModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
            onClick={() => setIsDeactivateModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-md rounded-[24px] bg-white/90 backdrop-blur-xl border border-white/80 p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsDeactivateModalOpen(false)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-extrabold text-[#1d2030]">
                Deactivate account?
              </h2>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                You will lose access to your projects, papers, and collaboration
                data. This action can be reversed by contacting your admin.
              </p>
              <div className="mt-8 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDeactivateModalOpen(false)}
                  className="h-10 rounded-xl border border-slate-200/80 bg-white/65 px-6 text-sm font-bold text-slate-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeactivate}
                  className="h-10 rounded-xl bg-red-500 px-6 text-sm font-bold text-white transition-colors shadow-lg shadow-red-500/30"
                >
                  Deactivate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {notice && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-[#151827] px-5 py-3 text-sm font-bold text-white shadow-2xl"
        >
          {notice}
        </div>
      )}
    </motion.div>
  );
}

function ToggleRow({ label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
      <div>
        <div className="text-sm font-bold text-[#1d2030]">{label}</div>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-indigo-100 ${
          checked
            ? "bg-gradient-to-r from-indigo-500 to-cyan-400"
            : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white shadow-md transition-transform ${
            checked ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
