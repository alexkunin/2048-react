import React from 'react';
import './Cell.css';

export class Cell extends React.Component {
  render() {
    const className = 'cell v' + this.props.value + ' + w' + Math.floor(Math.log10(this.props.value) + 1);
    const style = {
      transition: `transform 0.25s ease-in-out, opacity 0.25s ease-in-out`,
      transform: `translate(${ this.props.x }em, ${ this.props.y }em)`,
      opacity: this.props.opacity,
    };
    return (
      <div className={ className } style={ style }>
        <i>{ this.props.value }</i>
      </div>
    );
  }
}