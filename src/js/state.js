export const state = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  filter: 'all',
  theme: localStorage.getItem('theme') || 'dark'
};