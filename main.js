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
var listOfTasks = [];
var currentTaskList = new ToDoList();

createTaskColumn.addEventListener('click', function() {
  if (taskDescription.value != "") {
    addTask(event);
  }
  removeTask(event);
  createTaskList();
  clearAllFields();
});

taskListColumn.addEventListener('click', function() {
  toggleListUrgent(event);
  markTaskComplete(event);
  deleteTaskCard(event);
  // validateDeleteCardButton(event);
})

document.addEventListener('keyup', function() {
  validateMakeTaskListForm();
  // Add clear button validation here.
});

window.addEventListener('load', function() {
  pullSavedTaskListsFromLocalStorage();

});

// function pullSavedTaskListsFromLocalStorage() {
//   var taskListsInLocalStorage = JSON.parse(window.localStorage.getItem('savedTaskListIds'));
//   if ((taskListsInLocalStorage === null) || taskListsInLocalStorage.length === 0) {
//     allTaskListIds = [];
//     displayNoListsInDom();
//   } else {
//     allTaskListIds = taskListsInLocalStorage;
//     populateTaskListsFromLocalStorage();
//   }
// }

function pullSavedTaskListsFromLocalStorage() {
  var taskListsInLocalStorage = JSON.parse(window.localStorage.getItem('listOfTasks'));
  // var toDoObjects = taskListsInLocalStorage.map(function(taskList) {
  //   return Object.assign(new ToDoList(), taskList);
  // })
  // console.log(taskListsInLocalStorage);

  if ((taskListsInLocalStorage === null) || taskListsInLocalStorage.length === 0) {
    listOfTasks = [];
    displayNoListsInDom();
  } else {
    var toDoObjects = taskListsInLocalStorage.map(function(taskList) {
      return Object.assign(new ToDoList(), taskList);
    })
    listOfTasks = toDoObjects;
    populateTaskListsFromLocalStorage();
  }
}

function displayNoListsInDom() {
  taskListColumn.querySelector('.no-task-lists').classList.add('active');
}

// function populateTaskListsFromLocalStorage() {
//   for (var i = 0; i < allTaskListIds.length; i++) {
//     var listFromLocalStorage = JSON.parse(window.localStorage.getItem(allTaskListIds[i]));
//     loadTaskListsFromLocalStorage(listFromLocalStorage);
//   }
// }

function populateTaskListsFromLocalStorage() {
  for (var i = 0; i < listOfTasks.length; i++) {
    // var listFromLocalStorage = JSON.parse(window.localStorage.getItem(listOfTasks[i]));x
    // console.log(listOfTasks[i]);
    populateCards(listOfTasks[i]);

  }
}
function populateCards(listOfTasks) {
  var checklistHTML = '';

  for (var i = 0; i < listOfTasks.tasks.length; i++) {
    var isChecked;
    listOfTasks.tasks[i].checked === true ? isChecked = 'checked' : isChecked = '';
    checklistHTML += `<li class="task-list-item">
      <input id="${listOfTasks.tasks[i].id}" type="checkbox" name="" value="" ${isChecked}>
      <label id="${listOfTasks.tasks[i].id}" class="task" for="${listOfTasks.tasks[i].id}">${listOfTasks.tasks[i].description}</label>
    </li>`;
  }

  var isUrgent = null;
  listOfTasks.urgent === true ? isUrgent = 'js-urgent' : isUrgent = '';

  var allTasksChecked = (task) => task.checked === true;
  var isAbleToDelete = listOfTasks.tasks.every(allTasksChecked) === true;
  isAbleToDelete === true ? isAbleToDelete = '' : isAbleToDelete = 'disabled';

  var newTaskList = `<section id="${listOfTasks.id}" class="task-box ${isUrgent}">
    <h3>${listOfTasks.title}</h3>
    <ul class="task-list">
      ${checklistHTML}
    </ul>
    <footer>
      <button class="urgent-button">
        <img src="./assets/urgent.svg" alt="Urgent">
        <p>Urgent</p>
      </button>
      <button class="delete-card" ${isAbleToDelete}>
        <img src="./assets/delete.svg" alt="Delete Task List">
        <p>Delete</p>
      </button>
    </footer>
  </section>`;
  taskListColumn.insertAdjacentHTML('afterbegin', newTaskList);
}

