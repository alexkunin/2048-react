import React from 'react';
import './App.css';
import { Board } from './Board';
import { Cell } from './Cell';
import { State } from './State';

class Game extends React.Component {
  state = new State();

  onKeyDown = this.handler.bind(this);

  handler(event) {
    switch (event.code) {
      case 'ArrowUp':
        this.state.move({ y: -1 });
        break;
      case 'ArrowDown':
        this.state.move({ y: +1 });
        break;
      case 'ArrowLeft':
        this.state.move({ x: -1 });
        break;
      case 'ArrowRight':
        this.state.move({ x: +1 });
        break;
      default:
        return;
    }
    this.forceUpdate();
    setTimeout(() => {
      this.state.addRandomCell();
      this.forceUpdate();
    }, 300);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
  }

  render() {
    return (
      <Board
        width={ this.state.width }
        height={ this.state.height }
      >
        { [ ...this.state.getNonEmptyCells() ].map(({ x, y, value, id }) => <Cell key={ id } x={ x } y={ y } value={ value }/>) }
      </Board>
    );
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }
}

export default Game;