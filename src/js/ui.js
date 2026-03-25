import { getFilteredTasks } from './filters.js';
import {
  toggleTask,
  deleteTask,
  editTask
} from './taskService.js';

import { applyDrag } from './drag.js';

export function createTaskElement(task, taskList, onUpdate) {
  const li = document.createElement('li');
  li.className = "task";
  li.dataset.id = task.id;

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
    input.className = 'task-input';

    text.style.display = 'none';
    left.insertBefore(input, text);

    input.focus();

    const saveEdit = () => {
      editing = false;
      const val = input.value.trim();

      input.remove();
      text.style.display = '';

      if (val) {
        editTask(task.id, val);
        onUpdate();
      }
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') saveEdit();
    });
  };

  const del = document.createElement('button');
  del.textContent = '✕';

  check.onclick = () => {
    toggleTask(task.id);
    onUpdate();
  };

  del.onclick = () => {
    deleteTask(task.id);
    onUpdate();
  };
  
  left.append(check, text);

  const actions = document.createElement('div');
  actions.className = 'task-actions';
  actions.append(editBtn, del);

  li.append(left, actions);

  applyDrag(li, taskList);

  return li;
}

export function render(taskList, counter, searchQuery) {
  console.log('render called, searchQuery:', searchQuery);
  
  if (!taskList) {
    console.error('taskList is null in render');
    return;
  }
  
  taskList.innerHTML = '';
  const tasks = getFilteredTasks(searchQuery);
  console.log('Tasks to render:', tasks);

  tasks.forEach(t => {
    const taskElement = createTaskElement(t, taskList, () =>
      render(taskList, counter, searchQuery)
    );
    taskList.appendChild(taskElement);
  });

  if (counter) {
    counter.textContent = `Всего: ${tasks.length}`;
  }
}