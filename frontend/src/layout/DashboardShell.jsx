import { Link, NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  BookOpenText,
  FolderKanban,
  Home,
  LayoutDashboard,
  Search,
  Settings,
  Sparkles,
  Users2,
  Menu,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { cn } from "../utils/cn.js";

// Sidebar menu items
const workspaceItems = [
  { label: "Overview", icon: LayoutDashboard, to: "/dashboard" },
  { label: "Projects", icon: FolderKanban, to: "/dashboard/projects" },
  { label: "Papers", icon: BookOpenText, to: "/dashboard/papers" },
  { label: "Researchers", icon: Users2, to: "/dashboard/researchers" },
];

const accountItems = [
  { label: "Notifications", icon: Bell, to: "/dashboard/notifications" },
  { label: "Settings", icon: Settings, to: "/dashboard/settings" },
];

export default function DashboardShell() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [notifRef]);

  useEffect(() => {
    const handleCloseNotif = () => setIsNotifOpen(false);
    window.addEventListener("closeNotif", handleCloseNotif);
    return () => window.removeEventListener("closeNotif", handleCloseNotif);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("scholaros_user");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#eceff5] flex text-[#1a1b23]">
      {/* SIDEBAR */}
      <aside className="w-[260px] shrink-0 bg-[#0f111a] text-white flex flex-col h-screen sticky top-0 overflow-hidden">
        <div className="px-6 pt-7 pb-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <span className="font-bold text-lg">S</span>
            </div>
            <div>
              <div className="font-bold text-base leading-tight">ScholarOS</div>
              <div className="text-[11px] text-slate-400 tracking-[0.15em] uppercase">
                Enterprise Suite
              </div>
            </div>
          </Link>
        </div>

        <nav className="px-4 flex-1 space-y-1 overflow-y-auto pb-4">
          <div className="text-[10px] text-slate-500 font-semibold tracking-[0.18em] uppercase mb-3 px-2 mt-4">
            Workspace
          </div>
          {workspaceItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/5 ring-1 ring-white/10 text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]"
                    : "text-slate-300 hover:text-white hover:bg-white/5",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "h-8 w-8 rounded-lg flex items-center justify-center",
                      isActive
                        ? "bg-linear-to-br from-indigo-400 to-violet-400 shadow-md shadow-indigo-400/30"
                        : "bg-transparent",
                    )}
                  >
                    <Icon
                      size={15}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-white"
                      }
                    />
                  </span>
                  {label}
                </>
              )}
            </NavLink>
          ))}

          <div className="text-[10px] text-slate-500 font-semibold tracking-[0.18em] uppercase mt-8 mb-3 px-2">
            Account
          </div>
          {accountItems.map(({ label, icon: Icon, to }) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/5 ring-1 ring-white/10 text-white"
                    : "text-slate-400 hover:text-white hover:bg-white/5",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      isActive ? "bg-indigo-400" : "bg-slate-700",
                    )}
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Promotional Card & User Profile Footer */}
        <div className="p-4 shrink-0">
          <div className="rounded-2xl bg-linear-to-br from-indigo-600/30 to-violet-600/20 border border-white/5 p-5 backdrop-blur-xl">
            <h4 className="font-bold text-white text-sm mb-1">
              Publish with confidence
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Coordinate literature without context switching.
            </p>
          </div>

          <div className="mt-4 px-3 py-3 rounded-2xl bg-white/5 flex items-center gap-3 border border-white/5">
            <div className="h-9 w-9 rounded-full bg-linear-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-md shadow-indigo-400/20 text-white text-xs font-bold">
              LM
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-white">
                Dr. Leila Morgan
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto relative">
        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-30 px-8 py-5 flex items-center justify-between bg-[#eceff5]/80 backdrop-blur-xl border-b border-slate-200/40">
          <div>
            <div className="text-xs text-slate-400 font-medium">
              Home /{" "}
              <span className="text-slate-700 font-semibold">Dashboard</span>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-6">
            <div className="relative">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Search papers, projects..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white/60 border border-white/20 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* NOTIFICATION BELL WITH DROPDOWN */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  window.dispatchEvent(new CustomEvent("closeFilter"));
                }}
                className="h-10 w-10 rounded-full bg-white/70 border border-white/30 flex items-center justify-center shadow-sm hover:shadow-md transition-shadow text-slate-500"
              >
                <Bell size={18} />
              </button>
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />

              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40"
                  >
                    <div className="text-sm font-bold text-slate-800 mb-3">
                      Notifications
                    </div>
                    <div className="space-y-3">
                      <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100/50">
                        <div className="text-sm font-medium text-slate-900">
                          New review added
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          Prof. Mensah commented on Methods.
                        </div>
                      </div>
                      <div className="p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <div className="text-sm font-medium text-slate-900">
                          Deadline approaching
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          BlueGrid Climate Archive due in 5d.
                        </div>
                      </div>
                      <div className="p-3 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                        <div className="text-sm font-medium text-slate-900">
                          Milestone completed
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          128 citations verified.
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="h-10 w-10 rounded-full bg-linear-to-br from-indigo-500 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-400/20 text-sm font-bold">
              LM
            </button>
            <div className="pl-1">
              <div className="text-sm font-bold text-slate-800 leading-tight">
                Leila Morgan
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Online
              </div>
            </div>
          </div>
        </header>

        <div className="px-8 py-7 space-y-7 max-w-7xl mx-auto">
          <Outlet />
        </div>

        {/* Mobile Sidebar Overlay */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="fixed bottom-6 left-6 z-40 lg:hidden inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#0f111a] text-white shadow-xl"
        >
          <Menu size={20} />
        </button>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <motion.div
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
                className="w-[260px] h-full bg-[#0f111a] p-6 flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-sm">
                      S
                    </div>
                    <span className="font-bold text-white text-base">
                      ScholarOS
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <nav className="mt-6 space-y-1 flex-1 overflow-y-auto">
                  {[...workspaceItems, ...accountItems].map(
                    ({ label, icon: Icon, to }) => (
                      <NavLink
                        key={label}
                        to={to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors",
                            isActive
                              ? "bg-white/10 text-white"
                              : "text-slate-400 hover:text-white hover:bg-white/5",
                          )
                        }
                      >
                        {({ isActive }) => (
                          <>
                            <span
                              className={cn(
                                "h-2 w-2 rounded-full",
                                isActive ? "bg-indigo-400" : "bg-slate-600",
                              )}
                            />
                            {label}
                          </>
                        )}
                      </NavLink>
                    ),
                  )}
                </nav>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
