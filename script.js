const state = {
  tasks: JSON.parse(localStorage.getItem('tasks')) || [],
  filter: 'all',
  theme: localStorage.getItem('theme') || 'dark'
};

const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('[data-filter]');
const clearBtn = document.querySelector('.clear-btn');
const themeToggle = document.getElementById('themeToggle');
const addBtn = document.getElementById('addBtn');

/* ================= STORAGE ================= */
function save() {
  localStorage.setItem('tasks', JSON.stringify(state.tasks));
}

/* ================= CURSOR GLOW ================= */
document.querySelector('.app').addEventListener("mousemove", (e) => {
  document.querySelectorAll(".task").forEach(card => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty("--x", `${e.clientX - rect.left}px`);
    card.style.setProperty("--y", `${e.clientY - rect.top}px`);
  });
});

/* ================= TASK LOGIC ================= */

function addTask() {
  const value = taskInput.value.trim();
  if (!value) return;

  state.tasks.push({
    id: Date.now(),
    text: value,
    done: false
  });

  taskInput.value = '';
  save();
  render();
}

function toggleTask(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  task.done = !task.done;
  save();
  render();
}

function deleteTask(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  save();
  render();
}

function editTask(id, text) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  task.text = text;
  save();
  render();
}

function clearCompleted() {
  state.tasks = state.tasks.filter(t => !t.done);
  save();
  render();
}

/* ================= FILTER ================= */

function getFilteredTasks() {
  if (state.filter === 'active') return state.tasks.filter(t => !t.done);
  if (state.filter === 'completed') return state.tasks.filter(t => t.done);
  return state.tasks;
}

function setFilter(type) {
  state.filter = type;

  filterButtons.forEach(btn => btn.classList.remove('active'));

  const activeBtn = document.querySelector(`[data-filter="${type}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  render();
}

/* ================= RENDER ================= */

function createTaskElement(task) {
  const li = document.createElement('li');
  li.className = "task";

  const left = document.createElement('div');
  left.className = 'task-left';

  const check = document.createElement('div');
  check.className = `check ${task.done ? 'checked' : ''}`;
  check.textContent = task.done ? '✔' : '';

  const text = document.createElement('span');
  text.textContent = task.text;
  if (task.done) text.classList.add('done');

  let editing = false;

  const editBtn = document.createElement('button');
  editBtn.textContent = '✎';

  editBtn.onclick = () => {
    if (editing) return;
    editing = true;

    const input = document.createElement('input');
    input.value = task.text;

    left.replaceChild(input, text);
    input.focus();

    const saveEdit = () => {
      editing = false;
      const val = input.value.trim();
      if (val) editTask(task.id, val);
      else render();
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveEdit();
    });
  };

  const del = document.createElement('button');
  del.textContent = '✕';

  check.onclick = () => toggleTask(task.id);
  del.onclick = () => deleteTask(task.id);

  left.append(check, text);

  const actions = document.createElement('div');
  actions.className = 'task-actions';
  actions.append(editBtn, del);

  li.append(left, actions);
  return li;
}

function render() {
  taskList.innerHTML = '';

  const tasks = getFilteredTasks();

  if (!tasks.length) {
    const empty = document.createElement('li');
    empty.textContent = 'Нет задач';
    empty.style.opacity = '0.6';
    empty.style.textAlign = 'center';
    empty.style.listStyle = 'none';
    taskList.appendChild(empty);

    counter.textContent = `Всего: 0`;
    return;
  }

  tasks.forEach(t => taskList.appendChild(createTaskElement(t)));

  counter.textContent = `Всего: ${state.tasks.length}`;
}

/* ================= THEME ================= */

function applyTheme() {
  document.body.className = state.theme;
}

themeToggle.addEventListener('click', () => {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', state.theme);
  applyTheme();
});

/* ================= EVENTS ================= */

addBtn.onclick = addTask;

taskInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') addTask();
});

clearBtn.onclick = clearCompleted;

filterButtons.forEach(btn => {
  btn.onclick = () => setFilter(btn.dataset.filter);
});

/* ================= INIT ================= */

applyTheme();
render();