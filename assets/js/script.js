// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    // Get integer value of id
    nextId = nextId === null ? 0 : parseInt(JSON.parse(localStorage.getItem("nextId")));
    // Increment and save value of id
    localStorage.setItem("nextId",JSON.stringify(++nextId));
    // Format and return id
    return `task${nextId}`;
}

function evaluateTaskDeadline(taskCard,parentId) {
    // Get difference between due date and todays date
    let dueDate = dayjs(taskCard.children()[1].children[0].textContent);
    let today = dayjs();
    let diff = dueDate.diff(today,'days');
    let button = $(taskCard.children()[2].children[0]);
    // Make background conditional upon the difference
    if (parentId === 'done-cards') {
        taskCard.removeClass('bg-warning bg-light bg-danger');
        taskCard.addClass('bg-success text-white');
        button.removeClass('border-white');
    } else if (diff === 0 && parentId !== 'done-cards') {
        taskCard.removeClass('bg-success text-white');
        taskCard.addClass('bg-warning');
    } else if (diff > 0 && parentId !== 'done-cards') {
        taskCard.removeClass('bg-success text-white');
        taskCard.addClass('bg-light');
    } else {
        taskCard.removeClass('bg-success');
        taskCard.addClass('bg-danger text-white');
        button.addClass('border-white');
    }
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    // Create containers
    let card = $('<div class="task-card card"></div>').attr('id',task.id);
    let cardBody = $('<div class="card-body"></div>');
    let cardHeader = $('<div class="card-header"></div>');
    let cardFooter = $('<div class="card-footer"></div>')
    // Generate text elements
    cardHeader.append($('<h5 class="card-title"></h4>').text(task.title));
    cardBody.append($('<p class="card-text due-date"></p>').text(task.date));
    cardBody.append($('<p class="card-text"></p>').text(task.description));
    cardFooter.append($('<button type="button" class="btn btn-danger delete-task"></button>').text('Delete Task'));
    // Construct and add card to DOM
    card.append(cardHeader);
    card.append(cardBody);
    card.append(cardFooter);
    card.addClass(task.parentId);
    // Set background color
    evaluateTaskDeadline($(card),task.parentId);
    $(`#${task.parentId}`).append(card);
}

function storeTaskProperties(task) {
    let taskStr = JSON.stringify(task);
    // Add string to taskList
    if (taskList === null) {
        taskList = [taskStr];
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
            id: id,
            parentId: 'todo-cards'
        };
        // Store task and create card
        storeTaskProperties(task);
        createTaskCard(task);
    }
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    // Get the task's unique id
    let parent = $(this).closest('.task-card')
    let taskId = parent.attr('id');
    // Remove task from task list
    taskList.splice(taskList.findIndex((element) => JSON.parse(element).id == taskId),1);
    // Store revised task list
    localStorage.setItem('tasks',JSON.stringify(taskList));
    // Remove card
    parent.remove();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event,ui) {
    // Get the received task card information
    let taskIndex = taskList.findIndex((element) => JSON.parse(element).id == ui.item.attr('id'));
    let task = JSON.parse(taskList[taskIndex]);
    // Change location of task card
    task.parentId = $(this).attr('id');
    // Store location of task card
    taskList[taskIndex] = JSON.stringify(task);
    localStorage.setItem('tasks',JSON.stringify(taskList));
    // Change background color
    evaluateTaskDeadline(ui.item,task.parentId);
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    // Enable Date Picker
    $("#taskDueDate").datepicker({
        changeMonth: true,
        changeYear: true
    });
    // Render stored tasks
    renderTaskList();
    // Add click event listener for task submission
    $('#submit-task').on('click', handleAddTask);
    // Delegate event lister for task deletion
    $(document).on('click', '.delete-task', handleDeleteTask);
    // Enable sortable card containers
    $('#todo-cards').sortable({
        revert: 'invalid',
        connectWith: '#in-progress-cards,#done-cards',
        receive: handleDrop
    });
    $('#in-progress-cards').sortable({
        revert: 'invalid',
        connectWith: '#todo-cards,#done-cards',
        receive: handleDrop
    });
    $('#done-cards').sortable({
        revert: 'invalid',
        connectWith: '#todo-cards,#in-progress-cards',
        receive: handleDrop
    });
});