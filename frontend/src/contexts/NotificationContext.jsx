import { createContext, useContext, useState } from "react";

const initialNotifications = [
  {
    id: 1,
    group: "Today",
    category: "Mentions",
    title: "New review note added",
    description:
      'Prof. Nadia Mensah commented on the Methods section of "Federated Medical Imaging Pipelines."',
    time: "2m ago",
    tag: "Federated Imaging",
    icon: "info",
    unread: true,
    priority: "High",
    sender: "Prof. Nadia Mensah",
  },
  {
    id: 2,
    group: "Today",
    category: "Tasks",
    title: "Milestone completed",
    description:
      'Citation verification finished for 128 references in "Adaptive Graph Models."',
    time: "1h ago",
    tag: "BlueGrid Archive",
    icon: "success",
    unread: true,
    priority: "Low",
    sender: "System",
  },
  {
    id: 3,
    group: "Today",
    category: "Papers",
    title: "Jonas Richter uploaded a new paper",
    description:
      '"Federated Medical Imaging Pipelines for Cross-Institutional Diagnostics" was submitted for review.',
    time: "2h ago",
    icon: "JR",
    unread: true,
    priority: "Medium",
    sender: "Jonas Richter",
  },
  {
    id: 4,
    group: "Today",
    category: "Tasks",
    title: "Submission deadline approaching",
    description:
      'BlueGrid Climate Archive milestone "Paper Draft" is due in 5 days.',
    time: "3h ago",
    tag: "Deadline",
    icon: "warning",
    unread: true,
    priority: "High",
    sender: "System",
  },
  {
    id: 5,
    group: "Yesterday",
    category: "Tasks",
    title: "Elena Park completed a task",
    description:
      '"Prepare collaborator invite list" was marked complete on Civic Insight Observatory.',
    time: "1d ago",
    icon: "EP",
    unread: true,
    priority: "Medium",
    sender: "Elena Park",
  },
  {
    id: 6,
    group: "Yesterday",
    category: "Mentions",
    title: "Mina Ross left a comment",
    description:
      '"Can we align this with the Q3 dataset schema before merging?" — on Adaptive Graph Models.',
    time: "1d ago",
    icon: "MR",
    unread: false,
    priority: "Low",
    sender: "Mina Ross",
  },
  {
    id: 7,
    group: "Yesterday",
    category: "Mentions",
    title: "Project invitation accepted",
    description:
      "Aarav Patel joined BlueGrid Climate Archive as a contributor.",
    time: "1d ago",
    icon: "info",
    unread: false,
    priority: "Low",
    sender: "System",
  },
];

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
