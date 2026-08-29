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
  ShieldCheck,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AnimatedCounter from "../../components/ui/AnimatedCounter.jsx";
import { apiRequest } from "../../utils/api.js";

const stats = [
  { label: "RESEARCH PAPERS", value: 10204, suffix: "", sub: "Indexed across grants & labs.", icon: FileText },
  { label: "ACTIVE RESEARCHERS", value: 1538, suffix: "", sub: "Faculty & collaborators in sync.", icon: Users },
  { label: "LIVE PROJECTS", value: 352, suffix: "", sub: "Shared timelines & workflows.", icon: Layers },
  { label: "DEPARTMENTS", value: 41, suffix: "", sub: "CS, medicine, engineering & more.", icon: Building2 },
];

const papers = [
  { id: "RP-2048", tags: ["Environmental AI", "Peer Review"], title: "Adaptive Graph Models for Predictive Climate Resilience Planning", authors: "Dr. Leila Morgan · Aarav Patel · Sofia Chen", citations: 128, status: "Peer Review" },
  { id: "RP-1872", tags: ["Health Informatics", "Ready to Publish"], title: "Federated Medical Imaging Pipelines for Cross-Institutional Diagnostics", authors: "Prof. Nadia Mensah · Jonas Richter", citations: 94, status: "Ready to Publish" },
  { id: "RP-1664", tags: ["Research Systems", "Draft"], title: "Collaborative Knowledge Mapping in Multi-Disciplinary Research Teams", authors: "Elena Park · Samuel Okoye · Mina Ross", citations: 31, status: "Draft" },
  { id: "RP-1530", tags: ["Cybersecurity", "In Revision"], title: "Quantum-Safe Identity Layers for Academic Infrastructure", authors: "Ibrahim Hassan · Dr. Yuki Sato", citations: 67, status: "In Revision" },
];

const tasks = [
  { label: "Resolve peer review comments for federated imaging paper", meta: "Jonas Richter · Today, 4:00 PM" },
  { label: "Finalize ethics appendix for BlueGrid Climate Archive", meta: "Dr. Leila Morgan · Tomorrow" },
  { label: "Prepare collaborator invite list for Civic Insight Observatory", meta: "Mina Ross · May 21" },
];

const activities = [
  { text: "Jonas Richter uploaded a new paper", meta: "Federated Imaging · 2m ago" },
  { text: "Dr. Leila Morgan joined BlueGrid Archive", meta: "1h ago" },
];

const VERIFICATION_STATUS = { NOT_SUBMITTED: "not_submitted", PENDING: "pending", APPROVED: "approved", REJECTED: "rejected" };

