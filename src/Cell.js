import React from 'react';

export class Cell extends React.Component {
  render() {
    return (
      <div
        className={ 'cell v' + this.props.value + ' + w' + Math.floor(Math.log10(this.props.value) + 1) }
        style={ { left: this.props.x + 'em', top: this.props.y + 'em' } }
      >
        <i>{ this.props.value }</i>
      </div>
    );
  }
}