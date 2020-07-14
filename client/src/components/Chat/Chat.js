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
  const ENDPOINT = 'localhost:5000';
  // const ENDPOINT = 'https://react-simple-chat-app.herokuapp.com/';

  useEffect(() => {
    const { name, room } = queryString.parse(location.search);

    socket = io(ENDPOINT);
    console.log(socket)

    setName(name);
    setRoom(room); 

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
      console.log('got this game status!', game)
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
  })

  useEffect(() => {
    socket.on('startGame', ({ users }) => {
      console.log("LET THE GAME BEGIN!")
      socket.emit('initiateGame', () => {
        console.log('done emitting initiategame');
        socket.emit('fetchGame', () => {
          console.log('done fetching game')
        })
      //  if (!!game && !currentGame) {
      //   console.log("GAME", game)
      //   setCurrentGame(game)
      // } console.log('done setting game', game)
      })
    })
  }, [currentGame, setCurrentGame])

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
        console.log('done submitting word')
      })
    }
  }

  

  const updateUserStatus = (event) => {
    event.preventDefault();

    socket.emit('setReadyToPlay', () => {
      console.log('set ready to play is done')
    })
  }

  const user = users.find((user) => user.name === name);
  return (
    <div className="outerContainer">
    
      {currentGame.length === 0 && <div className="sideContainer">
        <TextContainer users={users} user={user} />
        <button className="startButton" disabled={user?.readyToPlay} onClick={updateUserStatus}>{user?.readyToPlay ? 'Waiting for other players' : 'Ready to play!'}</button>
      </div>}
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name} />
        <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
      </div>
      {currentGame.length > 0 ? <Game newRound={newRound} finishedGame={finishedGame} game={currentGame} user={user} submitWord={submitWord} users={users} /> : null}
    </div>
  )   
}

export default Chat;