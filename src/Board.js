import React from 'react';

export class Board extends React.Component {
  render() {
    return (
      <div
        className="board"
        style={ { width: this.props.width + 'em', height: this.props.height + 'em' } }
      >
        { this.props.children }
      </div>
    );
  }
}