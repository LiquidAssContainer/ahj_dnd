export default class RenderTasks {
  static renderAll(data) {
    const todo = document.getElementById('todo');
    const inProgress = document.getElementById('in-progress');
    const done = document.getElementById('done');

    for (const col of [todo, inProgress, done]) {
      col.innerHTML = '';
    }

    for (const task of data) {
      const taskElem = this.renderTask(task);

      switch (task.category) {
        case 'todo':
          todo.insertAdjacentHTML('beforeend', taskElem);
          break;
        case 'in-progress':
          inProgress.insertAdjacentHTML('beforeend', taskElem);
          break;
        case 'done':
          done.insertAdjacentHTML('beforeend', taskElem);
      }
    }
  }

  static renderTask(task) {
    return `
    <div class="trello_task_container">
      <div class="trello_task" data-task-id="${task.id}">
        <button class="trello_task_remove">×</button>
        <p>${task.text}</p>
      </div>
    </div>
    `;
  }
}
