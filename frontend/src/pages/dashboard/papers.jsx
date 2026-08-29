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
import {
  summarizePaper,
  getTrendingTopics,
} from "../../services/dummyAIService.js";

const papers = [
  {
    id: "RP-2048",
    category: "Environmental AI",
    status: "Peer Review",
    statusStyle: "text-[var(--badge-blue-text)] bg-[var(--badge-blue)]",
    title: "Adaptive Graph Models for Predictive Climate Resilience Planning",
    authors: "Dr. Leila Morgan · Aarav Patel · Sofia Chen",
    citations: "128",
    views: "3.2k",
    abstract:
      "Introduces a graph-based framework for modeling climate resilience across interconnected infrastructure systems, validated against five regional datasets.",
  },
  {
    id: "RP-1872",
    category: "Health Informatics",
    status: "Ready to Publish",
    statusStyle: "text-[var(--badge-emerald-text)] bg-[var(--badge-emerald)]",
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
    statusStyle: "text-[var(--badge-slate-text)] bg-[var(--badge-slate)]",
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
    statusStyle: "text-[var(--badge-amber-text)] bg-[var(--badge-amber)]",
    title: "Quantum-Safe Identity Layers for Academic Infrastructure",
    authors: "Ibrahim Hassan · Dr. Yuki Sato",
    citations: "67",
    views: "1.4k",
    abstract:
      "Evaluates post-quantum cryptographic identity schemes for securing long-lived academic research infrastructure.",
  },
];

