import React from 'react';
import { Board } from './Board';
import { Cell } from './Cell';
import { State } from './State';

class Game extends React.Component {
  state = new State();
  onKeyDown = this.handler.bind(this);
  stateSubscription = null;
  cells = [];

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
  }

  componentDidMount() {
    window.addEventListener('keydown', this.onKeyDown);
    this.stateSubscription = this.state.subscribe(cells => {
      this.cells = [ ...cells ].sort((a, b) => a.cell.id - b.cell.id);
      this.forceUpdate();
    });
    this.state.addRandomCell();
  }

  render() {
    return (
      <Board
        width={ this.state.width }
        height={ this.state.height }
      >
        { this.cells.map(({ cell: { id, value }, from, to }) => {
          if (!to) {
            return <Cell key={ id } x={ from.x } y={ from.y } value={ value } opacity={ 0 }/>;
          } else {
            return <Cell key={ id } x={ to.x } y={ to.y } value={ value } opacity={ 1 }/>;
          }
        }) }
      </Board>
    );
  }

  componentWillUnmount() {
    this.stateSubscription.unsubscribe();
    this.stateSubscription = null;
    window.removeEventListener('keydown', this.onKeyDown);
  }
}

export default Game;