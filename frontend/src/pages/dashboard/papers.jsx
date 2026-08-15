import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  RotateCw,
  ChevronDown,
  Plus,
  Bookmark,
  BookmarkCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../../utils/cn.js";

const papers = [
  {
    id: "RP-2048",
    category: "Environmental AI",
    status: "Peer Review",
    statusStyle: "text-blue-600 bg-blue-50",
    title: "Adaptive Graph Models for Predictive Climate Resilience Planning",
    authors: "Dr. Leila Morgan · Aarav Patel · Sofia Chen",
    citations: "128",
    views: "3.2k",
    abstract:
      "Introduces a graph-based framework for modeling climate resilience across interconnected infrastructure systems, validated against five regional datasets.",
    aiSummary:
      "This paper proposes a graph neural network that models how climate risks cascade across power, water, and transit systems — and shows it predicts regional resilience gaps 3× earlier than existing baselines.",
  },
  {
    id: "RP-1872",
    category: "Health Informatics",
    status: "Ready to Publish",
    statusStyle: "text-emerald-700 bg-emerald-50",
    title:
      "Federated Medical Imaging Pipelines for Cross-Institutional Diagnostics",
    authors: "Prof. Nadia Mensah · Jonas Richter",
    citations: "94",
    views: "2.1k",
    abstract:
      "A federated learning pipeline enabling hospitals to collaboratively train diagnostic imaging models without sharing patient-level data.",
  },
  {
    id: "RP-1664",
    category: "Research Systems",
    status: "Draft",
    statusStyle: "text-slate-700 bg-transparent",
    title:
      "Collaborative Knowledge Mapping in Multi-Disciplinary Research Teams",
    authors: "Elena Park · Samuel Okoye · Mina Ross",
    citations: "31",
    views: "640",
    abstract:
      "Proposes a shared ontology for linking tasks, datasets, and publications across teams working on overlapping research questions.",
  },
  {
    id: "RP-1530",
    category: "Cybersecurity",
    status: "In Revision",
    statusStyle: "text-amber-700 bg-amber-50",
    title: "Quantum-Safe Identity Layers for Academic Infrastructure",
    authors: "Ibrahim Hassan · Dr. Yuki Sato",
    citations: "67",
    views: "1.4k",
    abstract:
      "Evaluates post-quantum cryptographic identity schemes for securing long-lived academic research infrastructure.",
  },
];

const trending = [
  {
    rank: "01",
    topic: "Federated Climate Modeling",
    change: "+42% mentions this quarter",
    badge: "Hot",
    badgeStyle: "text-blue-600 bg-blue-50",
  },
  {
    rank: "02",
    topic: "Post-Quantum Identity Systems",
    change: "+31% mentions this quarter",
    badge: "Rising",
    badgeStyle: "text-emerald-700 bg-emerald-50",
  },
  {
    rank: "03",
    topic: "Multimodal Diagnostic AI",
    change: "+27% mentions this quarter",
    badge: "Rising",
    badgeStyle: "text-emerald-700 bg-emerald-50",
  },
  {
    rank: "04",
    topic: "Cross-Lab Knowledge Graphs",
    change: "+18% mentions this quarter",
    badge: "Rising",
    badgeStyle: "text-emerald-700 bg-emerald-50",
  },
];

function Chip({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer",
        active
          ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-400/30"
          : "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]",
      )}
    >
      {label}
    </button>
  );
}

