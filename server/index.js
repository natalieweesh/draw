const express = require('express');
const Sentry = require('@sentry/node');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');

const { addUser, getUser, getUsersInRoom, setReadyToPlay, checkAllReadyToPlay, scheduleRemoveUser } = require('./users.js');
const { addGame, getGame, updateCard, restartGame, removeGame } = require('./games.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();

Sentry.init({ dsn: 'https://e056aabec1b343c58f3b1ce6ee82ca89@o422420.ingest.sentry.io/5348508' });

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler());


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
app.get('/debug-sentry', function mainHandler(req, res) {
  throw new Error('My first Sentry error!');
});

app.use(Sentry.Handlers.errorHandler({
  shouldHandleError(error) {
    if (error.status >= 400 && error.status < 600) {
      return true
    }
    return false
  }
}));

io.on('connection', (socket) => {
  console.log('We have a new connection!!');
  
  socket.on('join', ({ name, room }, callback) => {
    try {
      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) return callback(error);

      socket.emit('message', { user: 'admin', message: `${user.name}, welcome to the room ${user.room}`, messages: [] });
      socket.broadcast.to(user.room).emit('message', { user: 'admin', message: `${user.name} has joined!` });

      socket.join(user.room);

      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
      io.to(user.room).emit('gameStatus', { room: user.room, game: getGame(user.room) })

      callback();
    } catch (e) {
      console.log('error in join socket', e)
    }
  });

  socket.on('sendMessage', ({message, messages}, callback) => {
    try {
      const user = getUser(socket.id);

      io.to(user.room).emit('message', { user: user.name, message: message, messages: messages });
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

  socket.on('disconnect', ({messages}, callback) => {
    try {
      const user = scheduleRemoveUser(socket.id);

      if (user) {
        console.log('disconnect user', user.name, socket.id)
        if (getUsersInRoom(user.room).length === 0) { //there is a room and you are the only user left
          console.log('remove the last user from the room')
          removeGame(user.room)
        } else {
          console.log('there are still ppl in the room', user.name, user.room)
          io.to(user.room).emit('message', {user: 'admin', message: `${user.name} has left`, messages: messages})
        }
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
