import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Check } from "lucide-react";
import { cn } from "../../utils/cn.js";

const tabs = [
  "Overview",
  "Members",
  "Tasks",
  "Files",
  "Discussion",
  "Progress",
  "Timeline",
];

const milestones = [
  { label: "Research Proposal", date: "Completed Mar 02", done: true },
  { label: "Literature Review", date: "Completed Mar 28", done: true },
  { label: "Data Collection", date: "Completed Apr 19", done: true },
  { label: "Paper Draft", date: "Due May 24", done: false },
  { label: "Final Paper", date: "Due Jun 02", done: false },
];

const openTasks = [
  {
    id: 1,
    title: "Finalize ethics appendix for dataset intake",
    meta: "Dr. Leila Morgan · Due Tomorrow",
    badge: "High",
    badgeStyle: "text-amber-700 bg-amber-50",
    done: false,
  },
  {
    id: 2,
    title: "Cross-check sensor calibration logs with Lab 3",
    meta: "Aarav Patel · Due May 19",
    badge: "Medium",
    badgeStyle: "text-blue-600 bg-blue-50",
    done: false,
  },
  {
    id: 3,
    title: "Migrate legacy climate datasets to archive schema",
    meta: "Sofia Chen · Completed May 12",
    badge: "Done",
    badgeStyle: "text-slate-600 bg-slate-100",
    done: true,
  },
];

const members = [
  {
    initials: "LM",
    name: "Dr. Leila Morgan",
    role: "Supervisor",
    badge: "Lead",
    lead: true,
  },
  {
    initials: "AP",
    name: "Aarav Patel",
    role: "PhD Candidate",
    badge: "Member",
    lead: false,
  },
  {
    initials: "SC",
    name: "Sofia Chen",
    role: "Research Assistant",
    badge: "Member",
    lead: false,
  },
  {
    initials: "JR",
    name: "Jonas Richter",
    role: "Data Engineer",
    badge: "Member",
    lead: false,
  },
];