function Chip({ label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer",
        active
          ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-400/30"
          : "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]",
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

  // ============================================================
  // AI STATE
  // ============================================================

  const [aiSummaries, setAiSummaries] = useState({});
  const [summarizingPaperId, setSummarizingPaperId] = useState(null);
  const [aiError, setAiError] = useState("");

  const [trendingTopics, setTrendingTopics] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [trendingError, setTrendingError] = useState("");

  const [aiPrompt, setAiPrompt] = useState("");
  const [aiPromptLoading, setAiPromptLoading] = useState(false);

  // ============================================================
  // CLOSE SORT DROPDOWN WHEN CLICKING OUTSIDE
  // ============================================================

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target))
        setIsSortOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ============================================================
  // LOAD DUMMY AI TRENDING TOPICS
  // ============================================================

  useEffect(() => {
    let isMounted = true;

    async function loadTrendingTopics() {
      try {
        setTrendingLoading(true);
        setTrendingError("");

        const topics = await getTrendingTopics();

        if (isMounted) {
          setTrendingTopics(Array.isArray(topics) ? topics : []);
        }
      } catch (error) {
        if (isMounted) {
          setTrendingError(
            error?.message || "Unable to load trending research topics."
          );
        }
      } finally {
        if (isMounted) {
          setTrendingLoading(false);
        }
      }
    }

    loadTrendingTopics();

    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================================
  // BOOKMARK
  // ============================================================

  const toggleBookmark = (id) => {
    const newSet = new Set(bookmarkedIds);

    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }

    setBookmarkedIds(newSet);
  };

  // ============================================================
  // SORT
  // ============================================================

  const sortedPapers = useMemo(() => {
    const papersCopy = [...papers];

    switch (sortBy) {
      case "Most Recent":
        return papersCopy.sort(
          (a, b) =>
            parseInt(b.id.split("-")[1]) - parseInt(a.id.split("-")[1])
        );

      case "Most Cited":
        return papersCopy.sort(
          (a, b) => parseInt(b.citations) - parseInt(a.citations)
        );

      case "A-Z":
        return papersCopy.sort((a, b) => a.title.localeCompare(b.title));

      default:
        return papersCopy;
    }
  }, [sortBy]);

  // ============================================================
  // AI SUMMARIZATION
  // ============================================================

  const handleSummarize = async (paper) => {
    if (!paper) {
      setAiError("Please select a valid research paper.");
      return;
    }

    try {
      setAiError("");
      setSummarizingPaperId(paper.id);

      const result = await summarizePaper(paper);

      setAiSummaries((previous) => ({
        ...previous,
        [paper.id]: result,
      }));
    } catch (error) {
      setAiError(
        error?.message || "Unable to generate an AI summary. Please try again."
      );
    } finally {
      setSummarizingPaperId(null);
    }
  };

  // ============================================================
  // AI PROMPT
  // ============================================================

  const handleAiPrompt = async () => {
    const prompt = aiPrompt.trim();

    if (!prompt) {
      setAiError("Please enter a question or request for the AI.");
      return;
    }

    try {
      setAiError("");
      setAiPromptLoading(true);

      const normalizedPrompt = prompt.toLowerCase();

      // If the user asks for a topic/recommendation,
      // refresh the dummy trending topics.
      if (
        normalizedPrompt.includes("topic") ||
        normalizedPrompt.includes("trend") ||
        normalizedPrompt.includes("recommend") ||
        normalizedPrompt.includes("research idea") ||
        normalizedPrompt.includes("research ideas")
      ) {
        const topics = await getTrendingTopics();

        setTrendingTopics(Array.isArray(topics) ? topics : []);

        setAiPrompt("");
        return;
      }

      // Otherwise, summarize the first available paper.
      // This keeps the prompt functional without requiring
      // an external AI service or backend API.
      const paper = sortedPapers[0];

      if (!paper) {
        throw new Error("No research paper is available to summarize.");
      }

      const result = await summarizePaper(paper);

      setAiSummaries((previous) => ({
        ...previous,
        [paper.id]: result,
      }));

      setAiPrompt("");
    } catch (error) {
      setAiError(
        error?.message || "Unable to process your AI request. Please try again."
      );
    } finally {
      setAiPromptLoading(false);
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

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
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-linear-to-r from-indigo-500 to-cyan-400 text-white text-sm font-bold shadow-lg shadow-indigo-400/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 active:scale-95"
        >
          <Plus size={16} /> Upload Paper
        </button>
      </div>

      {/* ScholarOS AI Banner */}
      <div className="rounded-[28px] bg-linear-to-r from-[#161a35] via-[#1b2a4a] to-[#242145] text-white p-7 shadow-2xl shadow-indigo-900/20 relative overflow-hidden w-full">
        <div className="absolute -top-20 right-1/4 h-56 w-56 rounded-full bg-blue-500/15 blur-3xl" />
        <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <div className="flex items-start gap-5 min-w-0 flex-1">
            <div className="h-14 w-14 shrink-0 rounded-2xl bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-xl shadow-indigo-500/25">
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
                Paste a paper, pick one from your library, or ask what's
                gaining traction in your field right now.
              </p>
            </div>
          </div>

          <div className="shrink-0 w-full md:w-[380px]">
            <div className="relative">
              <input
                type="text"
                value={aiPrompt}
                onChange={(event) => setAiPrompt(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !aiPromptLoading) {
                    handleAiPrompt();
                  }
                }}
                disabled={aiPromptLoading}
                placeholder="Ask AI to summarize or suggest a topic…"
                className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all disabled:opacity-60"
              />

              <button
                onClick={handleAiPrompt}
                disabled={aiPromptLoading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-9 w-9 rounded-xl bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                aria-label="Submit AI request"
              >
                {aiPromptLoading ? (
                  <RotateCw size={15} className="animate-spin" />
                ) : (
                  <ArrowRight size={15} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Error */}
      <AnimatePresence>
        {aiError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-700"
          >
            {aiError}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 items-start w-full min-w-0">
        {/* LEFT SIDEBAR */}
        <div className="space-y-6 w-full min-w-0">
          {/* Filters */}
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
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-indigo-200 transition-all mb-6"
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

          {/* AI TRENDING TOPICS */}
          <div className="glass-panel rounded-[28px] p-7">
            <div className="flex items-center gap-2 mb-5">
              <Sparkles size={14} className="text-amber-400" />
              <span className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase">
                AI Trending Topics
              </span>
            </div>

            {trendingLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="animate-pulse space-y-2 py-3">
                    <div className="h-3 w-10 bg-[var(--muted)] rounded" />
                    <div className="h-4 w-4/5 bg-[var(--muted)] rounded" />
                    <div className="h-3 w-2/3 bg-[var(--muted)] rounded" />
                  </div>
                ))}
              </div>
            ) : trendingError ? (
              <div className="text-sm text-red-600 leading-relaxed">
                {trendingError}
              </div>
            ) : trendingTopics.length === 0 ? (
              <div className="text-sm text-[var(--text-secondary)]">
                No trending research topics available.
              </div>
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {trendingTopics.map((topic, index) => (
                  <div
                    key={topic.id ?? index}
                    className="flex items-start gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="text-sm font-semibold text-[var(--text-muted)] pt-0.5">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-[var(--text-primary)] leading-snug">
                        {topic.title}
                      </div>

                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        {topic.trend} mentions this quarter
                      </div>

                      <div className="text-[11px] text-indigo-500 font-semibold mt-1">
                        {topic.researchArea}
                      </div>

                      {Array.isArray(topic.keywords) &&
                        topic.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {topic.keywords.slice(0, 3).map((keyword) => (
                              <span
                                key={keyword}
                                className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        )}
                    </div>

                    <span
                      className={cn(
                        "shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full",
                        topic.trendLabel === "Hot"
                          ? "text-blue-600 bg-blue-50"
                          : "text-emerald-700 bg-emerald-50"
                      )}
                    >
                      {topic.trendLabel}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT CONTENT: PAPER CARDS */}
        <div className="space-y-5 w-full min-w-0">
          {/* Sort */}
          <div
            className="flex items-center justify-between relative"
            ref={sortRef}
          >
            <div className="text-sm text-[var(--text-muted)] font-medium">
              Showing 4 of 10,204 papers
            </div>

            <div className="relative z-20">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-sm font-semibold text-[var(--text-secondary)] shadow-sm hover:bg-[var(--bg-surface-elevated)] transition-all duration-200"
              >
                Sort: {sortBy}{" "}
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    isSortOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-40 bg-[var(--bg-surface-elevated)] rounded-xl shadow-xl border border-[var(--border)] p-1.5 overflow-hidden"
                  >
                    {["Most Recent", "Most Cited", "A-Z"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          sortBy === option
                            ? "bg-[var(--badge-blue)] text-[var(--badge-blue-text)] font-semibold"
                            : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* PAPER CARDS */}
          {sortedPapers.map((p) => {
            const aiSummary = aiSummaries[p.id];
            const isSummarizing = summarizingPaperId === p.id;

            return (
              <div
                key={p.id}
                className="glass-panel rounded-[28px] p-7 transition-all hover:shadow-lg hover:border-indigo-200/80 group/card w-full"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start w-full">
                  {/* PDF ICON */}
                  <div className="h-14 w-14 shrink-0 rounded-2xl bg-linear-to-br from-indigo-50 to-blue-50 border border-indigo-100/60 flex items-center justify-center text-xs font-extrabold text-indigo-500 shadow-sm">
                    PDF
                  </div>

                  <div className="flex-1 min-w-0 space-y-3">
                    {/* CATEGORY / STATUS */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium px-2.5 py-1 rounded-full text-[var(--muted-foreground)] bg-[var(--muted)]">
                        {p.category}
                      </span>

                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${p.statusStyle}`}
                      >
                        {p.status}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight leading-snug hover:text-indigo-600 transition-colors duration-200 cursor-pointer">
                      {p.title}
                    </h3>

                    {/* AUTHORS */}
                    <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--text-muted)]">
                      <span>{p.authors}</span>
                      <span className="text-[var(--text-muted)]">·</span>
                      <span className="font-mono text-xs">{p.id}</span>
                    </div>

                    {/* ABSTRACT */}
                    <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                      {p.abstract}
                    </p>

                    {/* AI SUMMARY */}
                    {isSummarizing ? (
                      <div className="mt-4 rounded-2xl border-2 border-dashed border-indigo-200/70 bg-linear-to-r from-indigo-50/60 to-violet-50/60 p-5">
                        <div className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
                          <RotateCw size={15} className="animate-spin" />
                          Analyzing paper with ScholarOS AI...
                        </div>

                        <p className="text-xs text-slate-400 mt-2">
                          Generating summary, key findings, contributions, and
                          keywords.
                        </p>
                      </div>
                    ) : aiSummary ? (
                      <div className="mt-4 rounded-2xl border-2 border-dashed border-indigo-200/70 bg-linear-to-r from-indigo-50/60 to-violet-50/60 p-5 relative">
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-4">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-linear-to-r from-indigo-400 to-blue-400 text-white text-xs font-bold shadow-md shadow-indigo-300/40">
                            <Sparkles
                              size={12}
                              className="text-yellow-200"
                            />
                            AI Summary
                          </span>

                          <button
                            onClick={() => handleSummarize(p)}
                            disabled={isSummarizing}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-indigo-600 hover:underline transition-colors duration-200 disabled:opacity-50"
                          >
                            <RotateCw
                              size={12}
                              className={isSummarizing ? "animate-spin" : ""}
                            />
                            Regenerate
                          </button>
                        </div>

                        {/* SUMMARY */}
                        <div className="mb-5">
                          <div className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-500 mb-2">
                            Summary
                          </div>

                          <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                            {aiSummary.summary}
                          </p>
                        </div>

                        {/* KEY FINDINGS */}
                        {Array.isArray(aiSummary.keyFindings) &&
                          aiSummary.keyFindings.length > 0 && (
                            <div className="mb-5">
                              <div className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-500 mb-2">
                                Key Findings
                              </div>

                              <ul className="space-y-2">
                                {aiSummary.keyFindings.map(
                                  (finding, findingIndex) => (
                                    <li
                                      key={findingIndex}
                                      className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed"
                                    >
                                      <span className="text-indigo-400 mt-1">
                                        •
                                      </span>
                                      <span>{finding}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* CONTRIBUTIONS */}
                        {Array.isArray(aiSummary.contributions) &&
                          aiSummary.contributions.length > 0 && (
                            <div className="mb-5">
                              <div className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-500 mb-2">
                                Main Contributions
                              </div>

                              <ul className="space-y-2">
                                {aiSummary.contributions.map(
                                  (contribution, contributionIndex) => (
                                    <li
                                      key={contributionIndex}
                                      className="flex items-start gap-2 text-sm text-[var(--text-secondary)] leading-relaxed"
                                    >
                                      <span className="text-indigo-400 mt-1">
                                        •
                                      </span>
                                      <span>{contribution}</span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* KEYWORDS */}
                        {Array.isArray(aiSummary.keywords) &&
                          aiSummary.keywords.length > 0 && (
                            <div>
                              <div className="text-xs font-bold uppercase tracking-[0.12em] text-indigo-500 mb-2">
                                Extracted Keywords
                              </div>

                              <div className="flex flex-wrap gap-2">
                                {aiSummary.keywords.map((keyword) => (
                                  <span
                                    key={keyword}
                                    className="px-2.5 py-1 rounded-full bg-[var(--bg-surface)] border border-[var(--border)] text-xs font-semibold text-[var(--text-secondary)]"
                                  >
                                    {keyword}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    ) : (
                      /* SUMMARIZE BUTTON */
                      <button
                        onClick={() => handleSummarize(p)}
                        disabled={summarizingPaperId !== null}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-secondary)] hover:text-indigo-600 hover:underline transition-colors duration-200 mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Sparkles size={14} className="text-amber-400" />
                        Summarize with AI
                      </button>
                    )}
                  </div>

                  {/* STATS / BOOKMARK */}
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
            );
          })}
        </div>
      </div>
    </div>
  );
}