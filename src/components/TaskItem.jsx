import { useState, useEffect, useRef } from "react";

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [removing, setRemoving] = useState(false);
  const editRef = useRef(null);

  useEffect(() => { if (editing) editRef.current?.focus(); }, [editing]);

  const commitEdit = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== task.text) onEdit(task.id, trimmed);
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") commitEdit();
    if (e.key === "Escape") { setEditText(task.text); setEditing(false); }
  };

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => onDelete(task.id), 280);
  };

  const priorityDot = { high: "#E24B4A", medium: "#EF9F27", low: "#639922" }[task.priority];

  return (
    <div style={{
      ...styles.taskItem,
      opacity: removing ? 0 : task.completed ? 0.65 : 1,
      transform: removing ? "scale(0.96)" : "scale(1)",
    }}>
      {/* Checkbox */}
      <button
        onClick={() => onToggle(task.id)}
        style={{ ...styles.checkbox, ...(task.completed ? styles.checkboxDone : {}) }}
        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
      >
        {task.completed && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Priority dot */}
      <span style={{ ...styles.priorityDot, background: priorityDot }} title={`${task.priority} priority`} />

      {/* Text / Edit input */}
      <div style={styles.taskBody}>
        {editing ? (
          <input
            ref={editRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleKeyDown}
            style={styles.editInput}
            maxLength={120}
          />
        ) : (
          <span style={{ ...styles.taskText, ...(task.completed ? styles.taskTextDone : {}) }}>
            {task.text}
          </span>
        )}
        <span style={styles.taskDate}>
          {new Date(task.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        </span>
      </div>

      {/* Action buttons */}
      <div style={styles.taskActions}>
        {!editing && (
          <button
            onClick={() => { setEditText(task.text); setEditing(true); }}
            style={styles.iconBtn}
            aria-label="Edit task"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
        )}
        <button onClick={handleDelete} style={{ ...styles.iconBtn, color: "#A32D2D" }} aria-label="Delete task">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const styles = {
  taskItem: {
    display: "flex", alignItems: "center", gap: 10, padding: "12px 1.25rem",
    borderBottom: "0.5px solid var(--color-border-tertiary)",
    animation: "slideIn 0.22s ease", transition: "opacity .28s, transform .28s",
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 6,
    border: "1.5px solid var(--color-border-secondary)",
    background: "transparent", display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "all .18s",
  },
  checkboxDone: { background: "#1D9E75", borderColor: "#1D9E75" },
  priorityDot: { width: 7, height: 7, borderRadius: "50%", flexShrink: 0 },
  taskBody: { flex: 1, minWidth: 0 },
  taskText: { display: "block", fontSize: 14, color: "var(--color-text-primary)", lineHeight: 1.5, wordBreak: "break-word" },
  taskTextDone: { textDecoration: "line-through", color: "var(--color-text-secondary)" },
  taskDate: { fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2, display: "block" },
  editInput: {
    width: "100%", fontSize: 14, border: "1px solid #7F77DD",
    borderRadius: 6, padding: "3px 8px",
    background: "var(--color-background-secondary)", color: "var(--color-text-primary)",
  },
  taskActions: { display: "flex", gap: 4, flexShrink: 0 },
  iconBtn: {
    width: 30, height: 30, border: "none", background: "transparent",
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", borderRadius: 6, color: "var(--color-text-secondary)",
  },
};
