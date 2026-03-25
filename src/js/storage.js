import { state } from './state.js';

export function save() {
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
}