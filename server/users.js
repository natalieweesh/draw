let users = [];

// Map of usernames to timeout IDs. When user disconnects, schedule
// removal here. When user reconnects within time limit, remove entry.
let pendingRemovals = {};

const addUser = ({ id, name, room }) => {
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const existingUser = users.find((user) => user.room === room && user.name === name);
  // users can claim their username
  if (existingUser) {
    let timeoutId = pendingRemovals[existingUser.name];

    if (timeoutId === undefined) {
      // A user is connected to the game! This is an imposter of the other user.
      // Note that this might run into trouble if a user fails to cleanly disconnect,
      // because the user cannot take over the existing session, but that is not thought
      // to be a likely case.
      return { error: "Sorry, this user already exists! But not sorry."}
    }
    
    clearTimeout(timeoutId);
    delete pendingRemovals[existingUser.name];
    existingUser.id = id;

    return { user: existingUser }
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

const scheduleRemoveUser = (socketId) => {
  let userToRemove = users.find((user) => user.id === socketId);

  if (userToRemove === undefined) {
    return
  }

  let timeoutId = setTimeout(() => {
    removeUserByUsername(userToRemove.name);
    delete pendingRemovals[userToRemove.name];
  }, 300000) // after 5 minutes
  pendingRemovals[userToRemove.name] = timeoutId;

  return userToRemove;
}

const removeUserByUsername = (username) => {
  const index = users.findIndex((user) => user.name === username);

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

module.exports = { addUser, getUser, getUsersInRoom, setReadyToPlay, checkAllReadyToPlay, scheduleRemoveUser, removeUserByUsername };