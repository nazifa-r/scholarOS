import { activityFeed } from "../../../data/dashboardOverview.js";

export default function ActivityFeedList() {
  return (
    <div className="glass-panel rounded-[24px] bg-white p-6 shadow-sm border-white/60">
      <div className="border-b border-slate-200/70 pb-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Live Feed
        </div>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">
          Activity
        </h2>
      </div>

      <div className="mt-4 space-y-3">
        {activityFeed.map((item) => (
          <div
            key={item.id}
            className="py-2 border-b border-slate-200/50 last:border-0 last:pb-0"
          >
            <p className="text-sm leading-6 text-slate-800">
              <span className="font-semibold text-slate-950">{item.actor}</span>
              {" "}{item.action}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">
              {item.meta ? <span className="mr-1 text-slate-600">{item.meta} ·</span> : null}
              {item.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}