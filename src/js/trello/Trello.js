import RenderTasks from './RenderTasks';
import TrelloData from './TrelloData';
import MoveTask from './MoveTask';
import AddTaskForm from './AddTaskForm';

export default class Trello {
  constructor(data) {
    this.trelloData = new TrelloData(data);
    this.moveTask = new MoveTask(this);
    this.addTaskForm = new AddTaskForm(this.trelloData);

    this.addEventListeners();
    RenderTasks.renderAll(this.trelloData.data);
  }

  changeTaskCategory(...args) {
    this.trelloData.changeCategory(...args);
  }

  changeTaskOrder(...args) {
    this.trelloData.changeTaskOrder(...args);
  }

  addEventListeners() {
    document.addEventListener('click', (e) => {
      const { target } = e;

      if (target.classList.contains('trello_task_remove')) {
        const task = target.closest('.trello_task');
        const id = task.dataset.taskId;
        this.trelloData.remove(Number(id));
        RenderTasks.renderAll(this.trelloData.data);
      }

      if (target.classList.contains('column_add-button')) {
        this.addTaskForm.openForm(target);
      }
    });
  }
}
