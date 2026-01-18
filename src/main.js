import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";

// DOM elements
const todoForm = document.getElementById("todoForm")
const inputFormTitle = document.getElementById('inputFormTitle');
const inputFormDesc = document.getElementById('inputFormDesc');

let todoItemList = JSON.parse(localStorage.getItem('Todos'))||[]

//save to localstorage
function SaveData(data) {
    localStorage.setItem('Todos',JSON.stringify(data));
}

// add todo functionality
function submitTodoItem(e) {
    e.preventDefault();

    // validation
     if (!todoForm.checkValidity()) {
      e.stopPropagation();
      todoForm.classList.add('was-validated');
      return;
    }

    let title = inputFormTitle.value.trim();
    let desc = inputFormDesc.value.trim();

    let newTodoItem = {
        id:Date.now(),
        title,
        description:desc,
        isComplete:false
    };

    todoItemList.push(newTodoItem)
    console.log('Todo Added:', todoItemList);
    SaveData(todoItemList);

    todoForm.reset();
    todoForm.classList.remove('was-validated');

    console.log('Todo added successfully!');
}

function ResetForm(e) {
    e.preventDefault();
    todoForm.reset()
    todoForm.classList.remove('was-validated');
    inputFormTitle.value='';
    inputFormDesc.value='';
}

todoForm.addEventListener('submit',submitTodoItem);
todoForm.addEventListener('reset',ResetForm);