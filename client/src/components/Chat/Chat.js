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
  const [messages, setMessages] = useState([]);
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

    socket.emit('join', { name, room }, () => {
    });

    return () => {
      socket.emit('disconnect');

      socket.off();
    }

  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })

    socket.on('roomData', ({ users }) => {
      setUsers(users);
    })

  }, [messages]);

  useEffect(() => {
    socket.on('gameStatus', ({ game }) => {
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
    socket.on('gameRestarted', () => {
      setFinishedGame(false)
      setNewRound(false)
      setCurrentGame([])
    })
  }, [])

  useEffect(() => {
    socket.on('startGame', ({ users }) => {
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
      socket.emit('sendMessage', message, () => {
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
        <TextContainer users={users} user={user} game={currentGame} />
        {currentGame.length === 0 && <button className="startButton" disabled={user?.readyToPlay} onClick={updateUserStatus}>{user?.readyToPlay ? 'Waiting for other players' : 'Ready to play!'}</button>}
        {finishedGame && <div className="sideContainer"><button className="startButton" onClick={restartGame}>Play again!</button></div>}
      </div>
      <div className="container max-height">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {currentGame.length > 0 ? <Game newRound={newRound} finishedGame={finishedGame} game={currentGame} submitWord={submitWord} user={user} users={users} /> : null}
    </div>
  )   
}

export default Chat;