import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Layers,
  Users,
  Building2,
  ChevronDown,
  CircleDot,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";

// Statistics Data
const stats = [
  {
    label: "RESEARCH PAPERS",
    value: 10204,
    suffix: "",
    sub: "Indexed across grants & labs.",
    icon: FileText,
  },
  {
    label: "ACTIVE RESEARCHERS",
    value: 1538,
    suffix: "",
    sub: "Faculty & collaborators in sync.",
    icon: Users,
  },
  {
    label: "LIVE PROJECTS",
    value: 352,
    suffix: "",
    sub: "Shared timelines & workflows.",
    icon: Layers,
  },
  {
    label: "DEPARTMENTS",
    value: 41,
    suffix: "",
    sub: "CS, medicine, engineering & more.",
    icon: Building2,
  },
];

// Original Data
const papers = [
  {
    id: "RP-2048",
    tags: ["Environmental AI", "Peer Review"],
    title: "Adaptive Graph Models for Predictive Climate Resilience Planning",
    authors: "Dr. Leila Morgan · Aarav Patel · Sofia Chen",
    citations: 128,
    status: "Peer Review",
  },
  {
    id: "RP-1872",
    tags: ["Health Informatics", "Ready to Publish"],
    title:
      "Federated Medical Imaging Pipelines for Cross-Institutional Diagnostics",
    authors: "Prof. Nadia Mensah · Jonas Richter",
    citations: 94,
    status: "Ready to Publish",
  },
  {
    id: "RP-1664",
    tags: ["Research Systems", "Draft"],
    title:
      "Collaborative Knowledge Mapping in Multi-Disciplinary Research Teams",
    authors: "Elena Park · Samuel Okoye · Mina Ross",
    citations: 31,
    status: "Draft",
  },
  {
    id: "RP-1530",
    tags: ["Cybersecurity", "In Revision"],
    title: "Quantum-Safe Identity Layers for Academic Infrastructure",
    authors: "Ibrahim Hassan · Dr. Yuki Sato",
    citations: 67,
    status: "In Revision",
  },
];

const tasks = [
  {
    label: "Resolve peer review comments for federated imaging paper",
    meta: "Jonas Richter · Today, 4:00 PM",
  },
  {
    label: "Finalize ethics appendix for BlueGrid Climate Archive",
    meta: "Dr. Leila Morgan · Tomorrow",
  },
  {
    label: "Prepare collaborator invite list for Civic Insight Observatory",
    meta: "Mina Ross · May 21",
  },
];

const activities = [
  {
    text: "Jonas Richter uploaded a new paper",
    meta: "Federated Imaging · 2m ago",
  },
  { text: "Dr. Leila Morgan joined BlueGrid Archive", meta: "1h ago" },
];

