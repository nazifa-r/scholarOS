import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import { cn } from "../../utils/cn.js";

const researchersData = [
  {
    initials: "LM",
    name: "Dr. Leila Morgan",
    role: "Lead Scientist",
    field: "Environmental AI · CS Dept.",
    department: "Computer Science",
    interests: ["Climate AI", "Graph ML"],
    papers: 14,
    projects: 6,
    citations: 312,
    following: true,
  },
  {
    initials: "NM",
    name: "Prof. Nadia Mensah",
    role: "Associate Professor",
    field: "Health Informatics",
    department: "Medicine",
    interests: ["Federated ML", "Imaging"],
    papers: 22,
    projects: 9,
    citations: 540,
  },
  {
    initials: "JR",
    name: "Jonas Richter",
    role: "Data Engineer",
    field: "Research Systems",
    department: "Engineering",
    interests: ["Pipelines", "MLOps"],
    papers: 7,
    projects: 11,
    citations: 88,
  },
  {
    initials: "YS",
    name: "Dr. Yuki Sato",
    role: "Research Fellow",
    field: "Cybersecurity",
    department: "Computer Science",
    interests: ["Cryptography", "PQC"],
    papers: 19,
    projects: 5,
    citations: 276,
  },
  {
    initials: "AP",
    name: "Aarav Patel",
    role: "PhD Candidate",
    field: "Environmental AI",
    department: "Engineering",
    interests: ["Climate Modeling"],
    papers: 4,
    projects: 3,
    citations: 41,
  },
  {
    initials: "SC",
    name: "Sofia Chen",
    role: "Research Assistant",
    field: "Environmental AI",
    department: "Computer Science",
    interests: ["Data Systems"],
    papers: 3,
    projects: 4,
    citations: 19,
  },
  {
    initials: "EP",
    name: "Elena Park",
    role: "Postdoctoral Researcher",
    field: "Research Systems",
    department: "Social Sciences",
    interests: ["Knowledge Graphs"],
    papers: 9,
    projects: 2,
    citations: 64,
  },
  {
    initials: "IH",
    name: "Ibrahim Hassan",
    role: "Research Fellow",
    field: "Cybersecurity",
    department: "Computer Science",
    interests: ["Identity Systems"],
    papers: 11,
    projects: 4,
    citations: 102,
  },
];

const departments = [
  "All Departments",
  "Computer Science",
  "Medicine",
  "Engineering",
  "Social Sciences",
];

export default function Researchers() {
  const [department, setDepartment] = useState("All Departments");
  const [query, setQuery] = useState("");
  const [followings, setFollowings] = useState(
    () =>
      new Set(researchersData.filter((r) => r.following).map((r) => r.name)),
  );
  const [selectedResearcher, setSelectedResearcher] = useState(null);

  const visibleResearchers = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return researchersData.filter((researcher) => {
      const inDepartment =
        department === "All Departments" ||
        researcher.department === department;
      const searchable = [
        researcher.name,
        researcher.role,
        researcher.field,
        ...researcher.interests,
      ]
        .join(" ")
        .toLowerCase();
      return inDepartment && (!needle || searchable.includes(needle));
    });
  }, [department, query]);

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
            className="w-full rounded-full border border-[var(--border)] bg-[var(--bg-surface)] pl-10 pr-4 py-3 text-sm text-[var(--text-primary)] shadow-sm outline-none backdrop-blur-md placeholder:text-[var(--text-muted)] focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {departments.map((item) => (
          <button
            key={item}
            onClick={() => setDepartment(item)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer",
              department === item
                ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-400/30"
                : "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)]",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {visibleResearchers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visibleResearchers.map((researcher) => {
            const isFollowing = followings.has(researcher.name);
            return (
              <div
                key={researcher.name}
                onClick={() => setSelectedResearcher(researcher)}
                className="group relative flex flex-col items-center glass-panel rounded-[28px] p-7 transition-all hover:shadow-lg hover:border-indigo-200/80 cursor-pointer w-full"
              >
                <div className="h-20 w-20 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-400/20 mb-4">
                  {researcher.initials}
                </div>

                <h3 className="text-lg font-extrabold text-[var(--text-primary)] text-center">
                  {researcher.name}
                </h3>
                <p className="text-sm text-[var(--text-secondary)] text-center">
                  {researcher.role}
                </p>
                <p className="text-xs text-[var(--text-muted)] text-center">
                  {researcher.field}
                </p>

                <div className="mt-3 flex flex-wrap justify-center gap-2">
                  {researcher.interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full bg-[var(--bg-surface)] px-2.5 py-1 text-[10px] font-medium text-[var(--text-secondary)]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>

                <div className="mt-5 w-full border-t border-[var(--border)] pt-4 grid grid-cols-3 text-center gap-2">
                  {[
                    [researcher.papers, "Papers"],
                    [researcher.projects, "Projects"],
                    [researcher.citations, "Citations"],
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

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFollow(researcher.name);
                  }}
                  className={`mt-5 w-full rounded-full py-2.5 text-sm font-bold transition-all duration-200 ${
                    isFollowing
                      ? "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:border-indigo-200 hover:text-indigo-600"
                      : "bg-gradient-to-r from-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-400/20 hover:shadow-lg hover:-translate-y-0.5"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="glass-panel rounded-[28px] py-20 text-center text-[var(--text-secondary)]">
          No researchers match your search.
        </div>
      )}

      <AnimatePresence>
        {selectedResearcher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-6"
            onClick={() => setSelectedResearcher(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md overflow-hidden glass-panel rounded-[28px] p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedResearcher(null)}
                className="absolute right-4 top-4 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-indigo-400/20 mb-4">
                  {selectedResearcher.initials}
                </div>
                <h2 className="text-2xl font-extrabold text-[var(--text-primary)]">
                  {selectedResearcher.name}
                </h2>
                <p className="text-sm text-[var(--text-secondary)]">
                  {selectedResearcher.role}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">
                  {selectedResearcher.field}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
