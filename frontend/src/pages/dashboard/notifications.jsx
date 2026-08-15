import { useState, useMemo } from "react";
import { AlertTriangle, Check, Info, Trash2, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { useNotifications } from "../../contexts/NotificationContext.jsx";
import { cn } from "../../utils/cn.js";

const tabTotals = {
  All: 18,
  Unread: 0,
  Tasks: 6,
  Papers: 4,
  Mentions: 3,
};

const priorityStyles = {
  High: "bg-red-50 text-red-700 border-red-100",
  Medium: "bg-amber-50 text-amber-700 border-amber-100",
  Low: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

export default function Notifications() {
  let context;
  try {
    context = useNotifications();
  } catch (error) {
    return (
      <div className="flex h-64 items-center justify-center text-center text-slate-600">
        <div>
          <h2 className="text-xl font-bold text-red-500">Provider Missing</h2>
          <p className="mt-2">
<<<<<<< HEAD
            NotificationContext not found. Please check that your <code>main.jsx</code> has <code>&lt;NotificationProvider&gt;</code> wrapping the app.
=======
            NotificationContext not found. Please check that your{" "}
            <code>main.jsx</code> has <code>&lt;NotificationProvider&gt;</code>{" "}
            wrapping the app.
>>>>>>> 9873b64 (fix: resolve sidebar active state issue and improved dark mode theme)
          </p>
        </div>
      </div>
    );
  }

<<<<<<< HEAD
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = context;
=======
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = context;
>>>>>>> 9873b64 (fix: resolve sidebar active state issue and improved dark mode theme)
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredNotifications = useMemo(() => {
    if (activeFilter === "All") return notifications;
    if (activeFilter === "Unread") return notifications.filter((n) => n.unread);
    return notifications.filter((n) => n.category === activeFilter);
  }, [activeFilter, notifications]);

  const today = filteredNotifications.filter((n) => n.group === "Today");
  const yesterday = filteredNotifications.filter(
    (n) => n.group === "Yesterday",
  );

  const handleViewRelated = (item) => {
    alert(
      `Navigating to related item: ${item.tag || item.title}. (Placeholder action)`,
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-8 w-full relative"
    >
      <div className="flex items-end justify-between gap-8">
        <div>
<<<<<<< HEAD
          <div className="mb-1 text-xs font-medium text-[var(--text-muted)]">Updates</div>
=======
          <div className="mb-1 text-xs font-medium text-[var(--text-muted)]">
            Updates
          </div>
>>>>>>> 9873b64 (fix: resolve sidebar active state issue and improved dark mode theme)
          <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Notifications
          </h1>
        </div>
        <button
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          className="h-11 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] px-6 text-sm font-bold text-[var(--text-secondary)] shadow-sm transition hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] active:scale-[0.98] disabled:cursor-default disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      <div className="glass-panel inline-flex items-center rounded-2xl p-1.5 shadow-sm">
        {Object.keys(tabTotals).map((filter) => {
          const isActive = filter === activeFilter;
          const count = filter === "Unread" ? unreadCount : tabTotals[filter];
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "flex h-10 min-w-[100px] items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-all duration-200 active:scale-[0.98]",
                isActive
                  ? "bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-400/30"
                  : "text-slate-500 hover:bg-white/70 hover:text-slate-800",
              )}
            >
              {filter}
              <span
                className={cn(
                  "flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200/80 text-slate-500",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <section className="glass-panel rounded-[28px] p-6">
        {filteredNotifications.length > 0 ? (
          <div className="space-y-6">
            {today.length > 0 && (
              <NotificationGroup
                title="Today"
                notifications={today}
                onRead={markAsRead}
                onDelete={deleteNotification}
                onView={handleViewRelated}
              />
            )}
            {yesterday.length > 0 && (
              <NotificationGroup
                title="Yesterday"
                notifications={yesterday}
                onRead={markAsRead}
                onDelete={deleteNotification}
                onView={handleViewRelated}
              />
            )}
          </div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-100 to-cyan-100 text-indigo-500">
              <Check size={22} />
            </div>
            <h2 className="mt-4 text-lg font-bold text-[var(--text-primary)]">
              You're all caught up
            </h2>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              There are no notifications in this view.
            </p>
            <button
              onClick={() => setActiveFilter("All")}
              className="mt-5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-indigo-400/30 transition hover:-translate-y-0.5"
            >
              View all notifications
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
}

function NotificationGroup({ title, notifications, onRead, onDelete, onView }) {
  return (
    <div className="space-y-3">
      <h2 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {title}
      </h2>
      <div className="space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => onRead(notification.id)}
            className={cn(
              "group glass-panel flex w-full items-start gap-4 rounded-2xl p-4 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-lg hover:border-indigo-200/80 cursor-pointer",
              notification.unread ? "border-indigo-100/40 bg-indigo-50/55" : "",
            )}
          >
            <NotificationIcon icon={notification.icon} />
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                {notification.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                {notification.description}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {notification.tag && (
                  <span className="inline-flex rounded-lg bg-[var(--bg-surface)] px-2.5 py-1 text-[10px] font-bold text-[var(--text-muted)]">
                    {notification.tag}
                  </span>
                )}
                {notification.priority && (
                  <span
                    className={cn(
                      "inline-flex rounded-lg border px-2.5 py-1 text-[10px] font-bold",
                      priorityStyles[notification.priority],
                    )}
                  >
                    {notification.priority}
                  </span>
                )}
                <span className="text-xs text-[var(--text-secondary)]">
                  {notification.time}
                </span>
                {notification.unread && (
                  <span className="h-2 w-2 rounded-full bg-linear-to-br from-indigo-500 to-cyan-400" />
                )}
              </div>
            </div>

            <div
              className="flex shrink-0 flex-col gap-2 pt-1 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => onView(notification)}
                className="rounded-full p-1.5 text-[var(--text-muted)] transition hover:bg-indigo-50 hover:text-indigo-600"
                title="View related item"
              >
                <ArrowUpRight size={16} />
              </button>
              <button
                onClick={() => onDelete(notification.id)}
                className="rounded-full p-1.5 text-[var(--text-muted)] transition hover:bg-red-50 hover:text-red-500"
                title="Delete notification"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotificationIcon({ icon }) {
  const baseClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm border";

  if (icon === "success") {
    return (
      <span
        className={`${baseClass} bg-emerald-50 text-emerald-600 border-emerald-100`}
      >
        <Check size={18} strokeWidth={3} />
      </span>
    );
  }
  if (icon === "warning") {
    return (
      <span
        className={`${baseClass} bg-amber-50 text-amber-600 border-amber-100`}
      >
        <AlertTriangle size={18} />
      </span>
    );
  }
  if (icon === "info") {
    return (
      <span className={`${baseClass} bg-blue-50 text-blue-600 border-blue-100`}>
        <Info size={18} />
      </span>
    );
  }

  return (
    <span
      className={`${baseClass} bg-linear-to-br from-violet-100 to-cyan-100 border-violet-200/80 text-base font-extrabold text-violet-500`}
    >
      {icon}
    </span>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 9873b64 (fix: resolve sidebar active state issue and improved dark mode theme)