// function loadTaskListsFromLocalStorage(listFromLocalStorage) {
//   var checklistHTML = '';
//
//   for (var i = 0; i < listFromLocalStorage.tasks.length; i++) {
//     var isChecked;
//     listFromLocalStorage.tasks[i].checked === true ? isChecked = 'checked' : isChecked = '';
//     checklistHTML += `<li class="task-list-item">
//       <input id="${listFromLocalStorage.tasks[i].id}" type="checkbox" name="" value="" ${isChecked}>
//       <label id="${listFromLocalStorage.tasks[i].id}" class="task" for="${listFromLocalStorage.tasks[i].id}">${listFromLocalStorage.tasks[i].description}</label>
//     </li>`;
//   }
//
//   var isUrgent = null;
//   listFromLocalStorage.urgent === true ? isUrgent = 'js-urgent' : isUrgent = '';
//
//   var allTasksChecked = (task) => task.checked === true;
//   var isAbleToDelete = listFromLocalStorage.tasks.every(allTasksChecked) === true;
//   isAbleToDelete === true ? isAbleToDelete = '' : isAbleToDelete = 'disabled';
//
//   var newTaskList = `<section id="${listFromLocalStorage.id}" class="task-box ${isUrgent}">
//     <h3>${listFromLocalStorage.title}</h3>
//     <ul class="task-list">
//       ${checklistHTML}
//     </ul>
//     <footer>
//       <button class="urgent-button">
//         <img src="./assets/urgent.svg" alt="Urgent">
//         <p>Urgent</p>
//       </button>
//       <button class="delete-card" ${isAbleToDelete}>
//         <img src="./assets/delete.svg" alt="Delete Task List">
//         <p>Delete</p>
//       </button>
//     </footer>
//   </section>`;
//   taskListColumn.insertAdjacentHTML('afterbegin', newTaskList);
// }

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
    updateTaskIdsList();
    currentTaskList.saveToStorage();
    removeNoListsMessage();
    addTaskListToDom();
    validateMakeTaskListForm();
  }
}

function removeNoListsMessage() {
  taskListColumn.querySelector('.no-task-lists').classList.remove('active');
}

function addTaskListToDom() {
  var checklistHTML = '';

  for (var i = 0; i < currentTaskList.tasks.length; i++) {
    checklistHTML += `<li class="task-list-item">
      <input id="${currentTaskList.tasks[i].id}" type="checkbox" name="" value="">
      <label id="${currentTaskList.tasks[i].id}" class="task" for="${currentTaskList.tasks[i].id}">${currentTaskList.tasks[i].description}</label>
    </li>`;
  }

  var newTaskList = `<section id="${currentTaskList.id}" class="task-box">
    <h3>${currentTaskList.title}</h3>
    <ul class="task-list">
      ${checklistHTML}
    </ul>
    <footer>
      <button class="urgent-button">
        <img src="./assets/urgent.svg" alt="Urgent">
        <p>Urgent</p>
      </button>
      <button class="delete-card" disabled>
        <img src="./assets/delete.svg" alt="Delete Task List">
        <p>Delete</p>
      </button>
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
  // var urgentButtonTarget = event.target.classList.contains('js-urgent');
  if (event.target.classList.contains('urgent-button')) {
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
    var taskListId = eTarget.closest('.task-box').id;
    var taskToEdit = JSON.parse(window.localStorage.getItem(taskListId));
    var taskListWithMethods = Object.assign(new ToDoList(), taskToEdit);
    taskListWithMethods.updateTask(taskId, taskListId);
  }
  validateDeleteCardButton(event);
}

function validateDeleteCardButton(event) {
  var eventCard = event.target.closest('.task-box');
  var cardToValidate = JSON.parse(window.localStorage.getItem(eventCard.id));
  var allTasksChecked = (task) => task.checked === true;
  var enableDelete = cardToValidate.tasks.every(allTasksChecked) === true;
  setStatusOfDeleteCardButton(eventCard, enableDelete);
}

function setStatusOfDeleteCardButton(eventCard, enableDelete) {
  if (enableDelete === true) {
    eventCard.querySelector('.delete-card').removeAttribute('disabled');
  } else {
    eventCard.querySelector('.delete-card').setAttribute('disabled', '');
  }
}

function deleteTaskCard(event) {
  if (event.target.classList.contains('delete-card')) {
    var cardToDelete = event.target.closest('.task-box');
    var cardFromLocalStorage = JSON.parse(window.localStorage.getItem(cardToDelete.id));
    var listOfIdsFromLocalStorage = JSON.parse(window.localStorage.getItem('savedTaskListIds'));
    cardFromLocalStorage = Object.assign(new ToDoList(), cardFromLocalStorage);
    cardFromLocalStorage.deleteFromStorage(cardFromLocalStorage, listOfIdsFromLocalStorage, allTaskListIds);
    cardToDelete.remove();
  }
}

// function
