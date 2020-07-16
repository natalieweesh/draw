import React, { useState, useEffect } from 'react';
import Canvas from '../Canvas/Canvas';
import './Game.css';

const Game = ({ game, user, submitWord, newRound, finishedGame, users }) => {
  const card = game.find((card) => card.currentTurnIndex === user.orderIndex);
  const previousStep = card.steps.length > 0 ? card.steps[card.steps.length - 1] : 'start by writing a random word or phrase!';
  const nextStep = card.steps.length % 2 === 0 ? 'word' : 'drawing';
  const [word, setWord] = useState('');
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (!!newRound) {
      setSubmitted(false)
      setWord('')
    }
  }, [newRound])
  useEffect(() => {
    if (finishedGame) {
      setSubmitted(false)
      setWord('')
    }
  }, [finishedGame])
  const submit = (event) => {
    event.preventDefault()
    if (word.trim().length > 0) {
      submitWord(event, word, card.startTurnIndex)
      setSubmitted(true);
    }
  }
  return (
    <div className="container game">
      {finishedGame ? (
        <div className="gameOver">
          {game.map((card, j) => {
            return <div className='mb-20'>
              <h1>{`${users.find((user) => user.orderIndex === card.startTurnIndex).name}'s chain:`}</h1>
              <ol>
              {card.steps.map((step, i) => {
                if (step.includes('3.6.3')) {
                  return <li><Canvas className={'no-draw'} id={`${j}-canvas-${i}`} json={step} /></li>
                } else {
                  return <li><span>{step}</span></li>
                }
              })}
            </ol></div>
          })}
        </div>
      ) : (
      <div>
        {submitted ? (
          <div>
            <p>waiting for other players' submissions</p>
          </div>
        ) : (
          <div>
            {previousStep.includes('start by writing') ? '' : `now transform this into a ${nextStep === 'word' ? `word or phrase` : nextStep}:`}
            {previousStep.includes('3.6.3') ? (
              <Canvas className='no-draw' id='previous-drawing' json={previousStep} />
            ) : (<p className="previousStep">{previousStep}</p>)}
            
            {nextStep === 'word' && (
              <form className="form">
                <input className="input" type="text" placeholder="" value={word}
                onChange={(event) => setWord(event.target.value)}
                onKeyPress={(event) => event.key === 'Enter' ? submit(event) : null } />
                <button className="sendButton sendButtonSmall" onClick={(event) => submit(event)}>Send</button>
              </form>
            )}
            {nextStep === 'drawing' && (
              <Canvas id="drawing-canvas" submitImage={(event, drawing) => {
                submitWord(event, drawing, card.startTurnIndex)
                setSubmitted(true);
              }} />
            )}
          </div>
        )}
      </div>
      )}
    </div>
  )
};

export default Game;