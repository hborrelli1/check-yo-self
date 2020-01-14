class ToDoList {
  constructor() {
    this.id = Date.now();
    this.title = null;
    this.urgent = false;
    this.tasks = [];
  }

  saveToStorage() {
    listOfTodos.push(this);
    window.localStorage.setItem('listOfTodos', JSON.stringify(listOfTodos));

  }

  deleteFromStorage(cardFromLocalStorage, listOfIdsFromLocalStorage, allTaskListIds) {
    listOfTodos.splice(listOfTodos.indexOf(this), 1);
    window.localStorage.setItem('listOfTodos', listOfTodos);
  }

  updateToDo() {
    this.urgent = !this.urgent;
  }

  updateTask(taskId, taskListId) {
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == taskId) {
        this.tasks[i].checked = !this.tasks[i].checked;
      }
    }
    window.localStorage.setItem('listOfTodos', JSON.stringify(listOfTodos));
  }
}