export default function Overview() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState("All");
  const filterRef = useRef(null);
  const [verificationStatus, setVerificationStatus] = useState(VERIFICATION_STATUS.NOT_SUBMITTED);
  const [rejectionReason, setRejectionReason] = useState("");
  const [verificationLoading, setVerificationLoading] = useState(true);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) setIsFilterOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filterRef]);

  useEffect(() => {
    const handleCloseFilter = () => setIsFilterOpen(false);
    window.addEventListener("closeFilter", handleCloseFilter);
    return () => window.removeEventListener("closeFilter", handleCloseFilter);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchVerificationStatus = async () => {
      try {
        const response = await apiRequest("/v1/role-verification");
        if (!isMounted) return;
        const verification = response?.data;
        setVerificationStatus(verification?.status || VERIFICATION_STATUS.NOT_SUBMITTED);
        setRejectionReason(verification?.rejection_reason || "");
      } catch (error) {
        if (!isMounted) return;
        if (error?.status === 404) {
          setVerificationStatus(VERIFICATION_STATUS.NOT_SUBMITTED);
          setRejectionReason("");
        } else {
          console.error("Unable to load role verification status:", error);
        }
      } finally {
        if (isMounted) setVerificationLoading(false);
      }
    };
    fetchVerificationStatus();
    return () => { isMounted = false; };
  }, []);

  const filteredPapers = useMemo(() => {
    if (filterBy === "All") return papers;
    return papers.filter((p) => p.tags.includes(filterBy));
  }, [filterBy]);

  const statusColor = (status) => {
    if (status === "Peer Review") return "text-[var(--badge-blue-text)] bg-[var(--badge-blue)]";
    if (status === "Ready to Publish") return "text-[var(--badge-emerald-text)] bg-[var(--badge-emerald)]";
    if (status === "Draft") return "text-[var(--badge-slate-text)] bg-[var(--badge-slate)]";
    return "text-[var(--badge-amber-text)] bg-[var(--badge-amber)]";
  };

  const renderVerificationStatus = () => {
    if (verificationLoading) {
      return (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-4 mt-5">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl skeleton" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-32 rounded skeleton" />
              <div className="h-3 w-64 max-w-full rounded skeleton" />
            </div>
          </div>
        </motion.div>
      );
    }

    if (verificationStatus === VERIFICATION_STATUS.NOT_SUBMITTED) {
      return (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-4 mt-5 border border-[var(--border)]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-[var(--muted)] border border-[var(--border)] flex items-center justify-center">
              <ShieldCheck size={17} className="text-[var(--muted-foreground)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-[var(--text-primary)]">Role verification required</div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">Submit your university ID card to verify your Student or Faculty/Supervisor role.</div>
            </div>
            <a href="/role-setup" className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-indigo-600 bg-[var(--badge-blue)] hover:opacity-80 transition-colors">
              Verify <ArrowRight size={13} />
            </a>
          </div>
        </motion.div>
      );
    }

    if (verificationStatus === VERIFICATION_STATUS.PENDING) {
      return (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-4 mt-5 border border-[var(--warning)]/30 bg-[var(--warning-bg)]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-[var(--warning-bg)] border border-[var(--warning)]/30 flex items-center justify-center">
              <Clock3 size={17} className="text-[var(--warning)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-[var(--warning)]">Verification Pending</div>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[var(--warning-bg)] text-[var(--warning)]">Under Review</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">Your university ID card is being reviewed by an administrator. You can continue using ScholarOS while verification is pending.</div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (verificationStatus === VERIFICATION_STATUS.APPROVED) {
      return (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-4 mt-5 border border-[var(--success)]/30 bg-[var(--success-bg)]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-[var(--success-bg)] border border-[var(--success)]/30 flex items-center justify-center">
              <CheckCircle2 size={17} className="text-[var(--success)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-[var(--success)]">Role Verified</div>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[var(--success-bg)] text-[var(--success)]">Approved</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">Your university role has been verified. You can now access ScholarOS research collaboration features.</div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (verificationStatus === VERIFICATION_STATUS.REJECTED) {
      return (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-2xl p-4 mt-5 border border-[var(--error)]/30 bg-[var(--error-bg)]">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 shrink-0 rounded-xl bg-[var(--error-bg)] border border-[var(--error)]/30 flex items-center justify-center">
              <AlertCircle size={17} className="text-[var(--error)]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <div className="text-sm font-bold text-[var(--error)]">Verification Rejected</div>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] px-2 py-0.5 rounded-full bg-[var(--error-bg)] text-[var(--error)]">Action Required</span>
              </div>
              <div className="text-xs text-[var(--text-secondary)] mt-0.5">Your verification request needs to be resubmitted.</div>
              {rejectionReason && (
                <div className="mt-2 text-xs text-[var(--error)]">
                  <span className="font-semibold">Reason:</span> {rejectionReason}
                </div>
              )}
            </div>
            <a href="/role-setup" className="shrink-0 inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-[var(--error)] bg-[var(--error-bg)] hover:opacity-80 transition-colors">
              Resubmit <ArrowRight size={13} />
            </a>
          </div>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <div>
        <div className="text-xs text-[var(--text-muted)] font-medium mb-1">Welcome back,</div>
        <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Dr. Leila Morgan</h1>
      </div>

      {renderVerificationStatus()}

      <div className="grid grid-cols-4 gap-5 mt-7">
        {stats.map((s) => (
          <motion.div key={s.label} whileHover={{ y: -4, scale: 1.01 }} whileTap={{ scale: 0.98 }} className="glass-panel rounded-3xl p-6 transition-all duration-200">
            <div className="flex items-start justify-between mb-4">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-[var(--border)] flex items-center justify-center shadow-sm">
                <s.icon size={16} className="text-indigo-500" />
              </div>
            </div>
            <div className="text-[10px] font-bold tracking-[0.12em] text-[var(--text-muted)] uppercase mb-1">{s.label}</div>
            <div className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              <AnimatedCounter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs text-[var(--text-secondary)] mt-1.5">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_380px] gap-5 mt-7">
        <div className="glass-panel rounded-[28px] p-8">
          <div className="flex items-center justify-between mb-6 relative" ref={filterRef}>
            <div>
              <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase">Research Pipeline</div>
              <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">Recent Papers</h2>
            </div>
            <div className="relative z-20">
              <button onClick={() => { setIsFilterOpen(!isFilterOpen); window.dispatchEvent(new CustomEvent("closeNotif")); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text-primary)] shadow-sm hover:shadow transition-all duration-200">
                {filterBy === "All" ? "Filter" : filterBy}
                <ChevronDown size={12} className={`transition-transform duration-200 ${isFilterOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div initial={{ opacity: 0, scale: 0.95, y: -5 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -5 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-2 w-40 bg-[var(--bg-surface-elevated)] rounded-xl shadow-xl border border-[var(--border)] p-1.5 z-30 overflow-hidden">
                    {["All", "Peer Review", "Ready to Publish", "Draft", "In Revision"].map((item) => (
                      <button key={item} onClick={() => { setFilterBy(item); setIsFilterOpen(false); }} className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${filterBy === item ? "bg-[var(--badge-blue)] text-[var(--badge-blue-text)] font-semibold" : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"}`}>
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
              <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }} className={`${idx !== 0 ? "border-t border-[var(--border)] pt-5" : ""} block group cursor-pointer`} whileHover={{ x: 6 }}>
                <div className="flex items-start gap-4 pt-0.5">
                  <div className="text-[11px] text-[var(--text-muted)] font-medium w-14 shrink-0 pt-0.5">{p.id}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      {p.tags.map((t) => (
                        <span key={t} className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${statusColor(t)}`}>{t}</span>
                      ))}
                    </div>
                    <h3 className="text-base font-bold text-[var(--text-primary)] leading-snug mb-1 group-hover:text-indigo-600 transition-colors">{p.title}</h3>
                    <div className="text-xs text-[var(--text-secondary)]">{p.authors}</div>
                  </div>
                  <div className="text-right shrink-0 pl-4">
                    <div className="text-lg font-extrabold text-[var(--text-primary)]">{p.citations}</div>
                    <div className="text-[10px] text-[var(--text-muted)] tracking-[0.08em] uppercase">Citations</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-panel rounded-[28px] p-6">
            <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-1">Active Workspace</div>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight mb-6">Priority Tasks</h3>
            <div className="space-y-4">
              {tasks.map((t, i) => (
                <label key={i} className="flex items-start gap-3 group cursor-pointer">
                  <input type="checkbox" className="mt-0.5 h-5 w-5 rounded-md border-2 border-[var(--border)] text-indigo-500 focus:ring-indigo-200 accent-indigo-500" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-[var(--text-primary)] leading-snug group-hover:text-indigo-600 transition-colors">{t.label}</div>
                    <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mt-1">
                      <CircleDot size={10} className="text-indigo-400" />
                      {t.meta}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-6">
            <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-1">Live Feed</div>
            <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight mb-6">Activity</h3>
            <div className="space-y-5">
              {activities.map((a, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
                  <p className="text-sm text-[var(--text-primary)] font-medium leading-snug">
                    <span className="font-bold">{a.text.split(" ")[0]} {a.text.split(" ")[1]}</span> {a.text.split(" ").slice(2).join(" ")}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-1">{a.meta}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="rounded-[28px] bg-gradient-to-r from-[var(--bg-sidebar)] via-[var(--bg-surface)] to-[var(--bg-sidebar)] text-white p-8 shadow-2xl shadow-indigo-900/20 relative overflow-hidden mt-7">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
        <div className="relative z-10 flex items-start gap-6">
          <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-xl shadow-indigo-400/20 shrink-0">
            <Sparkles size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-[10px] font-bold tracking-[0.15em] text-indigo-300 uppercase mb-1.5">ScholarOS Insight</div>
            <h3 className="text-xl font-extrabold tracking-tight mb-2">Your reviewer turnaround is accelerating.</h3>
            <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">Teams using structured paper threads and visible milestone ownership are closing feedback loops 3x faster.</p>
          </div>
          <button className="self-center shrink-0 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-bold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            View Analytics <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}