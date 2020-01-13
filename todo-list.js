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
    // Delete task from arrays of tasks
  }

  updateToDo() {
    // should update the to-do’s title and urgency
    this.urgent === false ? this.urgent = true : this.urgent = false;
  }

  updateTask(taskId, taskListId) {
    // Should update a task's content and if it has been completed
    var taskToMarkChecked = this.tasks.find(task => task.id == taskId);
    // console.log(taskToMarkChecked);
    taskToMarkChecked.checked === true ? taskToMarkChecked.checked = false : taskToMarkChecked.checked = true;
    // console.log(taskToMarkChecked);
    // console.log(taskToEdit);
    window.localStorage.setItem(taskListId, JSON.stringify(this));
  }
}
