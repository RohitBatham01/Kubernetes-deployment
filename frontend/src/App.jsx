import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [healthStatus, setHealthStatus] = useState('checking');

  const fetchTasks = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/tasks`);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const { data } = await res.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL.replace('/api', '')}/health`);
      setHealthStatus(res.ok ? 'healthy' : 'unhealthy');
    } catch {
      setHealthStatus('unhealthy');
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, [fetchTasks, checkHealth]);

  const addTask = async (title, priority) => {
    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, priority }),
      });
      if (!res.ok) throw new Error('Failed to add task');
      const { data } = await res.json();
      setTasks(prev => [data, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed }),
      });
      if (!res.ok) throw new Error('Failed to update task');
      const { data } = await res.json();
      setTasks(prev => prev.map(t => t.id === id ? data : t));
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTask = async (id) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
  };

  return (
    <div className="container">
      <Header healthStatus={healthStatus} />
      
      <div className="stats">
        <div className="stat-card">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.pending}</div>
          <div className="stat-label">Pending</div>
        </div>
      </div>

      <TaskForm onAdd={addTask} />
      
      {error && <div className="error">{error}</div>}
      
      <TaskList
        tasks={tasks}
        loading={loading}
        onToggle={toggleTask}
        onDelete={deleteTask}
      />
    </div>
  );
}
