var createTaskColumn = document.querySelector('.create-task-column');
var taskListColumn = document.querySelector('.task-list-column');
var taskListTitle = document.getElementById('taskListTitle');
var tasksList = document.querySelector('.tasks-list');
var tasksToAddList = document.querySelector('.tasks-to-add');
var createTaskButton = document.getElementById('#createTask');
var taskDescription = document.getElementById('taskDescription');
var currentTaskList = new ToDoList();

createTaskColumn.addEventListener('click', function() {
  addTask(event);
  removeTask(event);
  createTaskList();
});

function addTask(event) {
  if (event.target.id === 'createTask') {
    var newTaskId = Date.now();
    var task = new Task(newTaskId, taskDescription.value);
    currentTaskList.tasks.push(task);
    taskDescription.value = '';
    tasksToAddList.insertAdjacentHTML('beforeend', `<div id="${newTaskId}" class="task"><img class="delete-task" src="./assets/delete.svg" alt="Delete task">${task.description}</div>`);
  }
}

function removeTask() {
  if (event.target.classList.contains('delete-task')) {
    var taskId = event.target.parentNode.id;
    currentTaskList.tasks.splice(currentTaskList.tasks.indexOf({id: taskId}, 1));
    event.target.parentNode.remove();
  }
}

function createTaskList() {
  if (event.target.id === 'createTaskList') {
    currentTaskList.title = taskListTitle.value;
    currentTaskList.saveToStorage();
    addTaskListToDom();
  }
}

function addTaskListToDom() {

  var newTaskList = `<section class="task-box">
    <h3>${currentTaskList.title}</h3>
    <ul class="task-list">
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
  // for (var i = 0; i < currentTaskList.tasks.length; i++) {
  //   var listItem = `<li class="task-list-item">
  //     <input id="${currentTaskList.tasks[i].id}" type="checkbox" name="" value="">
  //     <label for="${currentTaskList.tasks[i].id}">${currentTaskList.tasks[i].description}</label>
  //   </li>`;
  // }
  taskListColumn.insertAdjacentHTML('beforeend', newTaskList);
  // console.log(tasks);
}
