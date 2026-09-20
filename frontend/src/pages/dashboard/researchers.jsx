import { useState, useMemo, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, RotateCw, Users } from "lucide-react";
import { cn } from "../../utils/cn.js";
import {
  getDashboardResearchers,
  getResearcherDetails,
} from "../../services/dashboardService.js";

const departments = [
  "All Departments",
  "Computer Science",
  "Medicine",
  "Engineering",
  "Social Sciences",
  "Data Science",
];

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export default function Researchers() {
  const [department, setDepartment] = useState("All Departments");
  const [query, setQuery] = useState("");
  const [followings, setFollowings] = useState(() => new Set());
  const [selectedResearcherId, setSelectedResearcherId] = useState(null);
  const [selectedResearcher, setSelectedResearcher] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [researchers, setResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResearchers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getDashboardResearchers();
      const rawList = Array.isArray(res?.data)
        ? res.data
        : res?.data?.data || [];
      
      setResearchers(rawList);
    } catch (err) {
      console.error("Error loading researchers:", err);
      setError(err?.data?.message || err?.message || "Failed to load researchers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResearchers();
  }, [fetchResearchers]);

  // Load modal details when selected
  useEffect(() => {
    let isMounted = true;
    async function loadModalDetails() {
      if (!selectedResearcherId) {
        setSelectedResearcher(null);
        return;
      }
      try {
        setModalLoading(true);
        const res = await getResearcherDetails(selectedResearcherId);
        if (isMounted && res?.data) {
          setSelectedResearcher(res.data);
        }
      } catch (err) {
        console.error("Error loading researcher details:", err);
      } finally {
        if (isMounted) setModalLoading(false);
      }
    }
    loadModalDetails();
    return () => {
      isMounted = false;
    };
  }, [selectedResearcherId]);

  // Filter Logic
  const visibleResearchers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return researchers.filter((researcher) => {
      const deptName = researcher.department || "";
      const inDepartment =
        department === "All Departments" ||
        deptName.toLowerCase().includes(department.toLowerCase()) ||
        (department === "Computer Science" && deptName.toLowerCase().includes("cs"));

      const interestsStr = Array.isArray(researcher.research_interests)
        ? researcher.research_interests.join(" ")
        : typeof researcher.research_interests === "string"
        ? researcher.research_interests
        : "";

      const searchable = [
        researcher.full_name || researcher.name || "",
        researcher.role || "",
        researcher.institution || "",
        deptName,
        interestsStr,
      ]
        .join(" ")
        .toLowerCase();

      return inDepartment && (!needle || searchable.includes(needle));
    });
  }, [department, query, researchers]);

  const toggleFollow = (name) => {
    setFollowings((current) => {
      const next = new Set(current);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  return (
    <div className="space-y-6 pb-8 w-full min-w-0 relative">
      {/* Page Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs text-[var(--text-muted)] font-medium mb-1">
            Directory
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Researchers
          </h1>
        </div>
        <div className="relative w-full sm:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
            size={16}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="search"
            placeholder="Search by name, interest..."
            className="w-full rounded-full border border-[var(--border)] bg-[var(--input-bg)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur-md placeholder:text-[var(--text-muted)] focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all"
          />
        </div>
      </div>

      {/* Departments Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {departments.map((item) => (
          <button
            key={item}
            onClick={() => setDepartment(item)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer",
              department === item
                ? "bg-linear-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-400/30"
                : "bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:shadow-sm hover:text-[var(--text-primary)]",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Researchers Grid / Loading / Error */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-panel rounded-[28px] p-7 space-y-4 flex flex-col items-center">
              <div className="h-20 w-20 rounded-full skeleton" />
              <div className="h-5 w-32 rounded skeleton" />
              <div className="h-3 w-24 rounded skeleton" />
              <div className="h-8 w-full rounded skeleton mt-4" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="glass-panel rounded-[28px] p-10 text-center">
          <p className="text-rose-500 font-bold mb-4">{error}</p>
          <button
            onClick={fetchResearchers}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-500 to-violet-500 text-white text-sm font-bold shadow-md shadow-indigo-500/20 cursor-pointer"
          >
            <RotateCw size={15} /> Retry
          </button>
        </div>
      ) : visibleResearchers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleResearchers.map((researcher) => {
            const name = researcher.full_name || researcher.name || "Researcher";
            const initials = researcher.initials || getInitials(name);
            const role = researcher.role || "Researcher";
            const field = researcher.field || (researcher.department ? `${researcher.department} Dept.` : researcher.institution || "Faculty");
            const isFollowing = followings.has(name);

            const interests = Array.isArray(researcher.research_interests)
              ? researcher.research_interests
              : typeof researcher.research_interests === "string"
              ? researcher.research_interests.split(",").map((s) => s.trim())
              : ["Research", "Collaboration"];

            const papersCount = researcher.paper_count ?? researcher.papers ?? 0;
            const projectsCount = researcher.project_count ?? researcher.projects ?? 0;
            const citationsCount = researcher.followers_count ?? researcher.citations ?? 0;

            return (
              <div
                key={researcher.id || name}
                onClick={() => setSelectedResearcherId(researcher.id)}
                className="group relative flex flex-col items-center rounded-[28px] glass-panel p-7 transition-all hover:shadow-lg hover:border-indigo-200/80 cursor-pointer w-full"
              >
                {/* Avatar */}
                <div className="h-20 w-20 shrink-0 rounded-full bg-linear-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-400/20 mb-4">
                  {initials}
                </div>

                {/* Info */}
                <h3 className="text-lg font-extrabold text-[var(--text-primary)] text-center line-clamp-1">
                  {name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  {role}
                </p>
                <p className="text-xs text-[var(--text-muted)] text-center line-clamp-1">
                  {field}
                </p>

                {/* Interests */}
                <div className="mt-3 flex flex-wrap justify-center gap-2 max-h-14 overflow-hidden">
                  {interests.slice(0, 3).map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-[var(--muted)] px-2.5 py-1 text-[10px] font-medium text-[var(--muted-foreground)]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="mt-5 w-full border-t border-[var(--border)] pt-4 grid grid-cols-3 text-center gap-2">
                  {[
                    [papersCount, "Papers"],
                    [projectsCount, "Projects"],
                    [citationsCount, "Followers"],
                  ].map(([value, label]) => (
                    <div key={label}>
                      <div className="text-lg font-extrabold leading-none text-[var(--text-primary)]">
                        {value}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Follow Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(name);
                  }}
                  className={cn(
                    "mt-5 w-full rounded-full py-2.5 text-sm font-bold transition-all duration-200 cursor-pointer",
                    isFollowing
                      ? "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:border-indigo-200 hover:text-indigo-600"
                      : "bg-linear-to-r from-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-400/20 hover:shadow-lg hover:-translate-y-0.5",
                  )}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-[28px] glass-panel py-20 text-center text-[var(--text-secondary)]">
          <Users className="h-12 w-12 text-indigo-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-[var(--text-primary)]">No Researchers Found</h3>
          <p className="text-sm mt-1">No researcher profiles match your search criteria.</p>
        </div>
      )}

      {/* PROFILE MODAL */}
      <AnimatePresence>
        {selectedResearcherId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-6"
            onClick={() => setSelectedResearcherId(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-lg overflow-hidden rounded-[28px] bg-[var(--bg-surface-elevated)] border border-[var(--border)] p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedResearcherId(null)}
                className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>

              {modalLoading ? (
                <div className="space-y-4 py-8 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full skeleton" />
                  <div className="h-6 w-48 rounded skeleton" />
                  <div className="h-4 w-32 rounded skeleton" />
                </div>
              ) : selectedResearcher ? (
                <div className="flex flex-col items-center text-center">
                  <div className="h-24 w-24 rounded-full bg-linear-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-400/20 mb-4">
                    {getInitials(selectedResearcher.full_name)}
                  </div>
                  <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
                    {selectedResearcher.full_name}
                  </h2>
                  <p className="text-sm text-[var(--text-secondary)] font-medium">
                    {selectedResearcher.role || "Researcher"} · {selectedResearcher.department || selectedResearcher.institution || "University"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    {selectedResearcher.email}
                  </p>

                  {selectedResearcher.bio && (
                    <p className="mt-4 text-sm text-[var(--text-secondary)] leading-relaxed">
                      {selectedResearcher.bio}
                    </p>
                  )}

                  {selectedResearcher.research_areas && selectedResearcher.research_areas.length > 0 && (
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                      {selectedResearcher.research_areas.map((area) => (
                        <span
                          key={area}
                          className="rounded-full bg-[var(--badge-blue)] px-3 py-1 text-xs font-semibold text-[var(--badge-blue-text)]"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-6 w-full border-t border-[var(--border)] pt-4 grid grid-cols-4 text-center gap-2">
                    <div>
                      <div className="text-xl font-extrabold text-[var(--text-primary)]">
                        {selectedResearcher.paper_count ?? 0}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Papers</div>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[var(--text-primary)]">
                        {selectedResearcher.project_count ?? 0}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Projects</div>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[var(--text-primary)]">
                        {selectedResearcher.followers_count ?? 0}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Followers</div>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-[var(--text-primary)]">
                        {selectedResearcher.following_count ?? 0}
                      </div>
                      <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Following</div>
                    </div>
                  </div>
                </div>
              ) : null}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}