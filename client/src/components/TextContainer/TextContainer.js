import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users, game, finishedGame }) => {
  let currentRound, totalRounds, gameOver;
  if (game.length > 0) {
    totalRounds = game.length;
    if (game.find((g) => !g.submitted)) {
      currentRound = game.find((g) => !g.submitted).steps.length + 1
    }
  }
  return (
    <div className="textContainer">
      {
        users
          ? (
            <div>
              <p>{currentRound && totalRounds && `Round ${currentRound} of ${totalRounds}`}</p>
              {game.length > 0 ? (finishedGame ? "Game Over" : "Submitted?") : "Currently playing:"}
              <div className="activeContainer">
                <h4>
                  {users.map((user) => {
                    let card;
                    if (game.length) {
                      card = game.find((c) => c.currentTurnIndex == user.orderIndex)
                    }
                    return <div key={user.name} className="activeItem">
                      {user.name}
                      {((card && card.submitted) || (game.length === 0 && user.readyToPlay)) && <img alt="Online Icon" src={onlineIcon}/>}
                    </div>
                  })}
                </h4>
              </div>
            </div>
          )
          : null
      }
    </div>
  );
}


export default TextContainer;