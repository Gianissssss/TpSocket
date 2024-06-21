const socket = io()

//mensaje de prueba en socket
socket.on('mi mensaje', data => {
    alert(data)
    socket.emit('notificacion','mensaje recibido exitosamente')
})



function render(data){
  var html = data.map(function(elem, index){
    return (`
      <div id="mensajes">
      <strong>${elem.author}</strong>:
    <em>${elem.text}</em></div> `)
  }).join("");
  document.getElementById('mensajes').innerHTML = html;  
}
socket.on('mensajes',function (data){render(data);});

// Capturar el evento de click en el botón 'Enviar'
document.getElementById('enviar').addEventListener('click', function() {
  const nombre = document.getElementById('nombre').value;
  const mensaje = document.getElementById('mensaje').value;
  
  // Enviar los datos al servidor a través de socket
  socket.emit('enviarMensaje', { author: nombre, text: mensaje });

  // Limpiar el campo de mensaje después de enviar
  document.getElementById('mensaje').value = '';
  document.getElementById('nombre').value = '';
  console.log ('nombre:',nombre,'mensaje:',mensaje);
});


// Current turn display
const currentTurnDisplay = document.getElementById('current-turn');

// Next turns display
const nextTurnsDisplay = document.getElementById('next-turns');

// All turns display
const allTurnsDisplay = document.getElementById('all-turns');

// Next turn button
const nextTurnButton = document.getElementById('next-turn-button');

socket.on('currentTurn', (turn) => {
  currentTurnDisplay.innerText = `Caja: ${turn} - Turno: ${turn}`;
});

socket.on('nextTurns', (turns) => {
  nextTurnsDisplay.innerHTML = '';
  turns.forEach((turn) => {
    const li = document.createElement('li');
    li.innerText = `Siguiente turno: ${turn}`;
    nextTurnsDisplay.appendChild(li);
  });
});

socket.on('allTurns', (turns) => {
  allTurnsDisplay.innerHTML = '';
  turns.forEach((turn) => {
    const li = document.createElement('li');
    li.innerText = `Turno: ${turn}`;
    allTurnsDisplay.appendChild(li);
  });
});

nextTurnButton.addEventListener('click', () => {
  socket.emit('nextTurn');
});