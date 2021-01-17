export default class LocalData {
  static load(name) {
    const data = localStorage.getItem(name);
    return data ? JSON.parse(data) : null;
  }

  static save(name, data) {
    const json = JSON.stringify(data);
    localStorage.setItem(name, json);
  }

  static delete(name) {
    localStorage.removeItem(name);
  }
}
