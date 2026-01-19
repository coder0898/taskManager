import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
import { Modal } from "bootstrap";

// DOM elements
const todoForm = document.getElementById("todoForm")
const inputFormTitle = document.getElementById('inputFormTitle');
const inputFormDesc = document.getElementById('inputFormDesc');
const todoList = document.getElementById('todoList');

const deleteTodoBtn = document.getElementById('deleteTodoBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const cancelEditBtn= document.getElementById('cancelEditBtn');
  
const Year = document.getElementById('year');


let todoItemList = JSON.parse(localStorage.getItem('Todos'))||[];
let editingTodoId=null;
let viewingTodoId = null;


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

    if (editingTodoId !== null) {
    todoItemList = todoItemList.map(todo =>
      todo.id === editingTodoId
        ? { ...todo, title, description: desc }
        : todo
    );
  } else {

    let newTodoItem = {
        id:Date.now(),
        title,
        description:desc,
        isComplete:false
    };

    todoItemList.push(newTodoItem)
  }
    SaveData(todoItemList);
    todoForm.querySelector('button[type="submit"]').textContent = 'Add Todo';
    todoForm.querySelector('button[type="button"]').classList.add('d-none');
  todoForm.querySelector('button[type="reset"]').classList.remove('d-none');

    todoForm.reset();
    todoForm.classList.remove('was-validated');

    console.log('Todo added successfully!');
    DisplayTodoItems();
}

function ResetForm(e) {
    e.preventDefault();
    todoForm.reset()
    todoForm.classList.remove('was-validated');
    inputFormTitle.value='';
    inputFormDesc.value='';
}


// Generic helper to create elements
function CreateElementWithAttribute(tag, options = {}) {
  const el = document.createElement(tag);

  if (options.className) el.className = options.className;
  if (options.innerHTML) el.innerHTML = options.innerHTML;
  if (options.textContent) el.textContent = options.textContent;

  if (options.attributes) {
    for (const [attr, value] of Object.entries(options.attributes)) {
      el.setAttribute(attr, value);
    }
  }

  return el;
}

// Function to create "No Todo Items" message
function NoTodoItem() {
  const noTodoDiv = CreateElementWithAttribute('div', { className: 'container d-flex justify-content-center align-items-center py-5' });
  const innerDiv = CreateElementWithAttribute('div', { className: 'text-center' });

  // SVG icon
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.setAttribute('width', '100');
  svg.setAttribute('height', '100');
  svg.setAttribute('fill', 'currentColor');
  svg.setAttribute('class', 'bi bi-card-list text-secondary mb-4');
  svg.setAttribute('viewBox', '0 0 16 16');
  svg.innerHTML = `
    <path d="M14 3H2v1h12V3zm0 2H2v1h12V5zm0 2H2v1h12V7zm0 2H2v1h12v-1z"/>
    <circle cx="1.5" cy="3.5" r=".5"/>
    <circle cx="1.5" cy="5.5" r=".5"/>
    <circle cx="1.5" cy="7.5" r=".5"/>
    <circle cx="1.5" cy="9.5" r=".5"/>
  `;
  innerDiv.appendChild(svg);

  const heading = CreateElementWithAttribute('h3', { className: 'mb-3 text-secondary', textContent: 'No Todo Items Yet' });
  const desc = CreateElementWithAttribute('p', { className: 'mb-4 text-muted', textContent: "You haven't added any todos." });

  innerDiv.appendChild(heading);
  innerDiv.appendChild(desc);
  noTodoDiv.appendChild(innerDiv);

  return noTodoDiv;
}

