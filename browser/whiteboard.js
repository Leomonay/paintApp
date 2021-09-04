import {EventEmitter} from './event-emitter.js';
export var whiteboard = new EventEmitter();

// const EventEmitter = require('./event-emitter.js');//common js
// var whiteboard = new EventEmitter();//common js
var color;

//paleta de colores
var colorElements = [].slice.call(document.querySelectorAll('.marker'));

//agregar el método de selección
colorElements.forEach(function (elem) {
  elem.style.backgroundColor = el.id;
  elem.addEventListener('click', function () {
      color = this.id;
      document.querySelector('.selected').classList.remove('selected');
      this.classList.add('selected');
  });
});

//crear lienzo
var canvas = document.getElementById('paint');
var ctx = canvas.getContext('2d')

function resize() {
  // des-escalar lienzo
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  // setear pixelado del dispositivo
  var pixelRatio = window.devicePixelRatio || 1;
  // setear ancho y largo del lienzo
  var w = canvas.clientWidth * pixelRatio,
      h = canvas.clientHeight * pixelRatio;
  if (w !== canvas.width || h !== canvas.height) {
    // Guardar el contenido para que no se elimine al cambiar tamaño del lienzo
    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    canvas.width = w; canvas.height = h;
    //luego, restablecerlo:
    ctx.putImageData(imgData, 0, 0)
  } 
  // Escalar las coordinadas internas del sistema de acuerdo al pixelado del dispositivo
  // para asegurar que 1 pixel del lienzo equivale a 1 pixel css, aunque nuestro contenido
  // sea más grande
  ctx.scale(pixelRatio, pixelRatio);

  ctx.lineWidth = 5
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
}
resize();

window.addEventListener('resize', resize);
var currentMousePosition = { x: 0, y: 0 };
var lastMousePosition = { x: 0, y: 0 };

var drawing = false;

// evento que indica que se está dibujando
canvas.addEventListener('mousedown', function (e) {
  drawing = true;
  currentMousePosition.x = e.pageX - this.offsetLeft;
  currentMousePosition.y = e.pageY - this.offsetTop;
});

// evento que indica dejar de dibujar
canvas.addEventListener('mouseup', function () {
  drawing = false;
});

// listener que trackea el movimiento del mouse
canvas.addEventListener('mousemove', function (e) {
  if (!drawing) return;

  lastMousePosition.x = currentMousePosition.x;
  lastMousePosition.y = currentMousePosition.y;

  currentMousePosition.x = e.pageX - this.offsetLeft;
  currentMousePosition.y = e.pageY - this.offsetTop;

  whiteboard.draw(lastMousePosition, currentMousePosition, color, true);
});


whiteboard.draw = function (start, end, strokeColor, shouldBroadcast) {
  // dibuja una línea entre la posición inicial y final del color indicado
  ctx.beginPath();
  ctx.strokeStyle = strokeColor || 'black';
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);
  ctx.closePath();
  ctx.stroke();

  // emitir evento sólo si el shouldBroadcast es true
  if (shouldBroadcast) {
    whiteboard.emit('draw', start, end, strokeColor);
  }

};
;
// module.exports = whiteboard;