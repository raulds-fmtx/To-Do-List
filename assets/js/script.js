const submitTaskBtn = document.querySelector('#submit-task');
const taskTitleInpt = $('#taskTitle');
const taskDateInpt = $('#taskDueDate');
const taskDescripInpt = $('#taskDescription');
const modal = $('formModal');

// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));
let taskCount = 0;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    ++taskCount;
    return `task${taskCount}`;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    let card = $('<div class="task-card card m-4"></div>').attr('id',task.id);
    let cardBody = $('<div class="card-body"></div>');
    let cardHeader = $('<div class="card-header"></div>');

    cardHeader.append($('<h5 class="card-title"></h4>').text(task.title));
    cardBody.append($('<p class="card-text"></p>').text(task.date));
    cardBody.append($('<p class="card-text"></p>').text(task.description));
    cardBody.append($('<button type="button" class="btn btn-danger delete-task"></button>').text('Delete Task'));
    
    card.append(cardHeader);
    card.append(cardBody);
    $('#todo-cards').append(card);
}

function storeTaskProperties(task) {
    let taskStr = JSON.stringify(task);

    let allTasks;
    if (localStorage.getItem('task-list') === null) {
        allTasks = [];
    } else {
        allTasks = JSON.parse(localStorage.getItem('task-list'));
    }
    allTasks.push(taskStr);
    localStorage.setItem('task-list',JSON.stringify(allTasks));
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    allTasks = JSON.parse(localStorage.getItem('task-list'));
    for (let i = 0; i < allTasks.length; ++i) {
        createTaskCard(JSON.parse(allTasks[i]));
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    let title = taskTitleInpt.val();
    let date = taskDateInpt.val();
    let description = taskDescripInpt.val();

    if (title === '' || date === '' || description === '') {
        console.log('Error: Please fill out the form.');
    } else {
        let id = generateTaskId();
        let task = {
            title: title,
            date: date,
            description: description,
            id: id
        };
        storeTaskProperties(task);
        createTaskCard(task);
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $( "#taskDueDate" ).datepicker();

    submitTaskBtn.addEventListener('click', function (event) {
        event.preventDefault();
        $('#formModal').modal('hide')
        handleAddTask(event);
    })
});
