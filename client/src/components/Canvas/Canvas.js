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
      this.state.canvas = new fabric.Canvas(this.props.id, {width: 400, height: 400, backgroundColor: 'white'})
      this.state.canvas.loadFromJSON(this.props.json)
    } else {
      this.state.canvas = new fabric.Canvas(this.props.id, {isDrawingMode: true, width: 400, height: 400, backgroundColor: 'white'});
    }
  }

  render() {
    const { submitImage, json, id } = this.props;
   
    return <div className="textContainer">
      <canvas id={id} />
      {json ? (
         null
      ) : (
        <div className="buttonsRow">
          <button className="clearButton" onClick={() => {
            this.state.canvas.clear();
          }}>clear</button>
          <button onClick={(e) => {
            console.log('drawing to save:', JSON.stringify(this.state.canvas.toJSON()))
            submitImage(e, JSON.stringify(this.state.canvas.toJSON()))
          }}>save drawing</button>
        </div>
      )}
    </div>
  }
}

export default Canvas;