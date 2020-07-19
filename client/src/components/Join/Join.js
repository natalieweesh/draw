import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import closeIcon from '../../icons/closeIcon.png';
import donut from '../../examples/donut.png';
import hotdog from '../../examples/hotdog.jpg';
import neo from '../../examples/neo.png';
import party from '../../examples/party.jpg';
import rabbit from '../../examples/rabbit.png';
import saint from '../../examples/saint.png';
import venus from '../../examples/venus.jpg';
import Canvas from '../Canvas/Canvas';
import './Join.css';

const Join = () => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [modal, setModal] = useState('');

  return (
    <div className="joinOuterContainer">
      <div className="joinInnerContainer">
        <h1 className="heading">Telephone Pictionary</h1>
        <form>
        <div><input className="joinInput" placeholder="Name" type="text" onChange={(event) => setName(event.target.value)} /></div>
        <div><input className="joinInput mt-20" placeholder="Room" type="text" onChange={(event) => setRoom(event.target.value)} /></div>
        <Link onClick={event => (!name || !room) ? event.preventDefault() : null} to={`/chat?name=${name}&room=${room}`}>
          <button className="button mt-20" type="submit">Sign In</button>
        </Link>
        <div className="extraButtonsRow mt-20">
          <button className="button" onClick={(e) => {
            e.preventDefault();
            setModal('rules')
          }}>How to play</button>
          <button className="button ml-20" onClick={(e) => {
            e.preventDefault();
            setModal('pictures')
          }}>Hall of fame</button>
        </div>
        </form>
        <p className="mt-20 disclaimer">Try drawing something!</p>
        <Canvas className="playground-canvas" id="drawing-canvas" playground={true} />
      </div>
      {modal && <div className="modal">
        <button className="button closeModal" onClick={(e) => {
          e.preventDefault();
          setModal('');
        }}><img src={closeIcon} alt="close" /></button>
        {modal === 'rules' ? (
          <div className="instructions">
            <h3>How to play!</h3>
            <p>every player starts by writing a random word or phrase</p>
            <p>then you pass your word onto the next person</p>
            <p>now every person has to draw the word they were given</p>
            <p>then pass your drawing onto the next person</p>
            <p>you keep drawing or writing and passing to the next person</p>
            <p>until your original word comes back to you</p>
            <p>and we get to see how your word was translated from person to person</p>
          </div>
        ) : (
          <div className="images">
            <p>Hall of fame</p>
            <img src={donut} alt="donut" />
            <img src={hotdog} alt="hotdog" />
            <img src={neo} alt="neo" />
            <img src={party} alt="party" />
            <img src={rabbit} alt="rabbit" />
            <img src={saint} alt="saint" />
            <img src={venus} alt="venus" />
          </div>
        )}
      </div>}
    </div>
  )   
}

export default Join;