let games = [];

const addGame = (room, users) => {
  
  console.log('room', room)
  console.log('find anything?', games.find((game) => game.id == room))
  if (games.find((game) => game.id == room)) {
    console.log('already started game with id', room)
    return;
  }
  const newCards = [];
  users.map((user, i) => {
    const card = {
      startTurnIndex: i,
      currentTurnIndex: i,
      steps: [],
      submitted: false,
    }
    newCards.push(card);
  })
  const newGame = {
    id: room,
    cards: newCards,
    newRound: false,
    finishedGame: false,
  }
  games.push(newGame)
  console.log('games', games);
  console.log('users', users)
  return games;
}

const restartGame = (room, users) => {
  const gameToRemove = games.findIndex((game) => game.id == room);
  console.log('game to remove', gameToRemove)
  if (gameToRemove === -1) {
    return
  }
  console.log('games length', games.length)
  games.splice(gameToRemove, 1);
  console.log('games length after', games.length)
  users.map((u) => {
    u.answerSubmitted = false;
  })
  return games;
}

const getGame = (id) => games.find((game) => game.id === id);

const updateCard = (room, word, startTurnIndex, numOfUsers, users) => {
  let game = games.find((game) => game.id === room);
  let card = game.cards.find((card) => card.startTurnIndex === startTurnIndex);
  card.steps.push(word);
  card.submitted = true;
  console.log('updated games?')
  console.log(games)
  // if all cards.steps are greater than zero and are the same length and the length is less than the number of users
  // then increment each card's currentTurnIndex by 1 and mod it by the number of users
  const allCardsStepsGreaterThanZero = game.cards.filter((card) => card.steps.length > 0).length === numOfUsers;
  const firstLength = game.cards[0].steps.length;
  const allCardsHaveSameNumOfSteps = game.cards.every((card) => card.steps.length === firstLength);
  const notFinished = game.cards[0].steps.length < numOfUsers;
  console.log('all cards steps greater than zero', allCardsStepsGreaterThanZero)
  console.log('all cards have same num of steps', allCardsHaveSameNumOfSteps)
  console.log('not finished', notFinished)
  if (allCardsStepsGreaterThanZero && allCardsHaveSameNumOfSteps && notFinished) {
    game.cards.map((card) => {
      card.currentTurnIndex = (card.currentTurnIndex + 1) % numOfUsers;
      card.submitted = false;
    })
    game.newRound = true;
    users.map((u) => {
      u.answerSubmitted = false;
    })
  } else if (allCardsStepsGreaterThanZero && allCardsHaveSameNumOfSteps && !notFinished) {
    console.log('game is finished')
    game.finishedGame = true;
    users.map((u) => {
      u.answerSubmitted = false;
    })
  } else {
    game.newRound = false;
  }
  return game
}

const removeGame = (room) => {
  const index = games.findIndex((game) => game.id === room);

  if (index !== -1) {
    console.log('games before deleting', games)
    games.splice(index, 1)[0];
    console.log('games after deleting', games)
  }
}

module.exports = { addGame, getGame, updateCard, restartGame, removeGame };