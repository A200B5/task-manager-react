import { useState, useEffect } from "react";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import "./index.css";

const FILTERS = ["all", "pending", "completed"];

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("taskflow_tasks") || "[]"); }
    catch { return []; }
  });
  const [filter, setFilter] = useState("all");
  const [clearConfirm, setClearConfirm] = useState(false);

  // Persist to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask    = (task) => setTasks((prev) => [task, ...prev]);
  const toggleTask = (id)   => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  const deleteTask = (id)   => setTasks((prev) => prev.filter((t) => t.id !== id));
  const editTask   = (id, text) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, text } : t));
  const clearDone  = () => { setTasks((prev) => prev.filter((t) => !t.completed)); setClearConfirm(false); };

  const total     = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending   = total - completed;
  const progress  = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── Header ── */}
        <header style={styles.header}>
          <div>
            <h1 style={styles.title}>TaskFlow</h1>
            <p style={styles.subtitle}>Stay organized, get things done</p>
          </div>
          <div style={styles.statsRow}>
            {[
              ["Total",   total,     "rgba(127,119,221,0.12)", "#534AB7"],
              ["Done",    completed, "rgba(29,158,117,0.12)",  "#0F6E56"],
              ["Pending", pending,   "rgba(239,159,39,0.12)",  "#854F0B"],
            ].map(([label, val, bg, color]) => (
              <div key={label} style={{ ...styles.statChip, background: bg }}>
                <span style={{ ...styles.statNum, color }}>{val}</span>
                <span style={styles.statLabel}>{label}</span>
              </div>
            ))}
          </div>
        </header>

        {/* ── Progress bar ── */}
        {total > 0 && (
          <div style={styles.progressWrap}>
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressBar, width: `${progress}%` }} />
            </div>
            <span style={styles.progressLabel}>{progress}% complete</span>
          </div>
        )}

        {/* ── Task Input ── */}
        <div style={styles.card}>
          <TaskInput onAdd={addTask} />
        </div>

        {/* ── Filter bar + clear button ── */}
        <div style={styles.toolbar}>
          <div style={styles.filterGroup}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{ ...styles.filterBtn, ...(filter === f ? styles.filterBtnActive : {}) }}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {completed > 0 && (
            clearConfirm ? (
              <div style={styles.confirmRow}>
                <span style={{ fontSize: 13, color: "var(--color-text-secondary)" }}>
                  Clear {completed} done?
                </span>
                <button onClick={clearDone}             style={{ ...styles.clearBtn, color: "#A32D2D" }}>Yes</button>
                <button onClick={() => setClearConfirm(false)} style={styles.clearBtn}>No</button>
              </div>
            ) : (
              <button onClick={() => setClearConfirm(true)} style={styles.clearBtn}>
                Clear completed
              </button>
            )
          )}
        </div>

        {/* ── Task List ── */}
        <div style={styles.card}>
          <TaskList
            tasks={tasks}
            filter={filter}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={editTask}
          />
        </div>

        <footer style={styles.footer}>
          Tasks are saved automatically · {new Date().getFullYear()} TaskFlow
        </footer>
      </div>
    </div>
  );
}

const styles = {
  page:      { minHeight: "100vh", background: "var(--color-background-tertiary)", padding: "2rem 1rem" },
  container: { maxWidth: 640, margin: "0 auto", display: "flex", flexDirection: "column", gap: "1rem" },

  header:   { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 },
  title:    { fontSize: 28, fontWeight: 500, color: "var(--color-text-primary)", letterSpacing: "-0.5px" },
  subtitle: { fontSize: 14, color: "var(--color-text-secondary)", marginTop: 2 },

  statsRow: { display: "flex", gap: 8 },
  statChip: { borderRadius: 10, padding: "6px 14px", textAlign: "center", minWidth: 58 },
  statNum:  { display: "block", fontSize: 20, fontWeight: 500 },
  statLabel:{ display: "block", fontSize: 11, color: "var(--color-text-secondary)", marginTop: 1 },

  progressWrap:  { display: "flex", alignItems: "center", gap: 10 },
  progressTrack: { flex: 1, height: 5, background: "var(--color-background-secondary)", borderRadius: 99, overflow: "hidden" },
  progressBar:   { height: "100%", background: "linear-gradient(90deg,#7F77DD,#1D9E75)", borderRadius: 99, transition: "width .4s ease" },
  progressLabel: { fontSize: 12, color: "var(--color-text-tertiary)", minWidth: 80, textAlign: "right" },

  card: { background: "var(--color-background-primary)", borderRadius: "var(--border-radius-lg)", border: "0.5px solid var(--color-border-tertiary)", overflow: "hidden" },

  toolbar:       { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 },
  filterGroup:   { display: "flex", gap: 3, background: "var(--color-background-primary)", border: "0.5px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-md)", padding: 3 },
  filterBtn:     { padding: "5px 14px", fontSize: 13, border: "none", borderRadius: 7, background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer" },
  filterBtnActive:{ background: "var(--color-background-secondary)", color: "var(--color-text-primary)", fontWeight: 500 },
  clearBtn:      { fontSize: 13, border: "none", background: "transparent", color: "var(--color-text-secondary)", cursor: "pointer", padding: "4px 8px" },
  confirmRow:    { display: "flex", alignItems: "center", gap: 6 },

  footer: { textAlign: "center", fontSize: 12, color: "var(--color-text-tertiary)", paddingBottom: "0.5rem" },
};