export default function Overview() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("All"); // "All", "Peer Review", "Ready to Publish", "Draft", "In Revision"

  // Ref for Filter Dropdown to handle click-outside
  const filterRef = useRef(null);

  // Close Filter when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  // Listen for the "closeFilter" event triggered by the Notification dropdown in DashboardShell
  useEffect(() => {
    const handleCloseFilter = () => setIsFilterOpen(false);
    window.addEventListener("closeFilter", handleCloseFilter);
    return () => window.removeEventListener("closeFilter", handleCloseFilter);
  }, []);

  // Functional Filter Logic
  const filteredPapers = useMemo(() => {
    if (filterBy === "All") return papers;
    return papers.filter((p) => p.tags.includes(filterBy));
  }, [filterBy]);

  const statusColor = (status) => {
    if (status === "Peer Review") return "text-blue-600 bg-blue-50";
    if (status === "Ready to Publish") return "text-emerald-700 bg-emerald-50";
    if (status === "Draft") return "text-slate-600 bg-slate-100";
    return "text-amber-700 bg-amber-50"; // In Revision
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div>
        <div className="text-xs text-slate-500 font-medium mb-1">
          Welcome back,
        </div>
        <h1 className="text-3xl font-extrabold text-[#0f111a] tracking-tight">
          Dr. Leila Morgan
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5 mt-7">
        {stats.map((s) => (
          <motion.div
            key={s.label}
            whileHover={{ y: -4, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-3xl bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-6 transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-9 w-9 rounded-xl bg-linear-to-br from-indigo-50 to-violet-50 border border-indigo-100/60 flex items-center justify-center shadow-sm">
                <s.icon size={16} className="text-indigo-500" />
              </div>
            </div>
            <div className="text-[10px] font-bold tracking-[0.12em] text-slate-400 uppercase mb-1">
              {s.label}
            </div>
            <div className="text-3xl font-extrabold text-[#0f111a] tracking-tight">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs text-slate-400 mt-1.5">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-[1fr_380px] gap-5 mt-7">
        {/* Recent Papers */}
        <div className="rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-8">
          <div
            className="flex items-center justify-between mb-6 relative"
            ref={filterRef}
          >
            <div>
              <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                Research Pipeline
              </div>
              <h2 className="text-xl font-extrabold text-[#0f111a] tracking-tight">
                Recent Papers
              </h2>
            </div>

            {/* FUNCTIONAL FILTER DROPDOWN */}
            <div className="relative z-20">
              <button
                onClick={() => {
                  setIsFilterOpen(!isFilterOpen);
                  // Force close the Notification dropdown via custom event
                  window.dispatchEvent(new CustomEvent("closeNotif"));
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 border border-slate-200/50 text-xs font-semibold text-slate-600 shadow-sm hover:shadow transition-all duration-200"
              >
                {filterBy === "All" ? "Filter" : filterBy}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 overflow-hidden"
                  >
                    {[
                      "All",
                      "Peer Review",
                      "Ready to Publish",
                      "Draft",
                      "In Revision",
                    ].map((item) => (
                      <button
                        key={item}
                        onClick={() => {
                          setFilterBy(item);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filterBy === item ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-indigo-50"}`}
                      >
                        {item}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-5">
            {filteredPapers.map((p, idx) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`${idx !== 0 ? "border-t border-slate-200/40 pt-5" : ""} block group cursor-pointer`}
                whileHover={{ x: 6 }}
              >
                <div className="flex items-start gap-4 pt-0.5">
                  <div className="text-[11px] text-slate-400 font-medium w-14 shrink-0 pt-0.5">
                    {p.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {p.tags.map((t) => (
                        <span
                          key={t}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusColor(t)}`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-[#0f111a] leading-snug mb-1 group-hover:text-indigo-600 transition-colors">
                      {p.title}
                    </h3>
                    <div className="text-xs text-slate-400">{p.authors}</div>
                  </div>
                  <div className="text-right shrink-0 pl-4">
                    <div className="text-lg font-extrabold text-[#0f111a]">
                      {p.citations}
                    </div>
                    <div className="text-[10px] text-slate-400 tracking-[0.08em] uppercase">
                      Citations
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Priority Tasks */}
          <div className="rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-6">
            <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-5">
              Active Workspace
            </div>
            <h3 className="text-xl font-extrabold text-[#0f111a] tracking-tight mb-6">
              Priority Tasks
            </h3>
            <div className="space-y-4">
              {tasks.map((t, i) => (
                <label
                  key={i}
                  className="flex items-start gap-3 group cursor-pointer"
                >
                  <input
                    type="checkbox"
                    className="mt-0.5 h-5 w-5 rounded-md border-2 border-slate-200 text-indigo-500 focus:ring-indigo-200 accent-indigo-500"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[#0f111a] leading-snug group-hover:text-indigo-600 transition-colors">
                      {t.label}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                      <CircleDot size={10} className="text-indigo-400" />
                      {t.meta}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-6">
            <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-5">
              Live Feed
            </div>
            <h3 className="text-xl font-extrabold text-[#0f111a] tracking-tight mb-6">
              Activity
            </h3>
            <div className="space-y-5">
              {activities.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <p className="text-sm text-[#1a1b23] font-medium leading-snug">
                    <span className="font-bold">
                      {a.text.split(" ")[0]} {a.text.split(" ")[1]}
                    </span>{" "}
                    {a.text.split(" ").slice(2).join(" ")}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{a.meta}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insight banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-[28px] bg-linear-to-r from-[#0f111a] via-[#16182a] to-[#0f111a] text-white p-8 shadow-2xl shadow-indigo-900/20 relative overflow-hidden mt-7"
      >
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative z-10 flex items-start gap-6">
          <div className="h-14 w-14 rounded-2xl bg-linear-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-xl shadow-indigo-400/20 shrink-0">
            <Sparkles size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold tracking-[0.15em] text-indigo-300 uppercase mb-1.5">
              ScholarOS Insight
            </div>
            <h3 className="text-xl font-extrabold tracking-tight mb-2">
              Your reviewer turnaround is accelerating.
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">
              Teams using structured paper threads and visible milestone
              ownership are closing feedback loops 3x faster.
            </p>
          </div>
          <button className="self-center shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            View Analytics <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
