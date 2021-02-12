export default class MoveTask {
  constructor(trello) {
    this.trello = trello;
    this.addEventListeners();
  }

  createBlankElem() {
    const blankElem = document.createElement('div');
    blankElem.classList.add('blank_wrapper');
    blankElem.innerHTML = '<div class="blank"></div>';
    blankElem.style.width = `${this.ghostElem.offsetWidth}px`;
    blankElem.style.height = `${this.ghostElem.offsetHeight}px`;
    this.blankElem = blankElem;
  }

  moveBlankElem(e) {
    const elemFromPoint = document.elementFromPoint(e.clientX, e.clientY);
    if (!elemFromPoint) return;

    const closestTask = elemFromPoint.closest('.trello_task_container');
    const closestTasksHead = elemFromPoint.closest('.column_head');
    const closestCol = elemFromPoint.closest('.trello-column');
    const closestBlank = elemFromPoint.closest('.blank_wrapper');

    if (closestTask) {
      const elemHeight = closestTask.offsetHeight;
      const elemTop = closestTask.getBoundingClientRect().top;
      const yPosition = e.clientY - elemTop;

      if (yPosition < elemHeight / 2) {
        this.moveBlankElemTo(closestTask, 'up');
      } else {
        this.moveBlankElemTo(closestTask, 'down');
      }
    } else if (closestTasksHead) {
      closestTasksHead.nextElementSibling.insertAdjacentElement('afterbegin', this.blankElem);
    } else if (closestCol && !closestBlank) {
      const container = closestCol.getElementsByClassName('column_tasks')[0];
      container.appendChild(this.blankElem);
    } else if (!closestBlank) {
      this.grabbedElem.after(this.blankElem);
    }
  }

  insertTask(elem) {
    if (document.body.contains(this.blankElem)) {
      this.blankElem.replaceWith(elem);
    }

    const prevTask = elem.previousElementSibling;
    const nextTask = elem.nextElementSibling;
    if (prevTask) {
      const prevId = Number(prevTask.firstElementChild.dataset.taskId);
      this.trello.changeTaskOrder(this.taskId, prevId, 'after');
    } else if (nextTask) {
      const nextId = Number(nextTask.firstElementChild.dataset.taskId);
      this.trello.changeTaskOrder(this.taskId, nextId, 'before');
    }
  }

  moveBlankElemTo(elem, position) {
    switch (position) {
      case 'up':
        elem.insertAdjacentElement('beforebegin', this.blankElem);
        break;
      case 'down':
        elem.insertAdjacentElement('afterend', this.blankElem);
    }
  }

  stopGrabbing() {
    this.grabbedElem.classList.remove('hidden');
    this.ghostElem.remove();
    this.blankElem.remove();
    this.ghostElem = null;
    this.blankElem = null;
    document.body.classList.remove('grab');
  }

  saveMousePosition(e, task) {
    const elemTop = task.getBoundingClientRect().top;
    const elemLeft = task.getBoundingClientRect().left;
    this.x = e.clientX - elemLeft;
    this.y = e.clientY - elemTop;
  }

  moveGhostElem(e) {
    this.ghostElem.style.left = `${e.pageX - this.x}px`;
    this.ghostElem.style.top = `${e.pageY - this.y}px`;
  }

  createGhostElem(task) {
    const ghostElem = task.cloneNode(true);
    ghostElem.style.width = `${task.offsetWidth}px`;
    ghostElem.style.height = `${task.offsetHeight}px`;
    ghostElem.classList.add('grabbed');
    return ghostElem;
  }

  onMousedownHandler(e) {
    if (e.button !== 0 || e.target.classList.contains('trello_task_remove')) return;

    const task = e.target.closest('.trello_task_container');
    if (task) {
      this.saveMousePosition(e, task);
      this.grabbedElem = task;

      this.taskId = Number(task.firstElementChild.dataset.taskId);

      this.ghostElem = this.createGhostElem(task);
      document.body.appendChild(this.ghostElem);

      this.grabbedElem.classList.add('hidden');

      this.moveGhostElem(e);
      this.createBlankElem();
      this.moveBlankElem(e);
      document.body.classList.add('grab');
    }
  }

  onMouseupHandler() {
    if (!this.ghostElem) return;
    if (document.body.contains(this.blankElem)) {
      const col = this.blankElem.closest('.column_tasks');
      const category = col.id;
      this.trello.changeTaskCategory(this.taskId, category);
      this.insertTask(this.grabbedElem);
      this.stopGrabbing();
    }
  }

  onMousemoveHandler(e) {
    if (!this.ghostElem) return;
    e.preventDefault();
    this.moveGhostElem(e);
    this.moveBlankElem(e);
  }

  addEventListeners() {
    document.addEventListener('mousedown', (e) => {
      this.onMousedownHandler(e);
    });

    document.addEventListener('mousemove', (e) => {
      this.onMousemoveHandler(e);
    });

    document.addEventListener('mouseup', () => {
      this.onMouseupHandler();
    });
  }
}
