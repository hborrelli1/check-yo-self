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

  }

  deleteFromStorage(cardFromLocalStorage, listOfIdsFromLocalStorage, allTaskListIds) {
    // Delete task list from localStorage
    // window.localStorage.removeItem(this.id);
    listOfTasks.splice(listOfTasks.indexOf(this), 1);
    window.localStorage.setItem('listOfTasks', listOfTasks);
    // allTaskListIds = listOfIdsFromLocalStorage;
    // window.localStorage.setItem('savedTaskListIds', JSON.stringify(allTaskListIds));
    console.log(listOfTasks.length);
    // if (listOfTasks.length === 0) {
    //   displayNoListsInDom();
    // }
  }

  updateToDo() {
    // should update the to-do’s title and urgency
    this.urgent = !this.urgent;
  }

  updateTask(taskId, taskListId) {
    // Should update a task's content and if it has been completed
    // console.log(this);
    // var taskToMarkChecked = this.tasks.filter(function(task) {
    //    return task.id == taskId;
    // });
    for (var i = 0; i < this.tasks.length; i++) {
      if (this.tasks[i].id == taskId) {
        this.tasks[i].checked = !this.tasks[i].checked;
      }
    }
    // console.log(taskToMarkChecked);
    // console.log(taskToMarkChecked.checked === true);
    // taskToMarkChecked.checked = !taskToMarkChecked.checked;
    // console.log(taskToMarkChecked.checked === true);
    window.localStorage.setItem('listOfTasks', JSON.stringify(listOfTasks));

    // window.localStorage.setItem(taskListId, JSON.stringify(this));
  }
}
