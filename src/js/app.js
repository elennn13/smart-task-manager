import { addTask, clearCompleted } from './taskService.js';
import { render } from './ui.js';
import { setFilter } from './filters.js';
import { initDrag } from './drag.js';
import { applyTheme, toggleTheme } from './theme.js';

// Получаем элементы
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('[data-filter]');
const clearBtn = document.querySelector('.clear-btn');
const themeToggle = document.getElementById('themeToggle');
const addBtn = document.getElementById('addBtn');
const searchInput = document.getElementById('searchInput'); // Добавляем поиск

let searchQuery = ''; // Текущий запрос поиска

// Проверяем, что все элементы найдены
console.log('taskInput:', taskInput);
console.log('addBtn:', addBtn);
console.log('taskList:', taskList);

// Функция для обновления UI
function updateUI() {
  render(taskList, counter, searchQuery); // Передаем searchQuery в render
}

// Поиск при вводе текста
if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value.toLowerCase();
    updateUI();
  });
}

// Кнопка "Добавить"
if (addBtn) {
  addBtn.onclick = () => {
    console.log('Add button clicked, value:', taskInput.value);
    const text = taskInput.value.trim();
    if (text) {
      addTask(text);
      taskInput.value = '';
      updateUI();
    } else {
      alert('Введите задачу!');
    }
  };
} else {
  console.error('addBtn not found!');
}

// Enter в поле ввода
if (taskInput) {
  taskInput.addEventListener('keypress', (e) => {
    console.log('Key pressed:', e.key);
    if (e.key === 'Enter') {
      e.preventDefault();
      console.log('Enter pressed, value:', taskInput.value);
      const text = taskInput.value.trim();
      if (text) {
        addTask(text);
        taskInput.value = '';
        updateUI();
      } else {
        alert('Введите задачу!');
      }
    }
  });
} else {
  console.error('taskInput not found!');
}

// Кнопка "Очистить выполненные"
if (clearBtn) {
  clearBtn.onclick = () => {
    console.log('Clear completed clicked');
    clearCompleted();
    updateUI();
  };
} else {
  console.error('clearBtn not found!');
}

// Кнопки фильтров
if (filterButtons.length > 0) {
  filterButtons.forEach(btn => {
    btn.onclick = () => {
      console.log('Filter button clicked:', btn.dataset.filter);
      setFilter(btn.dataset.filter);
      updateUI();
    };
  });
} else {
  console.error('filterButtons not found!');
}

// Переключатель темы
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    console.log('Theme toggle clicked');
    toggleTheme();
    updateUI();
  });
} else {
  console.error('themeToggle not found!');
}

// Инициализация drag and drop
if (taskList) {
  initDrag(taskList);
} else {
  console.error('taskList not found!');
}

// Применяем тему и рендерим
applyTheme();
updateUI();

console.log('App initialized successfully');