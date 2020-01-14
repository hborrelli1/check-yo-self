var createTaskColumn = document.querySelector('.create-task-column');
var taskListColumn = document.querySelector('.task-list-column');
var taskListTitle = document.getElementById('taskListTitle');
var tasksList = document.querySelector('.tasks-list');
var tasksToAddList = document.querySelector('.tasks-to-add');
var searchInput = document.querySelector('.search-input');
var urgentFilterButton = document.querySelector('.urgency-button');
var createTaskButton = document.getElementById('#createTask');
var createTaskListButton = document.getElementById('createTaskList');
var clearAllButton = document.getElementById('clearAllButton');
var taskDescription = document.getElementById('taskDescription');
var listOfTodos = [];
var listOfUrgentTasks = [];
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

searchInput.addEventListener('input', searchTasks);
urgentFilterButton.addEventListener('click', toggleUrgencyFilter);

function pullSavedTaskListsFromLocalStorage() {
  var taskListsInLocalStorage = JSON.parse(window.localStorage.getItem('listOfTodos'));
  if ((taskListsInLocalStorage === null) || taskListsInLocalStorage.length === 0) {
    listOfTodos = [];
    displayNoListsInDom();
  } else {
    var toDoObjects = reassignObjectsToTaskListClass(taskListsInLocalStorage);
    listOfTodos = toDoObjects;
    populateTaskListsFromLocalStorage();
  }
}

function reassignObjectsToTaskListClass(listOfTodos) {
  var toDoObjects = listOfTodos.map(function(taskList) {
    return Object.assign(new ToDoList(), taskList);
  });
  return toDoObjects;
}

function displayNoListsInDom() {
  taskListColumn.querySelector('.no-task-lists').classList.add('active');
}

function populateTaskListsFromLocalStorage() {
  for (var i = 0; i < listOfTodos.length; i++) {
    populateCards(listOfTodos[i]);
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
  var urgentIcon = toggleUrgentIcon(taskAtHand);

  var allTasksChecked = function(task) {
    return task.checked;
  }
  var isAbleToDelete = taskAtHand.tasks.every(allTasksChecked) === true;
  isAbleToDelete === true ? isAbleToDelete = '' : isAbleToDelete = 'disabled';

  var newTaskList = `<section id="${taskAtHand.id}" class="task-box ${isUrgent}">
    <h3>${taskAtHand.title}</h3>
    <ul class="task-list">
      ${checklistHTML}
    </ul>
    <footer>
      <button class="urgent-button">
        <img src="./assets/${urgentIcon}" alt="Urgent">
        <p>Urgent</p>
      </button>
      <button class="delete-card" ${isAbleToDelete}>
        <img src="./assets/delete.svg" alt="Delete Task List">
        <p>Delete</p>
      </button>
    </footer>
  </section>`;
  taskListColumn.insertAdjacentHTML('afterbegin', newTaskList);
  currentTaskList = new ToDoList();
  resetMakeTaskList();
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
    populateCards(currentTaskList);
    validateMakeTaskListForm();
  }
}

function removeNoListsMessage() {
  taskListColumn.querySelector('.no-task-lists').classList.remove('active');
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
    var listToUpdate = listOfTodos.find(function(list) {
      return list.id == taskBoxId;
    })
    updateListUrgency(listToUpdate, clickedOnTaskList);
  }
}

function updateListUrgency(listToUpdate, clickedOnTaskList) {
  listToUpdate.updateToDo();
  updateUrgentStyling(listToUpdate, clickedOnTaskList);
  window.localStorage.setItem('listOfTodos', JSON.stringify(listOfTodos));
}

function updateUrgentStyling(listToUpdate, clickedOnTaskList) {
  listToUpdate.urgent === true ? addUrgentClass(clickedOnTaskList) : removeUrgentClass(clickedOnTaskList);
}

function addUrgentClass(task) {
  task.classList.add('js-urgent');
  task.querySelector('img').src = './assets/urgent-active.svg';
}

function removeUrgentClass(task) {
  task.classList.remove('js-urgent');
  task.querySelector('img').src = './assets/urgent.svg';
}

function markTaskComplete(event) {
  var eTarget = event.target;
  if (eTarget.classList.contains('task')) {
    var taskId = eTarget.id;
    var taskListId = eTarget.closest('.task-box').id;
    var taskListToEdit = findCurrentTask(taskListId);
    taskListToEdit.updateTask(taskId, taskListId);
    validateDeleteCardButton(event);
  }
}

