import React from 'react';
import { fabric } from 'fabric';

import './Canvas.css';

class Canvas extends React.Component {
  state = {
    canvas: null,
    eraserMode: false,
  }
  componentDidMount() {
    if (this.props.json) {
      this.state.canvas = new fabric.StaticCanvas(this.props.id, {width: 375, height: 375, backgroundColor: 'white', allowTouchScrolling: true})
      this.state.canvas.loadFromJSON(this.props.json)
    } else {
      this.state.canvas = new fabric.Canvas(this.props.id, {isDrawingMode: true, width: 375, height: 375, backgroundColor: 'white', interactive: false, stateful: false});
      this.state.canvas.freeDrawingBrush = new fabric.PencilBrush(this.state.canvas);
      this.state.canvas.freeDrawingBrush.width = 1;
      this.state.canvas.freeDrawingBrush.color = '#000000';
    }
  }

  render() {
    const { submitImage, json, id, className, playground } = this.props;
   
    return <div className={`textContainer ${className}`}>
      <canvas id={id} />
      {json ? (
         null
      ) : (
        <div className="buttonsRow">
          <button className="clearButton" onClick={() => {
            this.state.canvas.clear();
              this.state.canvas.freeDrawingBrush.width = 1;
              this.state.canvas.freeDrawingBrush.color = '#000000';
            this.setState({eraserMode: false});
          }}>clear</button>
          <button className="undoButton" onClick={() => {
            let prevState = this.state.canvas.toJSON();
            prevState.objects.splice(prevState.objects.length - 1, 1)
            this.state.canvas.loadFromJSON(prevState)
          }}>undo</button>
          <button className="eraserButton" onClick={() => {
            if (this.state.eraserMode) {
              this.state.canvas.freeDrawingBrush.width = 1;
              this.state.canvas.freeDrawingBrush.color = '#000000';
            } else {
              this.state.canvas.freeDrawingBrush.width = 15;
              this.state.canvas.freeDrawingBrush.color = '#ffffff';
            }
            this.setState({eraserMode: !this.state.eraserMode})
          }}>{this.state.eraserMode ? <span>stop<br/>erasing</span> : <span>use<br/>eraser</span>}</button>
          {!playground && <button onClick={(e) => {
            submitImage(e, JSON.stringify(this.state.canvas.toJSON()))
          }}>submit drawing</button>}
        </div>
      )}
    </div>
  }
}

export default Canvas;