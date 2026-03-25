import { state } from './state.js';
import { save } from './storage.js';

export function initDrag(taskList) {
  taskList.addEventListener('dragover', (e) => {
    e.preventDefault();

    const dragging = document.querySelector('.dragging');
    const afterElement = getDragAfterElement(taskList, e.clientY);

    if (!dragging) return;

    if (afterElement == null) {
      taskList.appendChild(dragging);
    } else {
      taskList.insertBefore(dragging, afterElement);
    }
  });
}

export function applyDrag(li, taskList) {
  li.draggable = true;

  li.addEventListener('dragstart', () => {
    li.classList.add('dragging');
  });

  li.addEventListener('dragend', () => {
    li.classList.remove('dragging');

    const newOrder = [...taskList.children].map(el => +el.dataset.id);

    state.tasks = newOrder.map(id =>
      state.tasks.find(t => t.id === id)
    );

    save();
  });
}

function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll('.task:not(.dragging)')];

  return elements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;

    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    } else {
      return closest;
    }
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}