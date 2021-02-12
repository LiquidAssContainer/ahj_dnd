import LocalData from '../LocalData';

export default class TrelloData {
  constructor(data) {
    this.data = data || [];
  }

  add(task) {
    task.id = this.generateId();
    this.data.push(task);
    this.save();
  }

  get(id) {
    const task = this.data.find((elem) => elem.id === id);
    return task;
  }

  remove(id) {
    const index = this.data.findIndex((elem) => elem.id === id);
    if (index !== -1) {
      this.data.splice(index, 1);
    }
    this.save();
  }

  edit(id, newData) {
    const item = this.data.find((elem) => elem.id === id);
    if (!item) throw new Error('Объект уже не существует');
    item.text = newData.text;
    this.save();
  }

  changeCategory(id, newCategory) {
    const task = this.get(id);
    task.category = newCategory;
    this.save();
  }

  changeTaskOrder(taskId, nearTaskId, position) { // наверное, довольно костыльная функция, сделанная под конец
    const task = this.get(taskId);
    const taskIndex = this.data.findIndex((elem) => elem.id === taskId);
    this.data.splice(taskIndex, 1);
    const nearTaskIndex = this.data.findIndex((elem) => elem.id === nearTaskId);

    if (position === 'before') {
      this.data.splice(nearTaskIndex, 0, task);
    } else {
      this.data.splice(nearTaskIndex + 1, 0, task);
    }

    this.save();
  }

  generateId() {
    const lastId = this.getLastId();
    return lastId ? lastId + 1 : 1;
  }

  getLastId() {
    let lastId = 0;

    for (const task of this.data) {
      if (task.id > lastId) {
        lastId = task.id;
      }
    }
    return lastId;
  }

  save() {
    LocalData.save('trello', this.data);
  }
}