export default function Papers() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("All");
  const [year, setYear] = useState("2026");
  const [status, setStatus] = useState(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortBy, setSortBy] = useState("Most Recent");
  const sortRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleBookmark = (id) => {
    const newSet = new Set(bookmarkedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setBookmarkedIds(newSet);
  };

  const sortedPapers = useMemo(() => {
    const papersCopy = [...papers];
    switch (sortBy) {
      case "Most Recent":
        return papersCopy.sort(
          (a, b) => parseInt(b.id.split("-")[1]) - parseInt(a.id.split("-")[1]),
        );
      case "Most Cited":
        return papersCopy.sort(
          (a, b) => parseInt(b.citations) - parseInt(a.citations),
        );
      case "A-Z":
        return papersCopy.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return papersCopy;
    }
  }, [sortBy]);

  return (
    <div className="space-y-6 pb-8 w-full min-w-0 relative">
      <div className="flex items-end justify-between w-full">
        <div>
          <div className="text-xs text-[var(--text-muted)] font-medium mb-1">
            Repository
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Research Papers
          </h1>
        </div>

        <button
          onClick={() => navigate("/dashboard/upload")}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-bold shadow-lg shadow-indigo-400/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
        >
          <Plus size={16} /> Upload Paper
        </button>
      </div>

      <div className="rounded-[28px] bg-gradient-to-r from-[#161a35] via-[#1b2a4a] to-[#242145] text-white p-7 shadow-2xl shadow-indigo-900/20 relative overflow-hidden w-full">
        <div className="absolute -top-20 right-1/4 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <div className="flex items-start gap-5 min-w-0 flex-1">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <Sparkles size={24} className="text-yellow-300" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-bold tracking-[0.2em] text-indigo-300 uppercase mb-1">
                ScholarOS AI
              </div>
              <h2 className="text-xl font-extrabold tracking-tight mb-1">
                Summarize any paper or discover trending topics
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed max-w-xl">
                Paste a paper, pick one from your library, or ask what's gaining
                traction in your field right now.
              </p>
            </div>
          </div>
          <div className="shrink-0 w-full md:w-[380px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Ask AI to summarize or suggest a topic…"
                className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
              />
              <button className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform">
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start w-full min-w-0">
        <div className="space-y-6 w-full min-w-0">
          <div className="glass-panel rounded-[28px] p-7">
            <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-5">
              Filter Results
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] mb-2">
              Search by title
            </div>
            <input
              type="text"
              placeholder="Search papers…"
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all mb-6"
            />
            <div className="text-sm font-bold text-[var(--text-primary)] mb-3">
              Category
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {["All", "AI", "Health", "Security", "Systems"].map((c) => (
                <Chip
                  key={c}
                  label={c}
                  active={category === c}
                  onClick={() => setCategory(c)}
                />
              ))}
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] mb-3">
              Department
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {["CS", "Medicine", "Engineering"].map((d) => (
                <Chip key={d} label={d} />
              ))}
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] mb-3">
              Publication Year
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {["2026", "2025", "2024"].map((y) => (
                <Chip
                  key={y}
                  label={y}
                  active={year === y}
                  onClick={() => setYear(y)}
                />
              ))}
            </div>
            <div className="text-sm font-bold text-[var(--text-primary)] mb-3">
              Status
            </div>
            <div className="flex flex-wrap gap-2">
              {["Draft", "In Revision", "Published"].map((s) => (
                <Chip
                  key={s}
                  label={s}
                  active={status === s}
                  onClick={() => setStatus(status === s ? null : s)}
                />
              ))}
            </div>
          </div>
          <div className="glass-panel rounded-[28px] p-7">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase">
                AI Trending Topics
              </span>
            </div>
            <div className="divide-y divide-[var(--border)]">
              {trending.map((t) => (
                <div
                  key={t.rank}
                  className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <div className="text-sm font-semibold text-[var(--text-muted)] pt-0.5">
                    {t.rank}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                      {t.topic}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-1">
                      {t.change}
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${t.badgeStyle}`}
                  >
                    {t.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5 w-full min-w-0">
          <div
            className="flex items-center justify-between relative"
            ref={sortRef}
          >
            <div className="text-sm text-[var(--text-secondary)] font-medium">
              Showing 4 of 10,204 papers
            </div>
            <div className="relative z-20">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] shadow-sm hover:bg-[var(--bg-surface-elevated)] hover:shadow transition-all duration-200"
              >
                Sort: {sortBy}{" "}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${isSortOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 overflow-hidden"
                  >
                    {["Most Recent", "Most Cited", "A-Z"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${sortBy === option ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-700 hover:bg-indigo-50"}`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {sortedPapers.map((p, idx) => (
            <div
              key={p.id}
              className="glass-panel rounded-[28px] p-7 transition-all hover:shadow-lg hover:border-indigo-200/80 group/card w-full"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start w-full">
                <div className="h-14 w-14 shrink-0 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-[var(--border)] flex items-center justify-center text-xs font-extrabold text-indigo-500 shadow-sm">
                  PDF
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium px-2.5 py-1 rounded-full text-[var(--text-secondary)] bg-[var(--bg-surface)]">
                      {p.category}
                    </span>
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.statusStyle}`}
                    >
                      {p.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight leading-snug hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
                    {p.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-secondary)]">
                    <span>{p.authors}</span>
                    <span className="text-[var(--text-muted)]">·</span>
                    <span className="font-mono text-xs">{p.id}</span>
                  </div>
                  <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                    {p.abstract}
                  </p>
                  {p.aiSummary ? (
                    <div className="mt-4 rounded-2xl border-2 border-dashed border-[var(--border)] bg-gradient-to-r from-indigo-50/60 to-violet-50/60 p-5 relative">
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-400 to-blue-400 text-white text-xs font-bold shadow-md shadow-indigo-300/40">
                          <Sparkles size={12} className="text-yellow-200" /> AI
                          Summary
                        </span>
                        <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-indigo-600 hover:underline transition-colors duration-200">
                          <RotateCw size={12} /> Regenerate
                        </button>
                      </div>
                      <p className="text-[15px] text-[var(--text-primary)] leading-relaxed">
                        {p.aiSummary}
                      </p>
                    </div>
                  ) : (
                    <button className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-indigo-600 hover:underline transition-colors duration-200 mt-1">
                      <Sparkles size={14} className="text-amber-400" />{" "}
                      Summarize with AI
                    </button>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-6 pl-0 sm:pl-4">
                  <div className="text-center">
                    <div className="text-xl font-extrabold text-[var(--text-primary)]">
                      {p.citations}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] tracking-[0.08em] uppercase">
                      Citations
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-extrabold text-[var(--text-primary)]">
                      {p.views}
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)] tracking-[0.08em] uppercase">
                      Views
                    </div>
                  </div>
                  <button
                    onClick={() => toggleBookmark(p.id)}
                    className="h-9 w-9 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center"
                  >
                    {bookmarkedIds.has(p.id) ? (
                      <BookmarkCheck size={16} className="text-indigo-500" />
                    ) : (
                      <Bookmark
                        size={16}
                        className="text-[var(--text-muted)] hover:text-indigo-500 transition-colors duration-200"
                      />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
