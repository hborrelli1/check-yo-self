var createTaskColumn = document.querySelector('.create-task-column');
var taskListColumn = document.querySelector('.task-list-column');
var taskListTitle = document.getElementById('taskListTitle');
var tasksList = document.querySelector('.tasks-list');
var tasksToAddList = document.querySelector('.tasks-to-add');
var createTaskButton = document.getElementById('#createTask');
var createTaskListButton = document.getElementById('createTaskList');
var clearAllButton = document.getElementById('clearAllButton');
var taskDescription = document.getElementById('taskDescription');
var allTaskListIds = [];
var currentTaskList = new ToDoList();

createTaskColumn.addEventListener('click', function() {
  if (taskDescription.value != "") {
    addTask(event);
  }
  removeTask(event);
  createTaskList();
  clearAllFields()
});

taskListColumn.addEventListener('click', function() {
  toggleListUrgent(event);
  markTaskComplete(event);
})

document.addEventListener('keyup', function() {
  validateMakeTaskListForm();
  // Add clear button validation here.
});

window.addEventListener('load', function() {
  pullSavedTaskListsFromLocalStorage();

});

function pullSavedTaskListsFromLocalStorage() {
  var taskListsInLocalStorage = JSON.parse(window.localStorage.getItem('savedTaskListIds'));
  if (taskListsInLocalStorage === null) {
    allTaskListIds = [];
    displayNoListsInDom();
  } else {
    allTaskListIds = taskListsInLocalStorage;
    populateTaskListsFromLocalStorage();
  }
}

function displayNoListsInDom() {
  taskListColumn.innerHTML = `<p class="no-task-lists">No task lists to display. Use the form to the left to create a task list.</p>`
}

function populateTaskListsFromLocalStorage() {
  for (var i = 0; i < allTaskListIds.length; i++) {
    var listFromLocalStorage = JSON.parse(window.localStorage.getItem(allTaskListIds[i]));
    loadTaskListsFromLocalStorage(listFromLocalStorage);
  }
}

function loadTaskListsFromLocalStorage(listFromLocalStorage) {
  var checklistHTML = '';

  for (var i = 0; i < listFromLocalStorage.tasks.length; i++) {
    checklistHTML += `<li class="task-list-item">
      <input class="task" id="${listFromLocalStorage.tasks[i].id}" type="checkbox" name="" value="">
      <label class="task" for="${listFromLocalStorage.tasks[i].id}">${listFromLocalStorage.tasks[i].description}</label>
    </li>`;
  }

  var isUrgent = null;
  listFromLocalStorage.urgent === true ? isUrgent = 'js-urgent' : isUrgent = '';

  var newTaskList = `<section id="${listFromLocalStorage.id}" class="task-box ${isUrgent}">
    <h3>${listFromLocalStorage.title}</h3>
    <ul class="task-list">
      ${checklistHTML}
    </ul>
    <footer>
      <div class="js-urgent">
        <img src="./assets/urgent.svg" alt="Urgent">
        <p>Urgent</p>
      </div>
      <div class="delete">
        <img src="./assets/delete.svg" alt="Delete Task List">
        <p>Delete</p>
      </div>
    </footer>
  </section>`;
  taskListColumn.insertAdjacentHTML('afterbegin', newTaskList);
}

function addTask(event) {
  if (event.target.id === 'createTask') {
    var newTaskId = Date.now();
    var task = new Task(newTaskId, taskDescription.value);
    currentTaskList.tasks.push(task);
    taskDescription.value = '';
    tasksToAddList.insertAdjacentHTML('beforeend', `<div id="${newTaskId}" class="task"><img class="delete-task" src="./assets/delete.svg" alt="Delete task">${task.description}</div>`);
    validateMakeTaskListForm();
  }
}

function removeTask() {
  if (event.target.classList.contains('delete-task')) {
    var taskId = event.target.parentNode.id;
    currentTaskList.tasks.splice(currentTaskList.tasks.indexOf({id: taskId}, 1));
    event.target.parentNode.remove();
    validateMakeTaskListForm();
  }
}

