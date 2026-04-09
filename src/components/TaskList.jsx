import TaskItem from "./TaskItem";

export default function TaskList({ tasks, filter, onToggle, onDelete, onEdit }) {
  const filtered = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  if (filtered.length === 0) {
    const message =
      filter === "completed" ? "No completed tasks yet." :
      filter === "pending"   ? "All caught up!" :
                               "No tasks yet — add one above!";

    return (
      <div style={styles.empty}>
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
          stroke="var(--color-text-secondary)" strokeWidth="1.2" strokeLinecap="round"
          style={{ opacity: 0.4, marginBottom: 12 }}>
          <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
          <rect x="9" y="3" width="6" height="4" rx="2" />
          <path d="M9 12h6M9 16h4" />
        </svg>
        <p style={{ color: "var(--color-text-secondary)", margin: 0, fontSize: 15 }}>{message}</p>
      </div>
    );
  }

  return (
    <div>
      {filtered.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

const styles = {
  empty: {
    display: "flex", flexDirection: "column", alignItems: "center",
    justifyContent: "center", padding: "3rem 1.25rem", textAlign: "center",
  },
};
