import { state } from './state.js';
import { save } from './storage.js';

export function addTask(text) {
  console.log('addTask called with text:', text);
  const value = text.trim();
  if (!value) {
    console.log('Empty task, not adding');
    return;
  }

  const newTask = {
    id: Date.now(),
    text: value,
    done: false
  };
  
  console.log('Adding task:', newTask);
  state.tasks.push(newTask);
  save();
  console.log('Tasks after add:', state.tasks);
}

export function toggleTask(id) {
  console.log('toggleTask called for id:', id);
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.done = !task.done;
  save();
}

export function deleteTask(id) {
  console.log('deleteTask called for id:', id);
  state.tasks = state.tasks.filter(t => t.id !== id);
  save();
}

export function editTask(id, text) {
  console.log('editTask called for id:', id, 'text:', text);
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.text = text;
  save();
}

export function clearCompleted() {
  console.log('clearCompleted called');
  state.tasks = state.tasks.filter(t => !t.done);
  save();
}