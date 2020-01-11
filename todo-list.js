// Each to-do list on the page should be created as an instance of the ToDoList class.

class ToDoList {
  constructor() {
    this.id = Date.now();
    this.title = null;
    this.urgent = false;
    this.tasks = []; // Should be an array of objects
  }

  saveToStorage() {
    // Save task list to localStorage
    window.localStorage.setItem(this.id, JSON.stringify(this));
  }

  deleteFromStorage() {
    // Delete task list from localStorage
  }

  updateToDo() {
    // should update the to-do’s title and urgency
    // if (this.urgent === false) {
    //   this.urgent = true;
    // } else {
    //   this.urgent = false;
    // }
    this.urgent === false ? this.urgent = true : this.urgent = false
  }

  updateTask() {
    // Should update a task's content and if it has been completed
  }
}
