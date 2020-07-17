import React from 'react';

import onlineIcon from '../../icons/onlineIcon.png';

import './TextContainer.css';

const TextContainer = ({ users, game }) => {
  return (
    <div className="textContainer">
      {
        users
          ? (
            <div>
              <h3>Currently playing:</h3>
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