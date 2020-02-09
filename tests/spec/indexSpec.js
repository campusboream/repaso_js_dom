describe("index.js", function () {
  let ul, tasks, inputElement, dateElement, ulElement;
  let pintarSpy;

  beforeEach(function () {
    // aseguramos que el locale este en español
    moment.locale('es')
    // instalamos un mock sobre window.alert, así podemos hacer test sobre
    // las llamadas a window.alert sin llamarlo de verdad.
    spyOn(window, 'alert');
    jasmine.clock().install();
    // Estamos poniendo la fecha actual igual a 5/2/2020.
    const baseTime = new Date(2020, 1, 5);
    jasmine.clock().mockDate(baseTime);
    // instalamos un spy sobre nuestra funcion pintar, pero dejamos
    // que su comportamiento sea el llamar a la función de verdad.
    pintarSpy = spyOn(window, 'pintar');
    pintarSpy.and.callThrough();
  });

  afterEach(function () {
    // desinstalamos el mock del Date después de cada test.
    jasmine.clock().uninstall();
    // reseteamos el spy sobre alert
    window.alert.calls.reset();
  });

  describe("pintar", function () {
    beforeEach(function () {
      // creamos una lista vacia para cada test de pintar.
      ul = document.createElement('ul');
    })
    it("should remove all li before paint", function () {
      // hacemos que la lista contenga un li antes de ejecutar el test.
      ul.innerHTML = '<li>hola, un li de ejemplo</li>';
      const tasks = [];
      pintar(ul, tasks);
      // la lista debe quedar vacia
      expect(ul.innerHTML).toEqual('')
    });


    it("should paint all data in array", function () {
      tasks = [{
        id: 0,
        text: 'Hola',
        end: moment('2020-02-08'),
        visible: true
      }];
      pintar(ul, tasks);
      expect(ul.innerHTML).not.toEqual('')
      expect(ul.innerHTML).toEqual('<li class="task">sábado, 8 de febrero de 2020 - Hola, 3 días<button>Editar</button><button>Borrar</button><button>Done</button></li>')
    })

    it("should paint only values with visible true", function () {
      tasks = [{
        id: 0,
        text: 'Hola',
        end: moment('2020-02-08'),
        visible: true
      }, {
        id: 2,
        text: 'Hola',
        end: moment('2020-02-08'),
        visible: false
      }];
      pintar(ul, tasks);
      expect(ul.childNodes.length).toEqual(1)
    })
  })

  describe("addToDo", function () {
    beforeEach(function () {
      tasks = [];
      inputElement = document.createElement('input');
      dateElement = document.createElement('input');
      dateElement.value = '2028-01-01'
      inputElement.value = 'Hola';
      ulElement = document.createElement('ul');
    })

    it("should add an item", function () {
      addToDo(tasks, inputElement, dateElement, ulElement)
      expect(tasks.length).toEqual(1);
      const addedTask = tasks[0];
      expect(addedTask.text).toEqual('Hola');
      expect(addedTask.end).toEqual(moment('2028-01-01'))
      expect(inputElement.value).toEqual('')
      expect(dateElement.value).toEqual('2020-02-05')
    })

    it("should not add when text is empty", function () {
      inputElement.value = ''
      addToDo(tasks, inputElement, dateElement, ulElement);
      expect(window.alert).toHaveBeenCalledWith('El texto esta vacio');
      expect(tasks.length).toEqual(0)
    })

    it("should not add when date is empty", function () {
      dateElement.value = ''
      addToDo(tasks, inputElement, dateElement, ulElement);
      expect(window.alert).toHaveBeenCalledWith('La fecha esta vacia');
      expect(tasks.length).toEqual(0)
    })

    it("should not add when date is bigger than now", function () {
      dateElement.value = '2020-01-01'
      addToDo(tasks, inputElement, dateElement, ulElement);
      expect(window.alert).toHaveBeenCalledWith('La fecha es anterior a hoy');
    })

    it("should add task when days is the same", function(){
      dateElement.value = '2020-02-05'
      jasmine.clock().tick(50000)
      addToDo(tasks, inputElement, dateElement, ulElement);
      expect(window.alert).not.toHaveBeenCalled();
      expect(tasks.length).toEqual(1)
    })
  })

  describe("addDeleteBtnElement", function () {
    it("should create a button", function () {
      const button = addDeleteBtnElement();
      expect(button.innerHTML).toEqual('Borrar')
    })
  })

  describe("addEditBtnElement", function () {
    it("should create a button", function () {
      const button = addEditBtnElement();
      expect(button.innerHTML).toEqual('Editar')
    })
  })

  describe("addEditBtnElement", function () {
    it("should create a button", function () {
      const button = addEditBtnElement();
      expect(button.innerHTML).toEqual('Editar')
    })
  })

  describe("filtrarPorTexto", function () {
    beforeEach(function(){
      tasks = [
        {
          text: 'hola que tal',
          visible: false
        },
        {
          text: 'tarea 2',
          visible: false
        }
      ];
    })
    it("should return all when filter is empty", function(){
      filtrarPorTexto(null, tasks);
      expect(tasks[0].visible).toEqual(true)
      expect(tasks[1].visible).toEqual(true)

      filtrarPorTexto('', tasks);
      expect(tasks[0].visible).toEqual(true)
      expect(tasks[1].visible).toEqual(true)
    })
    it("should change visible if text property contains filter string", function () {
      filtrarPorTexto('que', tasks);
      expect(tasks.length).toEqual(2);
      expect(tasks[0].visible).toEqual(true);
      expect(tasks[1].visible).toEqual(false);
    })

    it("should return empty array if it is not found", function () {
      filtrarPorTexto('asdf', tasks);
      expect(tasks.length).toEqual(2);
      expect(tasks[0].visible).toEqual(false);
      expect(tasks[1].visible).toEqual(false);
    })
  })

  describe("filtrarPorDias", function(){
    beforeEach(function(){
      tasks = [
        {
          end: moment('2020-02-06'),
          visible: false
        },
        {
          end: moment('2020-02-07'),
          visible: false
        }
      ];
    })
    it("should return all when filter is empty", function() {
      filtrarPorDias(null, tasks);
      expect(tasks[0].visible).toEqual(true)
      expect(tasks[1].visible).toEqual(true)
    })

    it("should put visible on tasks with days to finish lesser than filter", function() {
      filtrarPorDias(1, tasks);
      expect(tasks[0].visible).toEqual(true)
      expect(tasks[1].visible).toEqual(false)
    })

    it("should return empty if filter is smaller than every end days to finish", function() {
      filtrarPorDias(0, tasks);
      expect(tasks[0].visible).toEqual(false)
      expect(tasks[1].visible).toEqual(false)
    })

    it("should return all if filter is bigger than every end days to finish", function() {
      filtrarPorDias(5, tasks);
      expect(tasks[0].visible).toEqual(true)
      expect(tasks[1].visible).toEqual(true)
    })
  })

})