const express = require('express'); // Inicializamos express
const app = express(); // Le pasamos la constante app que creamos arriba
const http = require('http').Server(app); // Le pasamos la constante http
const io = require('socket.io')(http);

app.use(express.static('./public')) // Esta ruta carga nuestro archivo index.html en la raíz de la misma
app.get('/', (req, res) => {
res.sendFile('index.html', {root: __dirname})
})
http.listen(8080, () => console.log('SERVER ON'))// El servidor funcionando en el puerto 8080

io.on('connection', (socket) => {  // "connection" se ejecuta la primera vez que se abre una nueva conexión
    console.log('Usuario conectado') // Se imprimirá solo la primera vez que se ha abierto la conexión
    socket.emit('mi mensaje', 'Este es mi mensaje desde el servidor')

})

let currentTurn = 0;
let nextTurns = [];
let allTurns = [];
let mensajes = [
    {author:"Juan", text: "Hola, que tal"},
    {author:"Pedro", text: "Muy bien y tu"},
    {author:"Ana", text: "Genial"},
]


io.on('connection', socket => {
    console.log('¡Nuevo cliente conectado!'); /* Envio los mensajes al cliente que se conectó*/
    socket.emit('mensajes', mensajes); /*Escucho los mensajes enviados por el cliente y se los propago a todos*/
    socket.on('mensaje', data => {
        mensajes.push({ socketid: socket.id, mensaje: data })
        io.sockets.emit('mensajes', mensajes);
    });
    

  // Send current turn to client
  socket.emit('currentTurn', currentTurn);

  // Send next turns to client
  socket.emit('nextTurns', nextTurns);

  // Send all turns to client
  socket.emit('allTurns', allTurns);

  // Handle next turn button click
  socket.on('nextTurn', () => {
    currentTurn++;
    nextTurns.push(currentTurn);
    allTurns.push(currentTurn);
    io.emit('currentTurn', currentTurn);
    io.emit('nextTurns', nextTurns);
    io.emit('allTurns', allTurns);
  });
});

