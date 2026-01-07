import "./style.css";

// form
const todoTitle = document.getElementById("todoTitle");
const todoDesc = document.getElementById("todoDesc");
const errorMsg = document.getElementById("errorMsg");
const resetForm = document.getElementById("resetForm");
const submitBtn = document.getElementById("submitBtn");

let taskCollection = JSON.parse(localStorage.getItem("taskCollection")) || [];

function submitTask() {
  let title = todoTitle.value.trim();
  let desc = todoDesc.value.trim();

  if (!title || !desc) {
    errorMsg.innerText = "Please filled the details";
    errorMsg.style.display = "block";
    return;
  }

  let singleTask = {
    id: Date.now(),
    title,
    desc,
  };

  taskCollection.push(singleTask);
  localStorage.setItem("taskCollection", JSON.stringify(taskCollection));
  console.log("task added successfully");
  console.log("the task added is", taskCollection);
  ClearForm();
}

function ClearForm() {
  todoTitle.value = "";
  todoDesc.value = "";
  errorMsg.innerText = "";
}

submitBtn.addEventListener("click", (e) => {
  e.preventDefault();
  submitTask();
});

resetForm.addEventListener("click", (e) => {
  e.preventDefault();
  ClearForm();
});
