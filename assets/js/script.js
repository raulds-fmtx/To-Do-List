// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    // Get integer value of id
    let id = nextId === null ? 0 : parseInt(JSON.parse(localStorage.getItem("nextId")));
    // Increment and save value of id
    localStorage.setItem("nextId",JSON.stringify(++id));
    // Format and return id
    return `task${parseInt(id)}`;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // Create containers
    let card = $('<div class="task-card card m-4"></div>').attr('id',task.id);
    let cardBody = $('<div class="card-body"></div>');
    let cardHeader = $('<div class="card-header"></div>');
    // Generate text elements
    cardHeader.append($('<h5 class="card-title"></h4>').text(task.title));
    cardBody.append($('<p class="card-text"></p>').text(task.date));
    cardBody.append($('<p class="card-text"></p>').text(task.description));
    cardBody.append($('<button type="button" class="btn btn-danger delete-task"></button>').text('Delete Task'));
    // Construct and add card to DOM
    card.append(cardHeader);
    card.append(cardBody);
    $('#todo-cards').append(card);
}

function storeTaskProperties(task) {
    let taskStr = JSON.stringify(task);
    // Add string to taskList
    if (taskList === null) {
        let taskList = [taskStr];
    } else {
        taskList.push(taskStr);
    }
    // Store taskList
    localStorage.setItem('tasks',JSON.stringify(taskList));
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // render tasks if taskList is not null
    if (taskList != null) {
        for (let i = 0; i < taskList.length; ++i) {
            createTaskCard(JSON.parse(taskList[i]));
        }
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    // Get user input
    let title = $('#taskTitle').val();
    let date = $('#taskDueDate').val();
    let description = $('#taskDescription').val();
    // Verify form is completed
    if (title === '' || date === '' || description === '') {
        console.log('Error: Please fill out the form.');
    } else {
        // Reset form and hide modal window
        $('#taskTitle').prop('value','');
        $('#taskDueDate').prop('value','');
        $('#taskDescription').prop('value','');
        $('#formModal').modal('hide');
        // Create task
        let id = generateTaskId();
        let task = {
            title: title,
            date: date,
            description: description,
            id: id
        };
        // Store task and create card
        storeTaskProperties(task);
        createTaskCard(task);
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    // Get the task's unique id
    let taskId = $(this).closest('.task-card').attr('id');
    // Remove task from task list
    taskList.splice(taskList.findIndex((element) => JSON.parse(element).id == taskId),1);
    // Store revised task list
    localStorage.setItem('tasks',JSON.stringify(taskList));
    // Remove card
    parent.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $("#taskDueDate").datepicker();

    $('#submit-task').on('click', handleAddTask);

    $('.delete-task').on('click', handleDeleteTask);
});
