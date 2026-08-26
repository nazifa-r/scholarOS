import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Search } from "lucide-react";
import AuthLayout from "../layout/AuthLayout.jsx";
import Button from "../components/ui/Button.jsx";
import { cn } from "../utils/cn.js";
import { RESEARCH_INTERESTS } from "../data/researchInterests.js";

const INITIAL_VISIBLE_COUNT = 17;

export default function InterestSetup() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showAll, setShowAll] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Gate: only verified, logged-in users reach this step.
  useEffect(() => {
    const token = localStorage.getItem("scholaros_token");
    const rawUser = localStorage.getItem("scholaros_user");

    if (!token || !rawUser) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(rawUser);
      if (!user.email_verified_at) {
        sessionStorage.setItem("scholaros_verification_email", user.email);
        navigate("/verify-otp", { replace: true });
      }
    } catch {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  const filtered = useMemo(() => {
    if (!query.trim()) return RESEARCH_INTERESTS;
    const q = query.trim().toLowerCase();
    return RESEARCH_INTERESTS.filter((interest) =>
      interest.label.toLowerCase().includes(q),
    );
  }, [query]);

  const visible = showAll || query.trim()
    ? filtered
    : filtered.slice(0, INITIAL_VISIBLE_COUNT);

  const hiddenCount = Math.max(filtered.length - visible.length, 0);

  const toggleInterest = (id) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleNext = async () => {
    setSubmitting(true);
    // Placeholder only — wire up to POST /api/users/interests later.
    const selected = RESEARCH_INTERESTS.filter((i) => selectedIds.has(i.id));
    console.log("[placeholder] selected interests:", selected);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setSubmitting(false);
    navigate("/role-setup");
  };

  return (
    <AuthLayout
      title="What are you researching?"
      subtitle="Select as many as apply. This helps ScholarOS surface relevant papers and researchers from day one."
      sideTitle="Let's tailor ScholarOS to your research."
      sideDescription="A couple of quick steps and your workspace will be ready — recommended papers, projects, and collaborators, matched to you."
      footerText="Step 1 of 2 —"
      footerAction={
        <button
          type="button"
          onClick={() => navigate("/role-setup")}
          className="font-semibold text-blue-700 hover:text-blue-800"
        >
          Skip for now
        </button>
      }
    >
      <div className="space-y-6">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search interests…"
            className="w-full rounded-2xl border border-slate-200/80 bg-white/85 py-3.5 pl-11 pr-4 text-slate-900 shadow-sm outline-none backdrop-blur-xl placeholder:text-slate-400 focus:border-blue-300 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-600">
            Popular in your field
          </span>
          <span className="text-sm font-semibold text-blue-700">
            {selectedIds.size} selected
          </span>
        </div>

        {visible.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-8 text-center text-sm text-slate-500">
            No interests match your search. Try a different term.
          </p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {visible.map((interest) => {
              const selected = selectedIds.has(interest.id);
              return (
                <button
                  key={interest.id}
                  type="button"
                  onClick={() => toggleInterest(interest.id)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all",
                    selected
                      ? "border-transparent bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_12px_30px_rgba(37,99,235,0.25)]"
                      : "border-slate-200/80 bg-white/85 text-slate-700 backdrop-blur-xl hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700",
                  )}
                >
                  {selected && (
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </span>
                  )}
                  {interest.label}
                </button>
              );
            })}

            {!showAll && hiddenCount > 0 && (
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex items-center rounded-full border border-dashed border-blue-300 bg-blue-50/70 px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-100/70"
              >
                + {hiddenCount} more
              </button>
            )}
          </div>
        )}

        <Button
          type="button"
          onClick={handleNext}
          disabled={submitting}
          className="w-full justify-center py-3.5 text-base"
        >
          {submitting ? "Saving…" : "Next: Select Role \u2192"}
        </Button>
      </div>
    </AuthLayout>
  );
}
