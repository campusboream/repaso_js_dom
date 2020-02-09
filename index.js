
/* Función pintar. Refresca el estado de los <li> dependendiendo
 * del contenido del parametros task.
 * ulElement: Elemento <ul> donde generar <li>
 * tasks: array de ToDos a pintar
 * return void*/
function pintar(ulElement, tasks) {
  // eliminar nodos
  while(ulElement.firstChild) {
    ulElement.removeChild(ulElement.firstChild);
  }

  // Se usa un desconstructor de ES6 para asignar las props text y end
  tasks.forEach(({ text, end, visible, done }, index) => {
    if(visible) {
      // se crea el nuevo li que se insertará en la lista
      const li = document.createElement('li');
      // se obtiene cada parte de la fecha a pintar
      const dayName = end.format('dddd');
      const dayNumber = end.format('D');
      const month = end.format('MMMM');
      const year = end.format('YYYY');
      const outputDate = `${dayName}, ${dayNumber} de ${month} de ${year}`;
      const daysTo = end.diff(moment(), 'days');
      // se construye el texto de salida
      const outputText = `${outputDate} - ${text}, ${daysTo} días`;
      // meter botones
      li.appendChild(document.createTextNode(outputText));
      li.appendChild(addEditBtnElement(text, index));
      li.appendChild(addDeleteBtnElement(index));
      li.classList.add("task");//a ese li que se crea le metemos la case "task"
      if(done) {
        li.classList.add('task--done')
      } else {
        li.appendChild(addDoneBtnElement(index))
      }
      ulElement.appendChild(li);
    }
  });
}

/* Función para añadir un nuevo task. Valida inputElement y dateElement
 * antes de añadir una nueva task al array y llamar a pintar.
 * tasks: lista de tareas ya añadidas
 * inputElement: input desde donde coger el texto.
 * dateElement: input desde donde coger el end.
 * ulElement: nodo lista. Necesario para pasarlo al metodo pintar
 * */
function addToDo(tasks, inputElement, dateElement, ulElement) {
  if(inputElement.value === '') {
    alert('El texto esta vacio');
    return;
  }
  if(dateElement.value === '') {
    alert('La fecha esta vacia');
    return;
  }
  const end = moment(dateElement.value);
  if(end.diff(moment(), 'days') < 0) {
    alert('La fecha es anterior a hoy');
    return;
  }
  // podemos asignar de la siguiente manera end por una caracteristica ES6.
  tasks.push({
    id: tasks.length,
    text: inputElement.value,
    end,
    visible: true,
    done: false
  });
  inputElement.value = '';
  dateElement.value = moment().format('YYYY-MM-DD');
  pintar(ulElement, tasks);
}

/* Función añadir boton edit en cada <li> generado.
 * text: texto a insertar en el nuevo <input> generado para editar.
 * index: posicion del todo que se esta editando.
 * return void
 * */
function addEditBtnElement(text, index) {
  const editNode = document.createElement('button');
  editNode.appendChild(document.createTextNode('Editar'))
  // el metodo bind sirve para modificar los parámetros y el contexto con el que
  // se llama a una función.
  // https://javascript.info/bind#partial-functions
  // https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Objetos_globales/Function/bind
  // la opción once: true, indica que el listener del evento se borre una vez ejecutado.
  editNode.addEventListener('click', editElement.bind(editNode, text, index), { once: true });
  return editNode;
}
/* Manejador editar Elemento.
 * text: texto de inicio para editar
 * index: indice donde se está editando
 * event: evento del boton Editar
 * return void
 * */
function editElement(text, index, event) {
  const li = event.target.parentElement;
  const liText = li.childNodes[0];
  const btnEdit = li.childNodes[1];
  const btnSave = addSaveBtnElement(index);
  const input = document.createElement('input');
  input.setAttribute("id", "inputEdit");
  input.value = text;
  li.removeChild(liText);
  li.removeChild(btnEdit);
  li.prepend(btnSave);
  li.prepend(input);
}


/* Función añadir botón Borrar en cada <li>
 * index: índice a borrar dentro de tasks
 * return button node with handler
 * */
function addDeleteBtnElement(index) {
  const deleteNode = document.createElement('button');
  deleteNode.appendChild(document.createTextNode('Borrar'));
  deleteNode.addEventListener('click', deleteElement.bind(deleteNode, index), { once: true })
  return deleteNode;
}
/* Handler del evento click en Borrar.
 * index: indice a borrar dentro de tasks
 * return void
 * */
function deleteElement(index) {
  tasks.splice(index, 1);
  pintar(ulElement, tasks)
}

/* Función añadir botón Done en cada <li>
 * index: índice a poner done dentro de tasks
 * return button node with handler
 * */
function addDoneBtnElement(index) {
  const doneBtnNode = document.createElement('button');
  doneBtnNode.appendChild(document.createTextNode('Done'));
  doneBtnNode.addEventListener('click', doneElement.bind(doneBtnNode, index), { once: true });
  return doneBtnNode;
}
/* Handler para el botón Done. Actualiza la clase del <li>
 * return void
 * */
function doneElement(index, e) {
  tasks[index].done = true;
  pintar(ulElement, tasks)
}

/**
 * Función para añadir el boton save cuando se hace click sobre el 
 * botón Editar
 * @param {*} index El índice sobre el que se ha hecho click
 */
function addSaveBtnElement(index) {
  const saveBtnNode = document.createElement('button');
  saveBtnNode.appendChild(document.createTextNode('Guardar'));
  saveBtnNode.addEventListener('click', saveElement.bind(saveBtnNode, index), { once: true });
  return saveBtnNode;
}

/**
 * Handler para el botón Save. Actualizar el contenido dentro de tasks y llama
 * a pintar
 * @param {*} index Indice que actualizar en tasks
 * @param {*} event Evento que lo lanzó, el boton Save de un <li>
 */
function saveElement(index, event) {
  const li = event.target.parentElement;
  const input = li.childNodes[0];
  const update = tasks[index];
  update.text = input.value;
  tasks.splice(index, 1, update);
  pintar(ulElement, tasks);
}

function ordenarAZ(order, tasks) {
  return tasks.sort((a, b) => {
    if(a.text < b.text) {
      return -1 * order;
    } else if(a.text > b.text) {
      return 1 * order;
    }
    return 0;
  })
}

function ordenarPrioritarios(tasks) {
  return tasks.sort((a, b) => {
    return a.end.diff(b.end);
  })
}

function ordenarDefault(tasks) {
  return tasks.sort((a, b) => {
    return a.id - b.id;
  });
}

function filtrarPorTexto(filter, tasks) {
  tasks.forEach(elem => {
    if(!filter || filter === '') {
      elem.visible = true;
    } else if(elem.text.includes(filter)) {
      elem.visible = true;
    } else {
      elem.visible = false;
    }
  });
}

function filtrarPorDias(filter, tasks) {
  tasks.forEach(elem => {
    const daysToFinish = elem.end.diff(moment(), 'days');
    if(isNaN(filter) || (typeof filter !== 'number' && !filter)) {
      elem.visible = true;
    } else if(filter >= daysToFinish) {
      elem.visible = true;
    } else {
      elem.visible = false;
    }
  });
}