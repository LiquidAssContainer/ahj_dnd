import RenderTasks from './RenderTasks';

export default class AddTaskForm {
  constructor(data) {
    this.data = data;
    this.form = this.getForm();
    this.textarea = this.form.getElementsByClassName('trello_form_textarea')[0];
    this.category = null;

    this.addEventListeners();
  }

  openForm(btn) {
    const hiddenBtn = document.querySelector('.column_add-button.hidden');
    if (hiddenBtn) {
      hiddenBtn.classList.remove('hidden');
    }
    btn.classList.add('hidden');
    btn.after(this.form);
    this.form.reset();
    this.category = btn.dataset.category;
  }

  getForm() {
    const form = document.createElement('form');
    form.className = 'trello_form';
    form.innerHTML = `
      <textarea class="trello_form_textarea"></textarea>
      <button class="trello_add-task" type="submit">Add Card</button>
      <button class="trello_close-form" type="button">Cancel</button>
    `;
    return form;
  }

  closeForm() {
    const btn = this.form.previousElementSibling;
    btn.classList.remove('hidden');

    this.form.reset();
    this.form.remove();
  }

  checkTextareaValidity() {
    return !this.textarea.value.match(/^(\s)*$/g);
  }

  addEventListeners() {
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.checkTextareaValidity()) {
        const task = { text: this.textarea.value, category: this.category };
        this.data.add(task);
        RenderTasks.renderAll(this.data.data);
        this.closeForm();
      }
    });

    this.form.addEventListener('click', (e) => {
      if (e.target.classList.contains('trello_close-form')) {
        this.closeForm();
      }
    });
  }
}
