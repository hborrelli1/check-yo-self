// Each to-do list on the page should be created as an instance of the ToDoList class.

class ToDoList {
  constructor() {
    this.id = 1;
    this.title = '';
    this.urgent = false;
    this.tasks = []; // Should be an array of objects
  }

  saveToStorage() {
    // Save task list to localStorage
  }

  deleteFromStorage() {
    // Delete task list from localStorage
  }

  updateToDo() {
    // should update the to-do’s title and urgency
  }

  updateTask() {
    // Should update a task's content and if it has been completed
  }
}
