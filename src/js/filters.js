import { state } from './state.js';

export function getFilteredTasks(searchQuery) {
  let tasks = state.tasks;

 // Фильтр по статусу (все/активные/выполненные)
  if (state.filter === 'active') {
    tasks = tasks.filter(t => !t.done);
  } else if (state.filter === 'completed') {
    tasks = tasks.filter(t => t.done);
  }

  // Поиск по тексту
  if (searchQuery && searchQuery.trim() !== '') {
    tasks = tasks.filter(t =>
      t.text.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  return tasks;
}

export function setFilter(type) {
  state.filter = type;
}