// Function to create a todo list item
function CreateListItem(data) {
  const { id, title, description, isComplete } = data;

  const li = CreateElementWithAttribute('li', {
    className: 'list-group-item d-flex align-items-center justify-content-between'
  });

  // LEFT: checkbox + title
  const leftDiv = CreateElementWithAttribute('div', { className: 'd-flex align-items-center' });

  const checkbox = CreateElementWithAttribute('input', {
    className: 'form-check-input me-3',
    attributes: { type: 'checkbox' }
  });
  checkbox.checked = isComplete;

  // Store todo id in dataset
  checkbox.dataset.id = id;

  // Add change listener (optional)
  checkbox.addEventListener('change', ToggleTodoItem);

  const titleSpan = CreateElementWithAttribute('span', { className: 'fw-medium', textContent: title });
  if (isComplete===true) titleSpan.classList.add('text-decoration-line-through', 'text-muted');

  leftDiv.appendChild(checkbox);
  leftDiv.appendChild(titleSpan);
  li.appendChild(leftDiv);

  // RIGHT: View/Edit buttons
  const rightDiv = CreateElementWithAttribute('div', { className: 'd-flex' });

  const viewBtn = CreateElementWithAttribute('button', {
    className: 'btn btn-sm btn-outline-primary me-2',
    innerHTML: '<i class="fa-solid fa-eye"></i>'
  });
  viewBtn.dataset.id = id;
  if (viewBtn) {
    viewBtn.addEventListener('click', (e) =>{
      const id = Number(e.currentTarget.dataset.id);
      OpenViewModal(id);
    } );
  }


  const editBtn = CreateElementWithAttribute('button', {
    className: 'btn btn-sm btn-outline-warning',
    innerHTML: '<i class="fa-solid fa-pen-to-square"></i>'
  });
  editBtn.dataset.id = id;
  if (editBtn) {
    editBtn.addEventListener('click',(e)=>{
      const id = Number(e.currentTarget.dataset.id);
      LoadTodoForEdit(id);
    })
  }

  // edit
  function LoadTodoForEdit(id) {
  const todo = todoItemList.find(t => t.id === id);
  if (!todo) return;

  inputFormTitle.value = todo.title;
  inputFormDesc.value = todo.description;

  editingTodoId = id;
  todoForm.querySelector('button[type="submit"]').textContent = 'Save Todo';
  todoForm.querySelector('button[type="reset"]').classList.add('d-none');
  todoForm.querySelector('button[type="button"]').classList.remove('d-none');
  
}

cancelEditBtn.addEventListener('click', CancelEdit);

function CancelEdit() {
  editingTodoId = null;
  todoForm.reset();
  todoForm.classList.remove('was-validated');
  todoForm.querySelector('button[type="submit"]').textContent = 'Add Todo';
  todoForm.querySelector('button[type="button"]').classList.add('d-none');
  todoForm.querySelector('button[type="reset"]').classList.remove('d-none');
}


  rightDiv.appendChild(viewBtn);
  rightDiv.appendChild(editBtn);
  li.appendChild(rightDiv);

  return li;
}

// edit toggle
function ToggleTodoItem(e) {
  const id = Number(e.target.dataset.id);

  todoItemList = todoItemList.map(todo =>
    todo.id === id
      ? { ...todo, isComplete: !todo.isComplete }
      : todo
  );
  SaveData(todoItemList);
  DisplayTodoItems();
}

// view
function OpenViewModal(id) {
  const todo = todoItemList.find(t => t.id === id);
  if (!todo) return;

  viewingTodoId = id;

  document.getElementById('viewTitle').textContent = todo.title;
  document.getElementById('viewDesc').textContent = todo.description;
  document.getElementById('viewCreated').textContent = todo.createdAt;
  document.getElementById('viewUpdated').textContent = todo.updatedAt;

  new Modal(document.getElementById('viewTodoModal')).show();
}

// modal button function
if (deleteTodoBtn) {
  deleteTodoBtn.addEventListener('click', () => {
    Modal.getInstance(document.getElementById('viewTodoModal')).hide();
    new Modal(document.getElementById('confirmDeleteModal')).show();
  });
}

if (confirmDeleteBtn) { 
  confirmDeleteBtn.addEventListener('click', () => {
    todoItemList = todoItemList.filter(t => t.id !== viewingTodoId);
  
    SaveData(todoItemList);
    DisplayTodoItems();
  
    viewingTodoId = null;
  
    Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
  });
}

if (cancelDeleteBtn) { 
  cancelDeleteBtn.addEventListener('click', () => {
    Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
    new Modal(document.getElementById('viewTodoModal')).show();
  });
}


// Main display function
function DisplayTodoItems() {
  const todoList = document.getElementById('todoList');
  todoList.innerHTML = '';

  if (todoItemList.length === 0) {
    const noTodoDiv = NoTodoItem();
    todoList.appendChild(noTodoDiv);
    return;
  }

  todoItemList.forEach((todo) => {
    const li = CreateListItem(todo);
    todoList.appendChild(li);
  });
}

window.addEventListener('DOMContentLoaded',()=>{
    DisplayTodoItems();
    Year.textContent = new Date().getFullYear();
})

todoForm.addEventListener('submit',submitTodoItem);
todoForm.addEventListener('reset',ResetForm);