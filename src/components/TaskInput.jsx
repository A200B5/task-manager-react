import { useState, useEffect, useRef } from "react";

export default function TaskInput({ onAdd }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("medium");
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const generateId = () => `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd({ id: generateId(), text: trimmed, priority, completed: false, createdAt: Date.now() });
    setText("");
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.inputRow}>
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What needs to be done?"
          style={styles.textInput}
          maxLength={120}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          style={styles.select}
          aria-label="Priority"
        >
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <button type="submit" style={styles.addBtn} disabled={!text.trim()}>
          Add Task
        </button>
      </div>
    </form>
  );
}

const styles = {
  form: { padding: "1rem 1.25rem" },
  inputRow: { display: "flex", gap: 8, flexWrap: "wrap" },
  textInput: {
    flex: 1, minWidth: 160, padding: "0 12px", height: 38, fontSize: 14,
    border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)",
    background: "var(--color-background-secondary)", color: "var(--color-text-primary)",
  },
  select: {
    height: 38, padding: "0 10px", fontSize: 13,
    border: "0.5px solid var(--color-border-secondary)", borderRadius: "var(--border-radius-md)",
    background: "var(--color-background-secondary)", color: "var(--color-text-primary)", cursor: "pointer",
  },
  addBtn: {
    height: 38, padding: "0 18px", fontSize: 14, fontWeight: 500,
    border: "none", borderRadius: "var(--border-radius-md)",
    background: "#7F77DD", color: "#fff", cursor: "pointer", whiteSpace: "nowrap",
  },
};
