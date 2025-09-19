let taskCreatorbtns = document.querySelectorAll(".taksCreator");
let ToDoList = document.querySelector("#toDoTasksList");
let WorkingList = document.querySelector("#WorkingTasksList");
let tasks = document.querySelectorAll(".task")


// creating new Task
taskCreatorbtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        let newTask = document.querySelector(".taskTemplate").cloneNode(true);
        newTask.style.display = "block";
        newTask.classList.remove("taskTemplate");
        document.querySelector("#toDoTasksList").prepend(newTask);

        // Cleaning previous Data
        let input = newTask.querySelector(".task input");
        let textarea = newTask.querySelector(".task textarea")
        input.value = "";
        textarea.value = "";
        input.focus();

    });
});



// Deleting Task
document.addEventListener("click", (e) => {
    if (e.target.matches(".dltTrash")) {
        const taskToDlt = e.target.closest(".task");
        taskToDlt.remove();
    }
});

// Drag and drop functionality
let draggingTask = null;
document.addEventListener("dragstart", e => {
    let draggingItem = e.target;
    if (draggingItem.classList.contains("task")) {
        draggingTask = draggingItem;
    }
})

document.querySelectorAll(".tasksList").forEach((list) => {
    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        list.closest(".colm").classList.add("dragover");
    });

    list.addEventListener("dragleave", () => {
        list.closest(".colm").classList.remove("dragover");
    });

    list.addEventListener("drop", (e) => {
        setTimeout(() => {
            list.closest(".colm").classList.remove("dragover");
        }, 100);
        e.preventDefault();
        if (draggingTask) {
            list.prepend(draggingTask);
            if (list.id == "toDoTasksList") draggingTask.querySelector("b").innerText = "To-Do";
            if (list.id == "WorkingTasksList") draggingTask.querySelector("b").innerText = "Working";
            if (list.id == "DoneTasksList") draggingTask.querySelector("b").innerText = "Done";
            saveTask();
            draggingTask = null;
        }
    });
})


// Saving Tasks to the LocalStorage
function saveTask() {
    let allTasks = [];
    document.querySelectorAll(".task").forEach(task => {
        if (task.classList.contains("taskTemplate")) return;
        let taskTitle = task.querySelector('input').value;
        let taskstatus = task.querySelector('b').innerText;
        let taskDesc = task.querySelector('textarea').value;
        allTasks.push({ taskTitle, taskstatus, taskDesc });
    })
    localStorage.setItem("tasks", JSON.stringify(allTasks));
}

// Instantly saving input and textArea text changing
document.addEventListener("input", (e) => {
    if (e.target.tagName == "INPUT" || e.target.tagName == "TEXTAREA") {
        saveTask();
    }
    
})


// Reload tasks from localStorage
let loadTasks = () => {
    let getLocalTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    getLocalTasks.forEach(localTask => {
        let newTask = document.querySelector(".taskTemplate").cloneNode(true);
        newTask.style.display = "block";
        newTask.classList.remove("taskTemplate");

        newTask.querySelector("input").value = localTask.taskTitle;
        newTask.querySelector('b').innerText = localTask.taskstatus;
        newTask.querySelector('textarea').value = localTask.taskDesc;
        if (localTask.taskstatus == "To-Do") document.querySelector("#toDoTasksList").prepend(newTask);
        if (localTask.taskstatus == "Working") document.querySelector("#WorkingTasksList").prepend(newTask);
        if (localTask.taskstatus == "Done") document.querySelector("#DoneTasksList").prepend(newTask);
    })

}
loadTasks();