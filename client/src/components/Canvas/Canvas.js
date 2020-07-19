import React from 'react';
import { fabric } from 'fabric';

import './Canvas.css';

class Canvas extends React.Component {
  state = {
    canvas: null,
  }
  componentDidMount() {
    if (this.props.json) {
      this.state.canvas = new fabric.StaticCanvas(this.props.id, {width: 300, height: 300, backgroundColor: 'white', allowTouchScrolling: true})
      this.state.canvas.loadFromJSON(this.props.json)
    } else {
      this.state.canvas = new fabric.Canvas(this.props.id, {isDrawingMode: true, width: 300, height: 300, backgroundColor: 'white'});
    }
  }

  render() {
    const { submitImage, json, id, className } = this.props;
   
    return <div className={`textContainer ${className}`}>
      <canvas id={id} />
      {json ? (
         null
      ) : (
        <div className="buttonsRow">
          <button onClick={(e) => {
            submitImage(e, JSON.stringify(this.state.canvas.toJSON()))
          }}>submit drawing</button>
        </div>
      )}
    </div>
  }
}

export default Canvas;