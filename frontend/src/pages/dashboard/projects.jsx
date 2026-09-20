import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, Check, ChevronDown, RotateCw, FileText, Plus } from "lucide-react";
import {
  getDashboardProjects,
  getProjectDetails,
  getProjectMilestones,
  getProjectTasks,
  getProjectMembers,
  getProjectFiles,
  updateTaskStatus,
} from "../../services/dashboardService.js";

const tabs = [
  "Overview",
  "Members",
  "Tasks",
  "Files",
  "Discussion",
  "Progress",
  "Timeline",
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

function getFileExtension(filename = "") {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop().toUpperCase() : "FILE";
}

function getFileColor(type) {
  switch (type) {
    case "PDF":
      return "text-red-500 bg-red-500/10";
    case "XLS":
    case "XLSX":
    case "CSV":
      return "text-emerald-500 bg-emerald-500/10";
    case "ZIP":
    case "RAR":
    case "TAR":
      return "text-violet-500 bg-violet-500/10";
    case "DOC":
    case "DOCX":
      return "text-blue-500 bg-blue-500/10";
    default:
      return "text-indigo-500 bg-indigo-500/10";
  }
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export default function Projects() {
  const [activeTab, setActiveTab] = useState("Overview");

  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isProjectSelectorOpen, setIsProjectSelectorOpen] = useState(false);

  const [projectDetails, setProjectDetails] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial project list
  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardProjects();
      const projectList = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || [];
      
      setProjects(projectList);
      if (projectList.length > 0 && !selectedProjectId) {
        setSelectedProjectId(projectList[0].id);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
      setError(err?.data?.message || err?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [selectedProjectId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Fetch selected project resources
  const fetchProjectResources = useCallback(async (projectId) => {
    if (!projectId) return;
    try {
      setSubLoading(true);
      const [detailsRes, milestonesRes, tasksRes, membersRes, filesRes] = await Promise.allSettled([
        getProjectDetails(projectId),
        getProjectMilestones(projectId),
        getProjectTasks(projectId),
        getProjectMembers(projectId),
        getProjectFiles(projectId),
      ]);

      if (detailsRes.status === "fulfilled" && detailsRes.value?.data) {
        setProjectDetails(detailsRes.value.data);
      }
      if (milestonesRes.status === "fulfilled" && milestonesRes.value?.data) {
        const raw = Array.isArray(milestonesRes.value.data) ? milestonesRes.value.data : milestonesRes.value.data?.data || [];
        setMilestones(raw);
      }
      if (tasksRes.status === "fulfilled" && tasksRes.value?.data) {
        const raw = Array.isArray(tasksRes.value.data) ? tasksRes.value.data : tasksRes.value.data?.data || [];
        setTasks(raw);
      }
      if (membersRes.status === "fulfilled" && membersRes.value?.data) {
        const raw = Array.isArray(membersRes.value.data) ? membersRes.value.data : membersRes.value.data?.data || [];
        setMembers(raw);
      }
      if (filesRes.status === "fulfilled" && filesRes.value?.data) {
        const raw = Array.isArray(filesRes.value.data) ? filesRes.value.data : filesRes.value.data?.data || [];
        setFiles(raw);
      }
    } catch (err) {
      console.error("Error loading project resources:", err);
    } finally {
      setSubLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectResources(selectedProjectId);
    }
  }, [selectedProjectId, fetchProjectResources]);

  const currentProject = useMemo(() => {
    if (projectDetails) return projectDetails;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projectDetails, projects, selectedProjectId]);

  const toggleTask = async (taskId, currentStatus) => {
    const newStatus = currentStatus === "completed" ? "pending" : "completed";
    // Optimistic update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      if (selectedProjectId) {
        await updateTaskStatus(selectedProjectId, taskId, newStatus);
      }
    } catch (err) {
      console.error("Failed to update task status:", err);
      // Revert on failure
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: currentStatus } : t))
      );
    }
  };

  const handleInvite = () => {
    alert("Collaborator invitation modal opened. Enter user email to add them to this project.");
  };

  const leftHasContent = activeTab === "Overview" || activeTab === "Tasks" || activeTab === "Progress" || activeTab === "Timeline";
  const rightHasContent = activeTab === "Overview" || activeTab === "Members" || activeTab === "Files";
  const rightOnly = rightHasContent && !leftHasContent;

  const progressPct = currentProject?.progress ?? currentProject?.progress_pct ?? 0;
  const projectTitle = currentProject?.title || "Project";
  const supervisorName = currentProject?.supervisor?.name || currentProject?.creator?.name || "Dr. Leila Morgan";
  const memberCount = members.length > 0 ? members.length : (currentProject?.members_count ?? 1);
  const deadlineText = currentProject?.deadline
    ? new Date(currentProject.deadline).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })
    : "Ongoing";
  const projectCode = currentProject ? `PRJ-${String(currentProject.id).padStart(3, "0")}` : "PRJ-001";

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="rounded-[28px] glass-panel p-8 space-y-4">
          <div className="h-20 w-20 rounded-2xl skeleton" />
          <div className="h-6 w-1/3 rounded skeleton" />
          <div className="h-4 w-1/2 rounded skeleton" />
        </div>
      </div>
    );
  }

  if (error || projects.length === 0) {
    return (
      <div className="space-y-6 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs text-[var(--text-muted)] font-medium mb-1">Workspace</div>
            <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">Projects</h1>
          </div>
        </div>

        {error ? (
          <div className="rounded-[28px] glass-panel p-10 text-center">
            <p className="text-rose-500 font-bold mb-4">{error}</p>
            <button
              onClick={fetchProjects}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white text-sm font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              <RotateCw size={15} /> Retry
            </button>
          </div>
        ) : (
          <div className="rounded-[28px] glass-panel p-12 text-center text-[var(--text-secondary)]">
            <Layers className="h-12 w-12 text-indigo-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-lg font-bold text-[var(--text-primary)]">No Projects Found</h3>
            <p className="text-sm mt-1">You are not currently enrolled in any research projects.</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-8"
    >
      {/* Project Switcher Bar if multiple projects */}
      {projects.length > 1 && (
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-[var(--text-muted)] font-semibold uppercase tracking-wider">
            Active Project:
          </div>
          <div className="relative">
            <button
              onClick={() => setIsProjectSelectorOpen(!isProjectSelectorOpen)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)] text-sm font-bold text-[var(--text-primary)] shadow-sm hover:bg-[var(--bg-surface-elevated)] transition-colors cursor-pointer"
            >
              <span className="truncate max-w-[200px] sm:max-w-xs">{projectTitle}</span>
              <ChevronDown size={14} className={`transition-transform ${isProjectSelectorOpen ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {isProjectSelectorOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 top-full mt-2 w-64 bg-[var(--bg-surface-elevated)] rounded-xl shadow-xl border border-[var(--border)] p-1.5 z-30 overflow-hidden"
                >
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProjectId(p.id);
                        setIsProjectSelectorOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                        selectedProjectId === p.id
                          ? "bg-[var(--badge-blue)] text-[var(--badge-blue-text)] font-semibold"
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface)]"
                      }`}
                    >
                      <div className="font-bold truncate">{p.title}</div>
                      <div className="text-xs text-[var(--text-muted)]">PRJ-{String(p.id).padStart(3, "0")}</div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Project Banner */}
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
                {projectCode}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight mb-3">
                {projectTitle}
              </h1>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-300">
                <span>
                  Supervisor: <span className="text-white font-bold">{supervisorName}</span>
                </span>
                <span>
                  Members: <span className="text-white font-bold">{memberCount}</span>
                </span>
                <span>
                  Deadline: <span className="text-white font-bold">{deadlineText}</span>
                </span>
              </div>
            </div>
          </div>
          <div className="shrink-0 text-left lg:text-right mt-4 lg:mt-0 w-full lg:w-64">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 text-sm font-semibold mb-4"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />{" "}
              {currentProject?.status_label || currentProject?.status || "Active"}
            </motion.span>
            <div className="text-xs text-slate-400 mb-2">Overall Completion</div>
            <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="h-full rounded-full bg-linear-to-r from-indigo-400 via-violet-400 to-blue-400"
              />
            </div>
            <div className="text-lg font-extrabold mt-2">{progressPct}% complete</div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="inline-flex items-center gap-1 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border)] shadow-[var(--shadow-card)] p-1.5 overflow-x-auto max-w-full"
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`relative z-0 px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors shrink-0 cursor-pointer ${
              activeTab === tab ? "text-white" : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabBackground"
                className="absolute inset-0 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 shadow-md shadow-indigo-400/30 z-0"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
            <span className="relative z-10">{tab}</span>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className={`grid grid-cols-1 ${leftHasContent && rightHasContent ? "lg:grid-cols-[1fr_380px]" : ""} gap-6 items-start`}
        >
          {/* Main Column */}
          <div className="space-y-6">
            {activeTab === "Overview" && (
              <motion.div variants={itemVariants} className="glass-panel rounded-[28px] p-8">
                <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-1">
                  Project Summary
                </div>
                <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight mb-4">
                  About this project
                </h2>
                <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed">
                  {currentProject?.description ||
                    "A collaborative cross-institutional research initiative standardizing data intake, research timelines, and linking datasets back to their originating publications for full traceability."}
                </p>
              </motion.div>
            )}

            {(activeTab === "Overview" || activeTab === "Progress" || activeTab === "Timeline") && (
              <motion.div variants={itemVariants} className="glass-panel rounded-[28px] p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase">
                      Research Stages
                    </div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                      Milestones
                    </h2>
                  </div>
                  {activeTab === "Overview" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("Progress")}
                      className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      View all
                    </motion.button>
                  )}
                </div>

                {milestones.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {milestones.map((m) => {
                      const isCompleted = m.status === "completed" || m.done;
                      const dateText = m.due_date
                        ? `Due ${new Date(m.due_date).toLocaleDateString("en-US", { month: "short", day: "2-digit" })}`
                        : m.date || "Scheduled";

                      return (
                        <motion.div
                          key={m.id || m.title || m.label}
                          variants={itemVariants}
                          whileHover={{ x: 6 }}
                          className="flex items-center gap-4 py-4 first:pt-0 last:pb-0 cursor-pointer"
                        >
                          {isCompleted ? (
                            <span className="h-6 w-6 rounded-full bg-linear-to-br from-indigo-400 to-violet-400 flex items-center justify-center shadow-md shadow-indigo-400/30 shrink-0">
                              <Check size={13} className="text-white" strokeWidth={3} />
                            </span>
                          ) : (
                            <span className="h-6 w-6 rounded-full border-2 border-[var(--border)] bg-[var(--bg-surface)] shrink-0" />
                          )}
                          <span
                            className={`flex-1 text-base font-bold ${
                              isCompleted ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"
                            }`}
                          >
                            {m.title || m.name || m.label}
                          </span>
                          <span className="text-sm text-[var(--text-muted)]">{dateText}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                    No milestones defined for this project yet.
                  </div>
                )}
              </motion.div>
            )}

            {(activeTab === "Overview" || activeTab === "Tasks") && (
              <motion.div variants={itemVariants} className="glass-panel rounded-[28px] p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase">
                      Task Board
                    </div>
                    <h2 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                      Open Tasks
                    </h2>
                  </div>
                  {activeTab === "Overview" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("Tasks")}
                      className="text-sm font-semibold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      View board
                    </motion.button>
                  )}
                </div>

                {tasks.length > 0 ? (
                  <div className="space-y-4">
                    {tasks.map((t) => {
                      const isCompleted = t.status === "completed" || t.done;
                      const priority = t.priority || "Medium";
                      const badgeStyle =
                        priority === "High"
                          ? "text-[var(--warning)] bg-[var(--warning-bg)]"
                          : isCompleted
                          ? "text-[var(--muted-foreground)] bg-[var(--muted)]"
                          : "text-[var(--info)] bg-[var(--info-bg)]";

                      const assignee = t.assigned_to?.full_name || t.assigned_user?.full_name || "Assigned";
                      const due = t.due_date || t.deadline || "In Progress";

                      return (
                        <motion.div
                          key={t.id}
                          variants={itemVariants}
                          whileHover={{ x: 6 }}
                          className="flex items-start gap-4 p-2 -mx-2 rounded-xl transition-colors cursor-pointer hover:bg-[var(--bg-surface-elevated)]"
                          onClick={() => toggleTask(t.id, t.status)}
                        >
                          <motion.span
                            whileTap={{ scale: 0.8 }}
                            className={`mt-0.5 h-5 w-5 shrink-0 rounded-md flex items-center justify-center transition-colors ${
                              isCompleted
                                ? "bg-linear-to-br from-indigo-400 to-violet-400 shadow-sm"
                                : "border-2 border-[var(--border)] bg-[var(--bg-surface)]"
                            }`}
                          >
                            {isCompleted && <Check size={12} className="text-white" strokeWidth={3} />}
                          </motion.span>
                          <div className="flex-1 min-w-0">
                            <div
                              className={`text-base font-bold leading-snug transition-all duration-300 ${
                                isCompleted ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"
                              }`}
                            >
                              {t.title || t.name}
                            </div>
                            <div className="text-xs text-[var(--text-muted)] mt-1">
                              {assignee} · {due}
                            </div>
                          </div>
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${badgeStyle}`}
                          >
                            {isCompleted ? "Done" : priority}
                          </motion.span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-8 text-center text-sm text-[var(--text-muted)]">
                    No open tasks for this project yet.
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "Discussion" && (
              <motion.div variants={itemVariants} className="glass-panel rounded-[28px] p-8 text-center py-12">
                <p className="text-base font-bold text-[var(--text-primary)]">Project Discussion Stream</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">
                  Team comments and paper reviews are linked directly into this project pipeline.
                </p>
              </motion.div>
            )}
          </div>

          {/* Right Column / Sub sections */}
          <div className={`space-y-6 ${rightOnly ? "max-w-xl" : ""}`}>
            {(activeTab === "Overview" || activeTab === "Members") && (
              <motion.div variants={itemVariants} className="glass-panel rounded-[28px] p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-1">
                      Collaboration
                    </div>
                    <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                      Members
                    </h3>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleInvite}
                    className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    Invite
                  </motion.button>
                </div>

                {members.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {members.map((m) => {
                      const name = m.name || m.user?.full_name || "Researcher";
                      const role = m.role_label || m.role || "Member";
                      const isLead = role.toLowerCase().includes("lead") || role.toLowerCase().includes("supervisor") || role.toLowerCase().includes("admin");
                      const initials = name
                        .split(" ")
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase();

                      return (
                        <motion.div
                          key={m.id || name}
                          variants={itemVariants}
                          whileHover={{ x: 6 }}
                          className="flex items-center gap-3 py-4 first:pt-0 last:pb-0 -mx-2 px-2 rounded-xl transition-colors cursor-pointer hover:bg-[var(--bg-surface-elevated)]"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="h-11 w-11 rounded-full bg-linear-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-400/20 shrink-0"
                          >
                            {initials}
                          </motion.div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-[var(--text-primary)] truncate">{name}</div>
                            <div className="text-xs text-[var(--text-muted)] capitalize">{role}</div>
                          </div>
                          <motion.span
                            whileHover={{ scale: 1.05 }}
                            className={`shrink-0 text-xs font-bold px-3 py-1 rounded-full ${
                              isLead
                                ? "text-[var(--badge-blue-text)] bg-[var(--badge-blue)]"
                                : "text-[var(--muted-foreground)] bg-[var(--muted)]"
                            }`}
                          >
                            {isLead ? "Lead" : "Member"}
                          </motion.span>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                    No members listed for this project.
                  </div>
                )}
              </motion.div>
            )}

            {(activeTab === "Overview" || activeTab === "Files") && (
              <motion.div variants={itemVariants} className="glass-panel rounded-[28px] p-6">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <div className="text-[10px] font-bold tracking-[0.15em] text-[var(--text-muted)] uppercase mb-1">
                      Repository
                    </div>
                    <h3 className="text-xl font-extrabold text-[var(--text-primary)] tracking-tight">
                      Recent Files
                    </h3>
                  </div>
                  {activeTab === "Overview" && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveTab("Files")}
                      className="text-sm font-bold text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
                    >
                      View all
                    </motion.button>
                  )}
                </div>

                {files.length > 0 ? (
                  <div className="divide-y divide-[var(--border)]">
                    {files.map((f) => {
                      const fileName = f.name || f.file_name || f.original_name || "dataset_file.pdf";
                      const ext = getFileExtension(fileName);
                      const colorStyle = getFileColor(ext);
                      const fileSize = f.size ? (typeof f.size === "number" ? formatBytes(f.size) : f.size) : "1.2 MB";

                      return (
                        <motion.div
                          key={f.id || fileName}
                          variants={itemVariants}
                          whileHover={{ x: 6 }}
                          className="flex items-center gap-3 py-4 first:pt-0 last:pb-0 -mx-2 px-2 rounded-xl transition-colors cursor-pointer hover:bg-[var(--bg-surface-elevated)]"
                          onClick={() => {
                            if (f.download_url || f.file_path) {
                              window.open(f.download_url || `/api/v1/projects/${selectedProjectId}/files/${f.id}/download`, "_blank");
                            }
                          }}
                        >
                          <motion.div
                            whileHover={{ rotate: 4, scale: 1.05 }}
                            className={`h-11 w-11 rounded-xl flex items-center justify-center text-[10px] font-extrabold shrink-0 ${colorStyle}`}
                          >
                            {ext}
                          </motion.div>
                          <div className="flex-1 min-w-0 text-sm font-bold text-[var(--text-primary)] truncate group-hover:text-indigo-500 transition-colors">
                            {fileName}
                          </div>
                          <div className="shrink-0 text-xs text-[var(--text-muted)] font-medium">
                            {fileSize}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-[var(--text-muted)]">
                    No files uploaded to this project yet.
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}