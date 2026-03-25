import { state } from './state.js';

export function applyTheme() {
  document.body.className = state.theme;
}

export function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  applyTheme();
}