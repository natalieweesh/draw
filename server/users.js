let users = [];

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);
  if (existingUser) {
    return { error: 'Sorry, that username is taken!' };
  }

  const usersInRoom = getUsersInRoom(room).length;
  if (usersInRoom > 0 && checkAllReadyToPlay(room)) {
    return { error: 'Sorry, that game already started! Please join a new game' }
  }
  const user = { id, name, room,
    readyToPlay: false,
    orderIndex: usersInRoom,
    answerSubmitted: false,
  };
  users.push(user);
  return { user };
}


const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

const getUser = (id) => users.find((user) => user.id === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);

const setReadyToPlay = (id) => {
  console.log('id', id)
  let myUser = users.find((user) => {
    user.id === id
  })
  users.find((user) => user.id === id).readyToPlay = true;
  console.log(users.find((user) => user.id === id).readyToPlay)
  console.log('myuser', myUser)
}

const checkAllReadyToPlay = (room) => {
  const usersInRoom = users.filter((user) => user.room === room).length;
  const usersReadyToPlay = users.filter((user) => user.room === room && user.readyToPlay).length;
  console.log('all players in room are ready to play', usersInRoom === usersReadyToPlay)
  return usersInRoom === usersReadyToPlay;
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom, setReadyToPlay, checkAllReadyToPlay };