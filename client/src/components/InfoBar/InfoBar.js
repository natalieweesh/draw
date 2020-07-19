import React from 'react';

import closeIcon from '../../icons/closeIcon.png';

import './InfoBar.css';

const InfoBar = ({ room }) => (
  <div className="infoBar">
    <div className="leftInnerContainer">
      <div className="greenDot"></div>
      <h3>{room}</h3>
    </div>
    <div className="rightInnerContainer">
      <a href="/">EXIT GAME&nbsp;<img src={closeIcon} alt="close" /></a>
    </div>
  </div>
);

export default InfoBar;