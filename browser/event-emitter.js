function EventEmitter () {
  this.subscribers = {};
}

// Para usar instanciándolo:
// instancia.on (evento, función)
EventEmitter.prototype.on = function (eventName, eventListener) {
  if (!this.subscribers[eventName]) {
      this.subscribers[eventName] = [];
  }
  this.subscribers[eventName].push(eventListener);
};

// uso: instanciaEE.emit('codigo de evento', arg1, arg2, ... , argN)
  EventEmitter.prototype.emit = function (eventName) {
    //sin código de evento, no devuelve nada
    if (!this.subscribers[eventName]) {
        return;
    }

    // sino, guardar el resto de los argumentos para usarlos en la función
    var remainingArgs = [].slice.call(arguments, 1);

    // para cada evento, llamarlo con los argumentos
    this.subscribers[eventName].forEach(function (listener) {
        listener.apply(null, remainingArgs);
    });

  };

//  module.exports = EventEmitter;
export default EventEmitter