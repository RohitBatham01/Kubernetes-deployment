import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// In-memory store (replace with database in production)
let tasks = [
  { id: uuidv4(), title: 'Learn Kubernetes', completed: false, priority: 'high', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Deploy application', completed: false, priority: 'medium', createdAt: new Date().toISOString() },
  { id: uuidv4(), title: 'Write documentation', completed: true, priority: 'low', createdAt: new Date().toISOString() },
];

// GET all tasks
router.get('/', (req, res) => {
  const { completed, priority } = req.query;
  let filtered = [...tasks];
  
  if (completed !== undefined) {
    filtered = filtered.filter(t => t.completed === (completed === 'true'));
  }
  if (priority) {
    filtered = filtered.filter(t => t.priority === priority);
  }
  
  res.json({ data: filtered, count: filtered.length });
});

// GET single task
router.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json({ data: task });
});

// POST new task
router.post('/', (req, res) => {
  const { title, priority = 'medium' } = req.body;
  
  if (!title?.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const newTask = {
    id: uuidv4(),
    title: title.trim(),
    completed: false,
    priority,
    createdAt: new Date().toISOString(),
  };
  
  tasks.unshift(newTask);
  res.status(201).json({ data: newTask });
});

// PUT update task
router.put('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const { title, completed, priority } = req.body;
  tasks[index] = {
    ...tasks[index],
    ...(title !== undefined && { title: title.trim() }),
    ...(completed !== undefined && { completed }),
    ...(priority !== undefined && { priority }),
    updatedAt: new Date().toISOString(),
  };
  
  res.json({ data: tasks[index] });
});

// DELETE task
router.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  
  const deleted = tasks.splice(index, 1)[0];
  res.json({ data: deleted, message: 'Task deleted' });
});

export { router as taskRouter };