const files = [
  {
    type: "PDF",
    name: "ethics_appendix_draft.pdf",
    size: "2.1 MB",
    color: "text-red-500 bg-red-50",
  },
  {
    type: "XLS",
    name: "sensor_calibration_log.xlsx",
    size: "840 KB",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    type: "ZIP",
    name: "climate_dataset_v3.zip",
    size: "128 MB",
    color: "text-violet-600 bg-violet-50",
  },
  {
    type: "DOC",
    name: "paper_draft_section2.docx",
    size: "312 KB",
    color: "text-blue-600 bg-blue-50",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { y: 15, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function Projects() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [taskStates, setTaskStates] = useState(openTasks.map((t) => t.done));

  const toggleTask = (index) => {
    const newState = [...taskStates];
    newState[index] = !newState[index];
    setTaskStates(newState);
  };

  // Now fully functional: Opens a mock alert to simulate an Invite Modal
  const handleInvite = () => {
    alert("📧 Invite member modal opened! You can invite collaborators here.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-8"
    >
      {/* Project Hero */}
      <motion.div
        whileHover={{
          scale: 1.003,
          boxShadow: "0 24px 80px rgba(15,23,42,0.12)",
        }}
        transition={{ duration: 0.2 }}
        className="rounded-[28px] bg-linear-to-r from-[#0f111a] via-[#151827] to-[#0f111a] text-white p-8 shadow-2xl shadow-indigo-900/20 relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start lg:gap-6">
          <div className="flex items-start gap-6 flex-1 min-w-0">
            <div className="h-20 w-20 shrink-0 rounded-2xl bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center shadow-xl shadow-indigo-500/25">
              <Layers size={32} className="text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] font-bold tracking-[0.2em] text-indigo-300 uppercase mb-1 font-mono">
                PRJ-022
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-3">
                BlueGrid Climate Archive
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                <span>
                  Supervisor:{" "}
                  <span className="text-white font-bold">Dr. Leila Morgan</span>
                </span>
                <span>
                  Members: <span className="text-white font-bold">9</span>
                </span>
                <span>
                  Deadline:{" "}
                  <span className="text-white font-bold">Jun 02, 2026</span>
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 text-left lg:text-right mt-4 lg:mt-0 w-full lg:w-64">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-4"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </motion.span>
            <div className="text-xs text-slate-400 mb-2">
              Overall Completion
            </div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "64%" }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-linear-to-r from-indigo-400 via-violet-400 to-blue-400"
              />
            </div>
            <div className="text-lg font-extrabold mt-2">64% complete</div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center gap-1 rounded-2xl bg-white/70 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.05)] p-1.5 overflow-x-auto"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "text-white"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 shadow-md shadow-indigo-400/30 -z-10"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            {tab}
          </motion.button>
        ))}
      </motion.div>

      {/* Main Grid - Dynamic Content based on Active Tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6 items-start"
        >
          {/* Left column */}
          <div className="space-y-6">
            {/* About */}
            {activeTab === "Overview" && (
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-8"
              >
                <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-1">
                  Project Summary
                </div>
                <h2 className="text-xl font-extrabold text-[#0f111a] tracking-tight mb-4">
                  About this project
                </h2>
                <p className="text-[15px] text-slate-500 leading-relaxed">
                  A cross-institutional archive coordinating climate model
                  outputs, sensor datasets, and policy-facing research across
                  four partner labs. The project standardizes data intake and
                  links every dataset back to its originating publication for
                  full traceability.
                </p>
              </motion.div>
            )}

            {/* Milestones */}
            {activeTab === "Overview" && (
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                      Research Stages
                    </div>
                    <h2 className="text-xl font-extrabold text-[#0f111a] tracking-tight">
                      Milestones
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("Progress")}
                    className="text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    View all
                  </motion.button>
                </div>
                <div className="divide-y divide-slate-200/60">
                  {milestones.map((m) => (
                    <motion.div
                      key={m.label}
                      variants={itemVariants}
                      whileHover={{ x: 6 }}
                      className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 cursor-pointer"
                    >
                      {m.done ? (
                        <span className="h-6 w-6 rounded-full bg-linear-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-md shadow-indigo-400/30 shrink-0">
                          <Check
                            size={13}
                            className="text-white"
                            strokeWidth={3}
                          />
                        </span>
                      ) : (
                        <span className="h-6 w-6 rounded-full border-2 border-slate-300 bg-white/60 shrink-0" />
                      )}
                      <span
                        className={`flex-1 text-base font-bold ${m.done ? "text-slate-400 line-through" : "text-[#0f111a]"}`}
                      >
                        {m.label}
                      </span>
                      <span className="text-sm text-slate-400">{m.date}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Open Tasks */}
            {(activeTab === "Overview" || activeTab === "Tasks") && (
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase">
                      Task Board
                    </div>
                    <h2 className="text-xl font-extrabold text-[#0f111a] tracking-tight">
                      Open Tasks
                    </h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("Tasks")}
                    className="text-sm font-semibold text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    View board
                  </motion.button>
                </div>
                <div className="space-y-4">
                  {openTasks.map((t, idx) => (
                    <motion.div
                      key={t.id}
                      variants={itemVariants}
                      whileHover={{
                        x: 6,
                        backgroundColor: "rgba(255,255,255,0.5)",
                      }}
                      className="flex items-start gap-4 p-2 -mx-2 rounded-xl transition-colors cursor-pointer"
                      onClick={() => toggleTask(idx)}
                    >
                      <motion.span
                        whileTap={{ scale: 0.8 }}
                        className={`mt-0.5 h-5 w-5 shrink-0 rounded-md flex items-center justify-center transition-colors ${taskStates[idx] ? "bg-linear-to-br from-indigo-400 to-violet-400 shadow-sm" : "border-2 border-slate-300 bg-white/60"}`}
                      >
                        {taskStates[idx] && (
                          <Check
                            size={12}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </motion.span>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`text-base font-bold leading-snug transition-all duration-300 ${taskStates[idx] ? "text-slate-400 line-through" : "text-[#0f111a]"}`}
                        >
                          {t.title}
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {t.meta}
                        </div>
                      </div>
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${t.badgeStyle}`}
                      >
                        {t.badge}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Members */}
            {(activeTab === "Overview" || activeTab === "Members") && (
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-6"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-1">
                      Collaboration
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0f111a] tracking-tight">
                      Members
                    </h3>
                  </div>
                  {/* ✅ FIXED: Invite button is now fully interactive */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInvite}
                    className="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    Invite
                  </motion.button>
                </div>
                <div className="divide-y divide-slate-200/60">
                  {members.map((m) => (
                    <motion.div
                      key={m.name}
                      variants={itemVariants}
                      whileHover={{
                        x: 6,
                        backgroundColor: "rgba(255,255,255,0.5)",
                      }}
                      className="flex items-center gap-3 py-4 first:pt-0 last:pb-0 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
                      onClick={() =>
                        console.log(`Viewing profile of ${m.name}`)
                      }
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="h-11 w-11 rounded-full bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-400/20 shrink-0"
                      >
                        {m.initials}
                      </motion.div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-[#0f111a]">
                          {m.name}
                        </div>
                        <div className="text-xs text-slate-400">{m.role}</div>
                      </div>
                      <motion.span
                        whileHover={{ scale: 1.05 }}
                        className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${m.lead ? "text-indigo-600 bg-indigo-50" : "text-slate-500 bg-slate-100"}`}
                      >
                        {m.badge}
                      </motion.span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recent Files */}
            {(activeTab === "Overview" || activeTab === "Files") && (
              <motion.div
                variants={itemVariants}
                className="rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 shadow-[0_4px_30px_rgba(0,0,0,0.04)] p-6"
              >
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-1">
                      Repository
                    </div>
                    <h3 className="text-xl font-extrabold text-[#0f111a] tracking-tight">
                      Recent Files
                    </h3>
                  </div>
                  {/* ✅ FIXED: View all button now correctly navigates to the Files tab */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab("Files")}
                    className="text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
                  >
                    View all
                  </motion.button>
                </div>
                <div className="divide-y divide-slate-200/60">
                  {files.map((f) => (
                    <motion.div
                      key={f.name}
                      variants={itemVariants}
                      whileHover={{
                        x: 6,
                        backgroundColor: "rgba(255,255,255,0.5)",
                      }}
                      className="flex items-center gap-3 py-4 first:pt-0 last:pb-0 -mx-2 px-2 rounded-xl transition-colors cursor-pointer"
                      onClick={() => console.log(`Downloading ${f.name}`)}
                    >
                      <motion.div
                        whileHover={{ rotate: 4, scale: 1.05 }}
                        className={`h-11 w-11 rounded-xl flex items-center justify-center text-[10px] font-extrabold shrink-0 ${f.color}`}
                      >
                        {f.type}
                      </motion.div>
                      <div className="flex-1 min-w-0 text-sm font-bold text-[#0f111a] truncate group-hover:text-indigo-600 transition-colors">
                        {f.name}
                      </div>
                      <div className="shrink-0 text-xs text-slate-400 font-medium">
                        {f.size}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
