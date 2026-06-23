export default function Header({ healthStatus }) {
  return (
    <header className="header">
      <h1>TaskMaster</h1>
      <p>Manage your tasks efficiently</p>
      <div className="status-badge">
        <span
          className="status-dot"
          style={{
            background: healthStatus === 'healthy' ? '#22c55e' : 
                        healthStatus === 'checking' ? '#f59e0b' : '#ef4444'
          }}
        />
        <span>
          Backend: {healthStatus === 'healthy' ? 'Connected' :
                   healthStatus === 'checking' ? 'Checking...' : 'Disconnected'}
        </span>
      </div>
    </header>
  );
}
