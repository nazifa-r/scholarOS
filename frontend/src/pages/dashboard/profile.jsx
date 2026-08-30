import { motion } from "framer-motion";
import { Share2, Pencil, FolderKanban, Quote } from "lucide-react";
import { useEffect, useState } from "react";
import { apiRequest } from "../../utils/api.js";

// Mock data for dashboard sections that are not yet connected to backend.
const mockProfileData = {
  department: "Computer Science Dept.",

  stats: [
    { label: "Papers", value: 14 },
    { label: "Projects", value: 6 },
    { label: "Citations", value: 312 },
    { label: "Followers", value: 248 },
    { label: "Following", value: 57 },
  ],

  biography:
    "Leila leads the Environmental AI group, working at the intersection of graph learning and climate resilience planning. Her research focuses on modeling interdependent infrastructure systems to help policymakers anticipate cascading climate risks. She has supervised 12 graduate researchers and currently leads three cross-institutional archives.",

  skills: [
    "Python",
    "PyTorch",
    "Geospatial Analysis",
    "Causal Inference",
    "Grant Writing",
  ],

  projects: [
    {
      name: "BlueGrid Climate Archive",
      role: "Supervisor",
      members: 9,
      due: "Jun 02",
      progress: 64,
    },
    {
      name: "NeuroLens Initiative",
      role: "Contributor",
      members: 12,
      due: "May 18",
      progress: 82,
    },
    {
      name: "Civic Insight Observatory",
      role: "Advisor",
      members: 16,
      due: "Jun 27",
      progress: 47,
    },
  ],

  papers: [
    {
      id: "RP-2048",
      tags: ["Environmental AI", "Peer Review"],
      title: "Adaptive Graph Models for Predictive Climate Resilience Planning",
      coauthors: "with Aarav Patel · Sofia Chen",
      citations: 128,
    },
    {
      id: "RP-1409",
      tags: ["Environmental AI", "Published"],
      title:
        "Cascading Risk Estimation in Interdependent Infrastructure Networks",
      coauthors: "with Elena Park",
      citations: 203,
    },
    {
      id: "RP-1128",
      tags: ["Graph ML", "Published"],
      title: "Scalable Graph Attention for Regional Climate Forecasting",
      coauthors: "Solo author",
      citations: 156,
    },
  ],

  followers: [
    { initials: "AP", name: "Aarav P." },
    { initials: "SC", name: "Sofia C." },
    { initials: "JR", name: "Jonas R." },
    { initials: "EP", name: "Elena P." },
    { initials: "IH", name: "Ibrahim H." },
  ],
};

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "U";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const tagStatusColor = (tag) => {
  if (tag === "Published")
    return "text-[var(--badge-emerald-text)] bg-[var(--badge-emerald)]";

  if (tag === "Peer Review")
    return "text-[var(--badge-blue-text)] bg-[var(--badge-blue)]";

  return "text-[var(--badge-slate-text)] bg-[var(--badge-slate)]";
};

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [verification, setVerification] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        /*
         * Use Promise.allSettled instead of Promise.all.
         *
         * /v1/user contains the actual profile information and should
         * load independently from the role verification endpoint.
         *
         * If role verification fails, the user's profile should still
         * be displayed.
         */
        const [profileResult, verificationResult] =
          await Promise.allSettled([
            apiRequest("/v1/user"),
            apiRequest("/v1/role-verification"),
          ]);

        if (!isMounted) return;

        // -------------------------------------------------------------
        // USER PROFILE
        // -------------------------------------------------------------
        if (profileResult.status === "fulfilled") {
          setUser(profileResult.value?.data || null);
          setError("");
        } else {
          console.error(
            "Unable to load user profile:",
            profileResult.reason
          );

          setError("Unable to load profile information.");
        }

        // -------------------------------------------------------------
        // ROLE VERIFICATION
        // -------------------------------------------------------------
        if (verificationResult.status === "fulfilled") {
          setVerification(verificationResult.value?.data || null);
        } else {
          /*
           * Role verification is optional for displaying the rest
           * of the profile. Do not allow its failure to break
           * profile loading.
           */
          console.warn(
            "Unable to load role verification:",
            verificationResult.reason
          );

          setVerification(null);
        }
      } catch (requestError) {
        if (!isMounted) return;

        console.error("Unable to load user profile:", requestError);
        setError("Unable to load profile information.");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const name = user?.full_name || "User";

  /*
   * Role comes from the role verification record.
   *
   * This is intentional because the current backend can have:
   * - role_verifications.status = approved
   * - role_verifications.role = faculty/student
   *
   * while users.role_id may still be null.
   */
  const role =
    verification?.status === "approved"
      ? verification?.role === "faculty"
        ? "Faculty Member"
        : verification?.role === "student"
          ? "Student"
          : "Role Verified"
      : verification?.status === "pending"
        ? "Verification Pending"
        : "Role not verified";

  const institution = user?.institution || "Institution not provided";

  /*
   * Research interests come from the existing backend
   * research area relationship:
   *
   * user.research_areas
   *
   * Example backend response:
   * research_areas: [
   *   { id: 1, name: "Artificial Intelligence" },
   *   { id: 4, name: "Computer Vision" }
   * ]
   */
  const interests = Array.isArray(user?.research_areas)
    ? user.research_areas
        .map((area) => area?.name)
        .filter(Boolean)
    : [];

  const initials = getInitials(name);

  const profilePicture = user?.profile_picture;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-7 pb-8"
    >
      {/* Header card */}
      <div className="glass-panel rounded-[28px] p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Profile picture / initials */}
            {profilePicture ? (
              <img
                src={profilePicture}
                alt={name}
                className="h-20 w-20 shrink-0 rounded-full object-cover shadow-lg shadow-indigo-400/20"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-2xl font-extrabold text-white shadow-lg shadow-indigo-400/20">
                {initials}
              </div>
            )}

            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {loading ? "Loading..." : name}
              </h1>

              <div className="mt-3 flex flex-wrap gap-2">
                {/* Real backend role verification */}
                <span className="rounded-full px-3 py-1.5 text-xs font-bold text-[var(--badge-blue-text)] bg-[var(--badge-blue)]">
                  {loading ? "Loading..." : role}
                </span>

                {/* Existing mock department */}
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                  {mockProfileData.department}
                </span>

                {/* Real backend institution */}
                <span className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)]">
                  {loading ? "Loading..." : institution}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-5 py-2.5 text-sm font-bold text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] active:scale-[0.98]">
              <Share2 size={16} />
              Share Profile
            </button>

            <button className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-400/30 transition hover:-translate-y-0.5">
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">
            {error}
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-6 sm:grid-cols-5">
          {mockProfileData.stats.map((stat) => (
            <div key={stat.label}>
              <div className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
                {stat.value}
              </div>

              <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="space-y-6">
          {/* Biography - still mock */}
          <div className="glass-panel rounded-[28px] p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              About
            </div>

            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Biography
            </h3>

            <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">
              {mockProfileData.biography}
            </p>
          </div>

          {/* Research Interests - backend */}
          <div className="glass-panel rounded-[28px] p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Focus Areas
            </div>

            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Research Interests
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {loading ? (
                <span className="text-sm text-[var(--text-muted)]">
                  Loading...
                </span>
              ) : interests.length > 0 ? (
                interests.map((interest) => (
                  <span
                    key={interest}
                    className="rounded-full px-4 py-2 text-sm font-bold text-[var(--badge-blue-text)] bg-[var(--badge-blue)]"
                  >
                    {interest}
                  </span>
                ))
              ) : (
                <span className="text-sm text-[var(--text-muted)]">
                  No research interests added yet.
                </span>
              )}
            </div>
          </div>

          {/* Skills - still mock */}
          <div className="glass-panel rounded-[28px] p-6">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
              Toolkit
            </div>

            <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Skills
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">
              {mockProfileData.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[var(--border)] bg-[var(--bg-surface)] px-4 py-2 text-sm font-semibold text-[var(--text-secondary)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Followers - still mock */}
          <div className="glass-panel rounded-[28px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                  Reach
                </div>

                <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  Recent Followers
                </h3>
              </div>

              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                View all
              </button>
            </div>

            <div className="flex flex-wrap gap-6">
              {mockProfileData.followers.map((follower) => (
                <div
                  key={follower.name}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-cyan-400 text-sm font-extrabold text-white shadow-md shadow-indigo-400/20">
                    {follower.initials}
                  </div>

                  <span className="text-xs font-semibold text-[var(--text-secondary)]">
                    {follower.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Projects - still mock */}
          <div className="glass-panel rounded-[28px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                  Active Workspace
                </div>

                <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  Current Projects
                </h3>
              </div>

              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {mockProfileData.projects.map((project) => (
                <div
                  key={project.name}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-50 to-violet-50 text-indigo-500">
                        <FolderKanban className="h-5 w-5" />
                      </div>

                      <div>
                        <div className="text-sm font-bold text-[var(--text-primary)]">
                          {project.name}
                        </div>

                        <div className="mt-0.5 text-xs text-[var(--text-muted)]">
                          {project.role} &middot; {project.members} members
                          &middot; Due {project.due}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <div className="rounded-full px-2 py-0.5 text-[10px] font-bold text-[var(--badge-emerald-text)] bg-[var(--badge-emerald)]">
                        {project.progress}%
                      </div>

                      <div className="mt-1 h-1 w-16 rounded-full bg-[var(--border)]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Papers - still mock */}
          <div className="glass-panel rounded-[28px] p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--text-muted)]">
                  Publications
                </div>

                <h3 className="mt-1 text-xl font-extrabold tracking-tight text-[var(--text-primary)]">
                  Published Papers
                </h3>
              </div>

              <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                View all
              </button>
            </div>

            <div className="space-y-3">
              {mockProfileData.papers.map((paper) => (
                <div
                  key={paper.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 text-[10px] font-medium tracking-wide text-[var(--text-muted)]">
                        <span>{paper.id}</span>

                        {paper.tags.map((tag) => (
                          <span
                            key={tag}
                            className={`rounded-md px-2 py-0.5 text-[10px] font-bold ${tagStatusColor(
                              tag,
                            )}`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-1.5 text-sm font-bold text-[var(--text-primary)]">
                        {paper.title}
                      </div>

                      <div className="mt-1 text-xs text-[var(--text-muted)]">
                        {paper.coauthors}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                      <div className="flex items-center gap-1 text-lg font-extrabold text-[var(--text-primary)]">
                        <Quote className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        {paper.citations}
                      </div>

                      <span className="text-[10px] uppercase tracking-[0.08em] text-[var(--text-muted)]">
                        Citations
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}