/* Integracion */
const ulElement = document.getElementById('list');
const textInput = document.getElementById('textInput');
const endInput = document.getElementById('endInput');
endInput.value = moment().format('YYYY-MM-DD');
const addButton = document.getElementById('addButton');
const textOrder = document.getElementById('textOrder');
const daysOrder = document.getElementById('daysOrder');
const defaultOrder = document.getElementById('defaultOrder');
const textFilter = document.getElementById('textFilter');
const daysFilter = document.getElementById('daysFilter');

let tasks = [];
let order = 1;

moment.locale('es');

addButton.addEventListener('click', (e) => {
  addToDo(tasks, textInput, endInput, ulElement);
})

textInput.addEventListener('keypress', addTodoOnEnter)
function addTodoOnEnter(e) {
  if(e.keyCode === 13) {
    addToDo(tasks, textInput, endInput, ulElement);
  }
}

textOrder.addEventListener('click', (e) => {
  tasks = ordenarAZ(order, tasks);
  order = order * -1;
  if(order > 0) {
    textOrder.innerText = '(A-Z)'
  } else {
    textOrder.innerText = '(Z-A)'
  }
  pintar(ulElement, tasks)
})

daysOrder.addEventListener('click', (e) => {
  tasks = ordenarPrioritarios(tasks);
  pintar(ulElement, tasks);
})

defaultOrder.addEventListener('click', (e) => {
  tasks = ordenarDefault(tasks);
  pintar(ulElement, tasks);
})

textFilter.addEventListener('input', (e) => {
  filtrarPorTexto(e.data, tasks);
  pintar(ulElement, tasks)
});

daysFilter.addEventListener('input', (e) => {
  filtrarPorDias(parseInt(e.data), tasks);
  pintar(ulElement, tasks)
});


