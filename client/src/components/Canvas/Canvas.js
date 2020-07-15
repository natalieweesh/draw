import React from 'react';
import { fabric } from 'fabric';

import './Canvas.css';

class Canvas extends React.Component {
  state = {
    canvas: null,
  }
  componentDidMount() {
    if (this.props.json) {
      console.log('the id', this.props.id)
      console.log("THE JSON", this.props.json)
      this.state.canvas = new fabric.Canvas(this.props.id, {width: 300, height: 300, backgroundColor: 'white'})
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
          <button className="clearButton" onClick={() => {
            this.state.canvas.clear();
          }}>clear</button>
          <button className="undoButton" onClick={() => {
            let prevState = this.state.canvas.toJSON();
            prevState.objects.splice(prevState.objects.length - 1, 1)
            this.state.canvas.loadFromJSON(prevState)
          }}>undo</button>
          <button onClick={(e) => {
            console.log('drawing to save:', JSON.stringify(this.state.canvas.toJSON()))
            submitImage(e, JSON.stringify(this.state.canvas.toJSON()))
          }}>submit drawing</button>
        </div>
      )}
    </div>
  }
}

export default Canvas;