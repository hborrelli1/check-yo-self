var createTaskColumn = document.querySelector('.create-task-column');
var taskListColumn = document.querySelector('.task-list-column');
var taskListTitle = document.getElementById('taskListTitle');
var tasksList = document.querySelector('.tasks-list');
var tasksToAddList = document.querySelector('.tasks-to-add');
var createTaskButton = document.getElementById('#createTask');
var createTaskListButton = document.getElementById('createTaskList');
var clearAllButton = document.getElementById('clearAllButton');
var taskDescription = document.getElementById('taskDescription');
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
  toggleListUrgent();
})

document.addEventListener('keyup', function() {
  validateMakeTaskListForm();
  // Add clear button validation here.
});


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
    validateMakeTaskListForm();
    addTaskListToDom();
  }
}

function addTaskListToDom() {
  var checklistHTML = '';

  for (var i = 0; i < currentTaskList.tasks.length; i++) {
    checklistHTML += `<li class="task-list-item">
      <input id="${currentTaskList.tasks[i].id}" type="checkbox" name="" value="">
      <label for="${currentTaskList.tasks[i].id}">${currentTaskList.tasks[i].description}</label>
    </li>`;
  }

  var newTaskList = `<section class="task-box">
    <h3>${currentTaskList.title}</h3>
    <ul class="task-list">
      ${checklistHTML}
    </ul>
    <footer>
      <div class="urgent">
        <img src="./assets/urgent.svg" alt="Urgent">
        <p>Urgent</p>
      </div>
      <div class="delete">
        <img src="./assets/delete.svg" alt="Delete Task List">
        <p>Delete</p>
      </div>
    </footer>
  </section>`;
  taskListColumn.insertAdjacentHTML('beforeend', newTaskList);
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
  if ((taskListTitle.value != '') || (currentTaskList.tasks.length > 0)) {
    clearAllButton.removeAttribute('disabled');
  } else {
    clearAllButton.setAttribute('disabled', '');
  }
}

function clearAllFields() {
  if (event.target.id === 'clearAllButton') {
    taskListTitle.value = '';
    tasksToAddList.innerHTML = '';
    currentTaskList.tasks = [];
    validateMakeTaskListForm();
  }
}

function toggleListUrgent() {
  var urgentButtonTarget = event.target.classList.contains('urgent');
  if ((urgentButtonTarget) && (!event.target.classList.contains('js-urgent'))) {
    event.target.closest('.task-box').classList.add('js-is-urgent');
  }
}
