import { ChevronDown } from "lucide-react";
import { researchPapers } from "../../../data/researchPapers.js";
import { cn } from "../../../utils/cn.js";

const statusStyles = {
  "Peer review": "bg-blue-50 text-blue-700 border border-blue-100",
  "Ready to publish": "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Draft: "bg-slate-100 text-slate-600 border border-slate-200",
  "In revision": "bg-amber-50 text-amber-700 border border-amber-100",
};

export default function RecentPapersList() {
  return (
    <div className="glass-panel rounded-[24px] bg-white p-6 shadow-sm border-white/60">
      <div className="flex items-center justify-between border-b border-slate-200/70 pb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Research Pipeline
          </div>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
            Recent Papers
          </h2>
        </div>
        <button className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
          Filter
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {researchPapers.map((paper) => (
          <div
            key={paper.id}
            className="flex flex-col gap-1.5 pb-4 border-b border-slate-200/50 last:border-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-400 font-medium">{paper.id}</span>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-slate-600">
                  {paper.domain}
                </span>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 font-medium",
                    statusStyles[paper.status] || "bg-slate-100 text-slate-600"
                  )}
                >
                  {paper.status}
                </span>
              </div>
              <h3 className="mt-1.5 text-base font-semibold leading-snug text-slate-950">
                {paper.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{paper.authors.join(" • ")}</p>
            </div>
            <div className="shrink-0 text-right sm:pl-6 pt-1 sm:pt-0">
              <div className="text-lg font-bold text-slate-900">{paper.citations}</div>
              <div className="text-[10px] font-medium uppercase tracking-wide text-slate-400">
                Citations
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}