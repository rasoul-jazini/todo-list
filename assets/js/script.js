const todosContainer = document.querySelector(".todos");
const todosEl = document.querySelector(".todos");
const todoInput = document.querySelector(".todo-input");
const newTodo = document.querySelector(".form-container form");
const filterTodos = document.querySelector(".filter-todos");

let todos = getLocalStorage();
let filter = "all";
let isEdited = false;
let editedTodoId;

// Events
document.addEventListener("DOMContentLoaded", showTodos);
newTodo.addEventListener("submit", addNewTodo);
todosEl.addEventListener("click", manageTodo);
filterTodos.addEventListener("change", filterTodosHandler);

// Functions

// show todos
function showTodos() {
  todosContainer.innerHTML = "";
  switch (filter) {
    case "all":
      todos.forEach((item) => {
        createTodo(item);
      });
      break;
    case "completed":
      todos
        .filter((item) => item.isCompleted)
        .forEach((item) => {
          createTodo(item);
        });
      break;
    case "uncompleted":
      todos
        .filter((item) => !item.isCompleted)
        .forEach((item) => {
          createTodo(item);
        });
      break;
  }
  // if (filter === "all") {
  //   todos.forEach((item) => {
  //     createTodo(item);
  //   });
  // } else if (filter === "completed") {
  //   todos
  //     .filter((item) => item.isCompleted)
  //     .forEach((item) => {
  //       createTodo(item);
  //     });
  // } else if (filter === "uncompleted") {
  //   todos
  //     .filter((item) => !item.isCompleted)
  //     .forEach((item) => {
  //       createTodo(item);
  //     });
  // }
}

// create new todo and add to DOM
function createTodo(item) {
  const todo = document.createElement("li");
  todo.id = item.id;
  todo.className = `todo ${item.isCompleted ? "completed" : ""}`;
  todo.innerHTML = `
    <span class="todo-title">${item.title}</span>
    <div class="todo-btns">
        <button class="check">
            <i class="fa fa-check"></i>
        </button>
        <button class="edit">
            <i class="fa fa-edit"></i>
        </button>
        <button class="delete">
            <i class="fa fa-trash"></i>
        </button>
    </div>`;

  todosContainer.appendChild(todo);
}

// add new todo
function addNewTodo(e) {
  e.preventDefault();

  if (!isEdited) {
    if (todoInput.value.trim().length > 0) {
      const newTodo = {
        id: uuidv4(),
        title: todoInput.value,
        isCompleted: false,
      };
      todos.push(newTodo);
    }
  } else {
    const updatedTodos = todos.map((todoItem) => {
      if (todoItem.id === editedTodoId) {
        return {
          ...todoItem,
          title: todoInput.value,
        };
      }
      return todoItem;
    });

    todos = [...updatedTodos];
    todoInput.value = "";
    isEdited = false;
    showTodos();
    setLocalStorage(updatedTodos);
  }

  setLocalStorage(todos);
  todoInput.value = "";
  showTodos();
}

// manage todo buttons
function manageTodo(e) {
  const target = e.target.parentElement;

  if (target.classList.contains("check")) {
    // check todo
    const todo = target.parentElement.parentElement;
    const todoId = todo.id;

    let updatedTodos = todos.map((todoItem) => {
      if (todoItem.id === todoId) {
        return {
          ...todoItem,
          isCompleted: !todoItem.isCompleted,
        };
      }
      return todoItem;
    });

    todos = [...updatedTodos];

    setLocalStorage(updatedTodos);
    showTodos();
  } else if (target.classList.contains("edit")) {
    // edit  todo
    const todo = target.parentElement.parentElement;
    const todoId = todo.id;

    const findedTodo = todos.find((todoItem) => todoItem.id === todoId);
    editedTodoId = todoId;
    isEdited = true;
    todoInput.value = findedTodo.title;
  } else if (target.classList.contains("delete")) {
    // delete todo
    const todo = target.parentElement.parentElement;
    const todoId = todo.id;

    let updatedTodos = todos.filter((todoItem) => todoItem.id !== todoId);
    todos = [...updatedTodos];

    setLocalStorage(updatedTodos);
    showTodos();
  }
}

function filterTodosHandler(e) {
  filter = e.target.value;
  showTodos();
}

// set local storage
function setLocalStorage(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// get local storage
function getLocalStorage() {
  let todos;
  if (localStorage.getItem("todos")) {
    todos = JSON.parse(localStorage.getItem("todos"));
  } else {
    todos = [];
  }

  return todos;
}
