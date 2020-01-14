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
})

document.addEventListener('keyup', function() {
  validateMakeTaskListForm();
});

window.addEventListener('load', function() {
  pullSavedTaskListsFromLocalStorage();
});

function pullSavedTaskListsFromLocalStorage() {
  var taskListsInLocalStorage = JSON.parse(window.localStorage.getItem('listOfTasks'));
  if ((taskListsInLocalStorage === null) || taskListsInLocalStorage.length === 0) {
    listOfTasks = [];
    displayNoListsInDom();
  } else {
    var toDoObjects = taskListsInLocalStorage.map(function(taskList) {
      return Object.assign(new ToDoList(), taskList);
    });
    listOfTasks = toDoObjects;
    populateTaskListsFromLocalStorage();
  }
}

function displayNoListsInDom() {
  taskListColumn.querySelector('.no-task-lists').classList.add('active');
}

function populateTaskListsFromLocalStorage() {
  for (var i = 0; i < listOfTasks.length; i++) {
    populateCards(listOfTasks[i]);
  }
}

function populateCards(taskAtHand) {
  var checklistHTML = '';
  for (var i = 0; i < taskAtHand.tasks.length; i++) {
    var isChecked;
    taskAtHand.tasks[i].checked === true ? isChecked = 'checked' : isChecked = '';
    checklistHTML += `<li class="task-list-item">
      <input id="${taskAtHand.tasks[i].id}" type="checkbox" name="" value="" ${isChecked}>
      <label id="${taskAtHand.tasks[i].id}" class="task" for="${taskAtHand.tasks[i].id}">${taskAtHand.tasks[i].description}</label>
    </li>`;
  }

  var isUrgent = null;
  taskAtHand.urgent === true ? isUrgent = 'js-urgent' : isUrgent = '';

  var allTasksChecked = (task) => task.checked === true;
  var isAbleToDelete = taskAtHand.tasks.every(allTasksChecked) === true;
  isAbleToDelete === true ? isAbleToDelete = '' : isAbleToDelete = 'disabled';

  var newTaskList = `<section id="${taskAtHand.id}" class="task-box ${isUrgent}">
    <h3>${taskAtHand.title}</h3>
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
  if (event.target.classList.contains('urgent-button')) {
    var clickedOnTaskList = event.target.closest('.task-box');
    var taskBoxId = clickedOnTaskList.id;
    var listToUpdate = listOfTasks.find(function(list) {
      return list.id == taskBoxId;
    })
    updateListUrgency(listToUpdate, clickedOnTaskList);
  }
}

function updateListUrgency(listToUpdate, clickedOnTaskList) {
  listToUpdate.updateToDo();
  updateUrgentStyling(listToUpdate, clickedOnTaskList);
  window.localStorage.setItem('listOfTasks', JSON.stringify(listOfTasks));
}

function updateUrgentStyling(listToUpdate, clickedOnTaskList) {
  listToUpdate.urgent === true ? clickedOnTaskList.classList.add('js-urgent') : clickedOnTaskList.classList.remove('js-urgent');
}

function markTaskComplete(event) {
  var eTarget = event.target;
  if (eTarget.classList.contains('task')) {
    var taskId = eTarget.id;
    var taskListId = eTarget.closest('.task-box').id;
    var taskListToEdit = listOfTasks.find(function(task) {
      return task.id == taskListId;
    })
    taskListToEdit.updateTask(taskId, taskListId);
  }
  validateDeleteCardButton(event);
}

function validateDeleteCardButton(event) {
  var eventCard = event.target.closest('.task-box');
  var cardToValidate;
  for (var i = 0; i < listOfTasks.length; i++) {
    if (listOfTasks[i].id == eventCard.id) {
      cardToValidate = listOfTasks[i];
    }
  }
  // var ableToDelete = true;
  // for (var i = 0; i < cardToValidate.tasks.length; i++) {
  //   if (cardToValidate.tasks[i].checked === false) {
  //     ableToDelete = false;
  //   } else {
  //     ableToDelete = true;
  //   }
  // }
  var ableToDelete = cardToValidate.tasks.every(function(task) {
    return (task.checked == true);
  })
  // console.log(ableToDelete);
  setStatusOfDeleteCardButton(eventCard, ableToDelete);
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
    var cardToDeleteId = cardToDelete.id;
    var taskToDelete = listOfTasks.find(function(task) {
      return task.id == cardToDeleteId;
    })
    listOfTasks.splice(listOfTasks.indexOf(taskToDelete), 1);
    window.localStorage.setItem('listOfTasks', JSON.stringify(listOfTasks));
    cardToDelete.remove();
    if (listOfTasks.length === 0) {
      displayNoListsInDom();
    }
  }
}
