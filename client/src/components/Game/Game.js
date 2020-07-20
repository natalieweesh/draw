import React, { useState, useEffect } from 'react';
import Canvas from '../Canvas/Canvas';
import './Game.css';

const Game = ({ game, user, submitWord, newRound, finishedGame, users }) => {
  const card = game.find((card) => card.currentTurnIndex === user.orderIndex);
  const previousStep = card.steps.length > 0 ? card.steps[card.steps.length - 1] : 'start by writing a random word or phrase!';
  const nextStep = card.steps.length % 2 === 0 ? 'word' : 'drawing';
  const [word, setWord] = useState('');
  const [submitted, setSubmitted] = useState(user.answerSubmitted);

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
            return <div className='mb-20' key={j}>
              <h1>{`${users.find((user) => user.orderIndex === card.startTurnIndex).name}'s chain:`}</h1>
              <div>
              {card.steps.map((step, i) => {
                if (step.includes('data:image')) {
                  return <div className="step" key={i}><span>{i+1}.</span><Canvas className={'no-draw'} id={`${j}-canvas-${i}`} json={step} /></div>
                } else {
                  return <div className="step" key={i}><div><span>{i+1}.</span><span className="bigger">{step}</span></div></div>
                }
              })}
            </div></div>
          })}
        </div>
      ) : (
      <div>
        {submitted ? (
          <div>
            <p className="paddedGame">waiting for other players' submissions</p>
          </div>
        ) : (
          <div>
            <span className="pb-2">{previousStep.includes('start by writing') ? '' : `now transform this into a ${nextStep === 'word' ? `word or phrase` : nextStep}:`}</span>
            {previousStep.includes('data:image') ? (
              <Canvas className='no-draw' id='previous-drawing' json={previousStep} />
            ) : (<p className="previousStep paddedGame">{previousStep}</p>)}
            
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