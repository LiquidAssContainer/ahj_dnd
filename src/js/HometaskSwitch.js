export default class HometaskSwitch {
  constructor(id) {
    if (id) {
      this.switchTaskManually(id);
    }
    this.addEventListeners();
  }

  addEventListeners() {
    const tasks = document.getElementsByClassName('hometask');
    tasks.forEach((task) => {
      task.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchTask(e.target);
      });
    });
  }

  switchTask(target) {
    const activeTask = document.getElementsByClassName('hometask_active')[0];
    if (target === activeTask) {
      return;
    }

    if (activeTask) {
      const activeSection = document.querySelector(`[data-switch-section="${activeTask.dataset.switchLink}"]`);
      activeSection?.classList.add('hidden');
      activeTask.classList.remove('hometask_active');
    }

    const newActiveSection = document.querySelector(`[data-switch-section="${target.dataset.switchLink}"]`);
    newActiveSection?.classList.remove('hidden');
    target.classList.add('hometask_active');
  }

  switchTaskManually(id) {
    const target = document.querySelector(`[data-switch-link="${id}"]`);
    if (!target) {
      throw new Error('Нет элемента с таким id');
    }
    this.switchTask(target);
  }
}
