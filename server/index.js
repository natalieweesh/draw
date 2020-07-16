const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom, setReadyToPlay, checkAllReadyToPlay } = require('./users.js');
const { addGame, getGame, updateCard, restartGame } = require('./games.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const corsOptions = {
  origin: 'http://draw.nataliewee.com',
  optionsSuccessStatus: 200
}
app.options('*', cors())
app.use(cors(corsOptions));
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

 if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Max-Age', 120);
    return res.status(200).json({});
  }

  next();

});
app.use(router);
app.get("/status", (req, res) => {
  res.status(200).send({
    success: true
  })
})

io.on('connection', (socket) => {
  console.log('We have a new connection!!!');
  
  socket.on('join', ({ name, room }, callback) => {
    try {
      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) return callback(error);

      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to the room ${user.room}` });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

      socket.join(user.room);

      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

      callback();
    } catch (e) {
      console.log('error in join socket', e)
    }
  });

  socket.on('sendMessage', (message, callback) => {
    try {
      const user = getUser(socket.id);

      io.to(user.room).emit('message', { user: user.name, text: message });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

      callback();
    } catch (e) {
      console.log('error in sendMessage socket', e)
    }
  });

  socket.on('submitWord', ({word, startTurnIndex}, callback) => {
    try {
      const user = getUser(socket.id);
      updateCard(user.room, word, startTurnIndex, getUsersInRoom(user.room).length);

      io.to(user.room).emit('gameStatus', { room: user.room, game: getGame(user.room) })

      callback();
    } catch (e) {
      console.log('error in submitWord socket', e)
    }
  });


  socket.on('setReadyToPlay', (callback) => {
    try {
      const user = getUser(socket.id);
      setReadyToPlay(socket.id);

      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

      //check if all users in room have set ready to play
      if (checkAllReadyToPlay(user.room)) {
        io.to(user.room).emit('startGame', { room: user.room, users: getUsersInRoom(user.room) });
      }

      callback();
    } catch (e) {
      console.log('error in setReadyToPlay socket', e)
    }
  })

  socket.on('initiateGame', (callback) => {
    try {
      const user = getUser(socket.id);
      const games = addGame(user.room, getUsersInRoom(user.room));
      if (!!games) {
        callback();
      }
    } catch (e) {
      console.log('error in initiateGame socket', e)
    }
  })

  socket.on('restartGame', (callback) => {
    try {
      const user = getUser(socket.id);
      restartGame(user.room);
      const games = addGame(user.room, getUsersInRoom(user.room))
      io.to(user.room).emit('gameRestarted', {room: user.room})
      if (!!games) {
        callback();
      }
    } catch (e) {
      console.log('error in restartGame socket', e)
    }
  })

  socket.on('fetchGame', (callback) => {
    try {
      const user = getUser(socket.id)

      io.to(user.room).emit('gameStatus', { room: user.room, game: getGame(user.room) })

      callback();
    } catch (e) {
      console.log('error in fetchGame socket', e)
    }
  })

  socket.on('disconnect', () => {
    try {
      const user = removeUser(socket.id);
      console.log('disconnect user', socket.id)

      if (user) {
        io.to(user.room).emit('message', {user: 'admin', text: `${user.name} has left`})
      }
    } catch (e) {
      console.log('error in disconnect socket', e)
    }
  });

  socket.on('reconnect', () => {
    try {
      console.log('reconnect now!', socket.id)
    } catch (e) {
      console.log('error in reconnect socket', e)
    }
  })
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