function createTaskList() {
  if (event.target.id === 'createTaskList') {
    currentTaskList.title = taskListTitle.value;
    // allTaskListIds.push(currentTaskList.id);
    updateTaskIdsList();
    currentTaskList.saveToStorage();
    validateMakeTaskListForm();
    removeNoListsMessage();
    addTaskListToDom();
  }
}

function removeNoListsMessage() {
  taskListColumn.innerHTML = '';
}

function addTaskListToDom() {
  var checklistHTML = '';

  for (var i = 0; i < currentTaskList.tasks.length; i++) {
    checklistHTML += `<li class="task-list-item">
      <input class="task" id="${currentTaskList.tasks[i].id}" type="checkbox" name="" value="">
      <label class="task" for="${currentTaskList.tasks[i].id}">${currentTaskList.tasks[i].description}</label>
    </li>`;
  }

  var newTaskList = `<section id="${currentTaskList.id}" class="task-box">
    <h3>${currentTaskList.title}</h3>
    <ul class="task-list">
      ${checklistHTML}
    </ul>
    <footer>
      <div class="js-urgent">
        <img src="./assets/urgent.svg" alt="Urgent">
        <p>Urgent</p>
      </div>
      <div class="delete">
        <img src="./assets/delete.svg" alt="Delete Task List">
        <p>Delete</p>
      </div>
    </footer>
  </section>`;
  taskListColumn.insertAdjacentHTML('afterbegin', newTaskList);
  currentTaskList = new ToDoList();
  resetMakeTaskList();
}

function resetMakeTaskList() {
  taskListTitle.value = '';
  tasksToAddList.innerHTML = '';
}

function validateMakeTaskListForm() {
  validateMakeTaskListButton();
  validateClearAllButton();
}

function validateMakeTaskListButton() {
  if ((taskListTitle.value != '') && (currentTaskList.tasks.length > 0)) {
    createTaskListButton.removeAttribute('disabled');
  } else {
    createTaskListButton.setAttribute('disabled', '');
  }
}

function validateClearAllButton() {
  if ((taskListTitle.value != '') || (taskDescription.value != '') || (currentTaskList.tasks.length > 0)) {
    clearAllButton.removeAttribute('disabled');
  } else {
    clearAllButton.setAttribute('disabled', '');
  }
}

function clearAllFields() {
  if (event.target.id === 'clearAllButton') {
    taskListTitle.value = '';
    tasksToAddList.innerHTML = '';
    taskDescription.value = '';
    currentTaskList.tasks = [];
    validateMakeTaskListForm();
  }
}

function toggleListUrgent(event) {
  var urgentButtonTarget = event.target.classList.contains('js-urgent');
  if (urgentButtonTarget) {
    // event.target.closest('.task-box').classList.add('js-urgent');
    var clickedOnTaskList = event.target.closest('.task-box');
    var taskBoxId = clickedOnTaskList.id;
    var listToUpdate = pullListFromLocalStorage(taskBoxId);
    updateListUrgency(listToUpdate, clickedOnTaskList);

  }
}

function pullListFromLocalStorage(taskBoxId) {
  return JSON.parse(window.localStorage.getItem(taskBoxId));
}

function updateListUrgency(listToUpdate, clickedOnTaskList) {
  // Object assign to re-add methods
  var listInstance = new ToDoList();
  listInstance = Object.assign(listInstance, listToUpdate);

  // Update Urgency
  listInstance.updateToDo();

  // Update Dom for urgent styling
  updateUrgentStyling(listInstance, clickedOnTaskList);

  // Push back to
  listInstance.saveToStorage();
}

function updateTaskIdsList() {
  allTaskListIds.push(currentTaskList.id);
  window.localStorage.setItem('savedTaskListIds', JSON.stringify(allTaskListIds));
}

function updateUrgentStyling(listInstance, clickedOnTaskList) {
  listInstance.urgent === true ? clickedOnTaskList.classList.add('js-urgent') : clickedOnTaskList.classList.remove('js-urgent');
}

function markTaskComplete(event) {
  var eTarget = event.target;
  if (eTarget.classList.contains('task')) {
    var taskId = eTarget.id;
    console.log(taskId);
  }
}
