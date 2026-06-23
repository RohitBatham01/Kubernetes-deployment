export default function TaskList({ tasks, loading, onToggle, onDelete }) {
  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>No tasks yet. Add one above!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map(task => (
        <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
          <div
            className={`task-checkbox ${task.completed ? 'checked' : ''}`}
            onClick={() => onToggle(task.id)}
            role="checkbox"
            aria-checked={task.completed}
            tabIndex={0}
          />
          <div className="task-content">
            <div className="task-title">{task.title}</div>
            <div className="task-meta">
              <span className={`priority-badge priority-${task.priority}`}>
                {task.priority}
              </span>
              <span>{new Date(task.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <button className="delete-btn" onClick={() => onDelete(task.id)} aria-label="Delete task">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
