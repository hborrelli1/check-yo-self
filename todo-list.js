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
    listOfTasks.push(this);
    window.localStorage.setItem('listOfTasks', JSON.stringify(listOfTasks));

    // Remove this line once refactoring for list of array objects is complete.
    window.localStorage.setItem(this.id, JSON.stringify(this));
  }

  // deleteFromStorage(cardFromLocalStorage, listOfIdsFromLocalStorage, allTaskListIds) {
  //   // Delete task list from localStorage
  //   window.localStorage.removeItem(this.id);
  //   // Delete task from arrays of tasks
  //   listOfIdsFromLocalStorage.splice(listOfIdsFromLocalStorage.indexOf(cardFromLocalStorage.id), 1);
  //   allTaskListIds = listOfIdsFromLocalStorage;
  //   window.localStorage.setItem('savedTaskListIds', JSON.stringify(allTaskListIds));
  //   if (allTaskListIds.length === 0) {
  //     displayNoListsInDom();
  //   }
  // }

  deleteFromStorage(cardFromLocalStorage, listOfIdsFromLocalStorage, allTaskListIds) {
    // Delete task list from localStorage
    // window.localStorage.removeItem(this.id);
    listOfTasks.splice(listOfTasks.indexOf(this), 1);
    window.localStorage.setItem('listOfTasks', listOfTasks);
    allTaskListIds = listOfIdsFromLocalStorage;
    // window.localStorage.setItem('savedTaskListIds', JSON.stringify(allTaskListIds));
    if (allTaskListIds.length === 0) {
      displayNoListsInDom();
    }
  }

  updateToDo() {
    // should update the to-do’s title and urgency
    this.urgent === false ? this.urgent = true : this.urgent = false;
  }

  updateTask(taskId, taskListId) {
    // Should update a task's content and if it has been completed
    var taskToMarkChecked = this.tasks.find(task => task.id == taskId);
    taskToMarkChecked.checked === true ? taskToMarkChecked.checked = false : taskToMarkChecked.checked = true;
    window.localStorage.setItem(taskListId, JSON.stringify(this));
  }
}