function findCurrentTask(id) {
   taskListToEdit = listOfTodos.find(function(task) {
    return task.id == id;
  })
  return taskListToEdit;
}

function validateDeleteCardButton(event) {
  var eventCard = event.target.closest('.task-box');
  var cardToValidate = findCardToValidate(eventCard);
  var ableToDelete = cardToValidate.tasks.every(function(task) {
    return (task.checked == true);
  })
  setStatusOfDeleteCardButton(eventCard, ableToDelete);
}

function findCardToValidate(eventCard, cardToValidate) {
  for (var i = 0; i < listOfTodos.length; i++) {
    if (listOfTodos[i].id == eventCard.id) {
      cardToValidate = listOfTodos[i];
      return cardToValidate;
    }
  }
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
    var taskToDelete = listOfTodos.find(function(task) {
      return task.id == cardToDeleteId;
    })
    removeTaskCard(cardToDelete, taskToDelete);
  }
}

function removeTaskCard(cardToDelete, taskToDelete) {
  listOfTodos.splice(listOfTodos.indexOf(taskToDelete), 1);
  window.localStorage.setItem('listOfTodos', JSON.stringify(listOfTodos));
  cardToDelete.remove();
  if (listOfTodos.length === 0) {
    displayNoListsInDom();
  }
}

function searchTasks() {
  var searchTerm = searchInput.value.toLowerCase();
  taskListsThatMatch = determineWhatToSearch(searchTerm);
  updateTaskListsBasedOnSearch(taskListsThatMatch);
  for (var i = 0; i < taskListsThatMatch.length; i++) {
    populateCards(taskListsThatMatch[i]);
  }
}

function updateTaskListsBasedOnSearch(taskListsThatMatch) {
  var listsInColumn = taskListColumn.querySelectorAll('.task-box');
  for (var i = 0; i < listsInColumn.length; i++) {
    listsInColumn[i].remove();
  }
  toggleListMessage(taskListsThatMatch)
}

function determineWhatToSearch(searchTerm) {
  if (urgentFilterButton.classList.contains('active')) {
    var taskListsThatMatch = listOfTodos.filter(function(list) {
      return (list.title.toLowerCase().includes(searchTerm)) && (list.urgent === true);
    })
    return taskListsThatMatch;
  } else {
    var taskListsThatMatch = listOfTodos.filter(function(list) {
      return list.title.toLowerCase().includes(searchTerm);
    })
    return taskListsThatMatch;
  }
}

function toggleListMessage(taskListsThatMatch) {
  if (taskListsThatMatch.length === 0) {
    displayNoListsInDom();
  } else {
    taskListColumn.querySelector('.no-task-lists').classList.remove('active');
  }
}

function toggleUrgencyFilter(event) {
  var eTarget = event.target;
  searchInput.value = '';
  if (eTarget.classList.contains('active')) {
    eTarget.classList.remove('active');
    taskListMessage();
    populateIfNotUrgent();
  } else {
    eTarget.classList.add('active');
    urgentListMessage();
    filterUrgentCards();
  }
}

function taskListMessage() {
  taskListColumn.querySelector('.no-task-lists').innerHTML = 'No task lists to display. Use the form to the left to create a task list.';
}

function urgentListMessage() {
  taskListColumn.querySelector('.no-task-lists').innerHTML = 'No urgent tasks to display. Mark some tasks urgent to have them displayed while this filter is turned on.';
}

function filterUrgentCards() {
  listOfUrgentTasks = [];
  grabUrgentTaskLists(listOfUrgentTasks);
  updateTaskListsBasedOnSearch(listOfUrgentTasks);
  for (var i = 0; i < listOfUrgentTasks.length; i++) {
    populateCards(listOfUrgentTasks[i]);
  }
}

function grabUrgentTaskLists(listOfUrgentTasks) {
  listOfTodos.forEach(function(list) {
    if (list.urgent == true) {
      return listOfUrgentTasks.push(list);
    }
  })
}

function populateIfNotUrgent() {
  for (var i = 0; i < listOfTodos.length; i++) {
    if (listOfTodos[i].urgent != true) {
      populateCards(listOfTodos[i]);
    }
  }
  if (listOfTodos.length > 0) {
    taskListColumn.querySelector('.no-task-lists').classList.remove('active');
  }
}

function toggleUrgentIcon(card) {
  if (card.urgent === true) {
    return 'urgent-active.svg';
  } else {
    return 'urgent.svg';
  }
}
