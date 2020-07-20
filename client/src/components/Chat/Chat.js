import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import io from 'socket.io-client';

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';
import Messages from '../Messages/Messages';
import TextContainer from '../TextContainer/TextContainer';
import Game from '../Game/Game';

let socket;

const Chat = ({ location }) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [prevmessages, setPrevMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [currentGame, setCurrentGame] = useState([]);
  const [newRound, setNewRound] = useState(false);
  const [finishedGame, setFinishedGame] = useState(false);

  // TODO: change this for prod / dev
  // const ENDPOINT = 'localhost:5000';
  const ENDPOINT = 'https://react-simple-chat-app.herokuapp.com/';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);

    setName(name.trim().toLowerCase());
    setRoom(room.trim().toLowerCase());

    socket.emit('join', { name, room }, ((e) => {
      if (e) {
        window.location.href='/';
        alert(e)
      }
    }));

    return () => {
      socket.emit('disconnect');

      socket.off();
    }

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.off('roomData').on('roomData', ({ users }) => {
      setUsers(users);
    })
    socket.off('gameStatus').on('gameStatus', ({ game }) => {
      document.removeEventListener('visibilitychange');
      if (currentGame.length === 0 && !!game) {
        setCurrentGame(game.cards);
        if (newRound !== game.newRound) {
          setNewRound(game.newRound)
        }
        if (finishedGame !== game.finishedGame) {
          setFinishedGame(game.finishedGame)
        }
      }
    })
    socket.off('gameRestarted').on('gameRestarted', ({ users }) => {
      setFinishedGame(false)
      setNewRound(false)
      setUsers(users);
      setCurrentGame([])
    })
    
  }, [])

  useEffect(() => {
    socket.off('disconnect').on('disconnect', () => {
      const reconnectFrontEnd = () => {
        const { name, room } = queryString.parse(location.search);
        socket.connect()
        socket.emit('frontEndReconnect', {name, room}, () => {
        })
        socket.emit('join', { name, room }, ((e) => {
          if (e) {
            window.location.href='/';
            alert(e)
          }
        }));
        document.removeEventListener('click', reconnectFrontEnd)
        document.removeEventListener('visibilitychange', reconnectFrontEndVisible);
      }
      document.addEventListener('click', reconnectFrontEnd)

      const reconnectFrontEndVisible = () => {
        const { name, room } = queryString.parse(location.search);
        if (document.visibilityState && document.visibilityState === 'visible') {
          socket.connect()
          socket.emit('frontEndReconnect', {name, room}, () => {
          })
          socket.emit('join', { name, room }, ((e) => {
            if (e) {
              window.location.href='/';
              alert(e)
            }
            document.removeEventListener('visibilitychange');
          })); 
          document.removeEventListener('visibilitychange', reconnectFrontEndVisible);
          document.removeEventListener('click', reconnectFrontEnd)
        }
      }
      document.addEventListener('visibilitychange', reconnectFrontEndVisible)
    })
  })

  useEffect(() => {
    socket.off('message').on('message', ({user, message, messages}) => {
      if (message && prevmessages) {
        setPrevMessages([...prevmessages, {user, text: message}]);
      } else if (message && messages) {
        setPrevMessages([...messages, {user, text: message}]);
      }
    })
  }, [prevmessages])

  useEffect(() => {
    socket.off('startGame').on('startGame', ({ users }) => {
      socket.emit('initiateGame', () => {
        socket.emit('fetchGame', () => {
        })
      })
    })
  }, [currentGame, setCurrentGame])

  const restartGame = (event) => {
    event.preventDefault();
    socket.emit('restartGame', () => {
      socket.emit('fetchGame', () => {
      })
    })
  }

  const sendMessage = (event) => {
    event.preventDefault();

    if (message) {
      socket.emit('sendMessage', {message, messages: prevmessages}, () => {
        setMessage('')
      })
    }
  }

  const submitWord = (event, word, startTurnIndex) => {
    event.preventDefault();

    if (word) {
      if (newRound) {
        setNewRound(false)
      }
      socket.emit('submitWord', {word, startTurnIndex}, () => {
      })
    }
  }

  

  const updateUserStatus = (event) => {
    event.preventDefault();

    socket.emit('setReadyToPlay', () => {
    })
  }

  const user = users.find((user) => user.name === name);
  return (
    <div className="outerContainer">
    
      <div className="sideContainer">
        <TextContainer users={users} user={user} game={currentGame} finishedGame={finishedGame} />
        {currentGame.length === 0 && users.length > 1 && <button className="startButton" disabled={user?.readyToPlay} onClick={updateUserStatus}>{user?.readyToPlay ? 'Waiting for other players' : 'Ready to play!'}</button>}
        {finishedGame && <div className="sideContainer"><button className="startButton" onClick={restartGame}>Play again!</button></div>}
      </div>
      {currentGame.length > 0 && user ? <Game newRound={newRound} finishedGame={finishedGame} game={currentGame} submitWord={submitWord} user={user} users={users} /> : null}
      <div className="container max-height">
        <InfoBar room={room} />
        <Messages messages={prevmessages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
    </div>
  )   
}

export default Chat;