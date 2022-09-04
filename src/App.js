import React from 'react';
import './App.css';

class State {
  width = 4;
  height = 4;
  cells = Array.from({ length: this.width * this.height }).map(() => null);
  nextId = 1;

  constructor() {
    this.addRandomCell();
  }
  
  addRandomCell() {
    const freeIndices = this.cells.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (freeIndices.length > 0) {
      const index = Math.floor(Math.random() * freeIndices.length);
      this.cells[freeIndices[index]] = { value: 2, id: this.nextId++ };
    }
  }
  
  *getNonEmptyCells() {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.width; y++) {
        const cell = this.cells[x + y * this.width];
        if (cell) {
          yield { x, y, ...cell };
        }
      }
    }
  }
  
  getRow(index) {
    return Array.from({ length: this.width }).map((_, i) => this.cells[i + index * this.width]);
  }
  
  setRow(index, values) {
    Array.from({ length: this.width }).forEach((_, i) => this.cells[i + index * this.width] = values[i]);
  }
  
  getColumn(index) {
    return Array.from({ length: this.height }).map((_, i) => this.cells[index + i * this.height]);
  }
  
  setColumn(index, values) {
    return Array.from({ length: this.height }).forEach((_, i) => this.cells[index + i * this.height] = values[i]);
  }
  
  collapse(index, cells) {
    const newCells = [];
    
    for (const cell of cells) {
      if (cell) {
        if (newCells.length > 0 && newCells[newCells.length - 1].value === cell.value) {
          cell.value *= 2;
          newCells[newCells.length - 1] = cell;
        } else {
          newCells.push(cell);
        }
      }
    }
    
    while (newCells.length < cells.length) {
      newCells.push(null);
    }

    return newCells;
  }
  
  move({ x, y}) {
    if (x) {
      for (let i = 0; i < this.height; i++) {
        let cells = this.getRow(i);
        if (x > 0) {
          cells = cells.reverse();
        }
        cells = this.collapse(i, cells);
        if (x > 0) {
          cells = cells.reverse();
        }
        this.setRow(i, cells);
      }
    } else if (y) {
      for (let i = 0; i < this.width; i++) {
        let cells = this.getColumn(i);
        if (y > 0) {
          cells = cells.reverse();
        }
        cells = this.collapse(i, cells);
        if (y > 0) {
          cells = cells.reverse();
        }
        this.setColumn(i, cells);
      }
    }
  }
}

class Board extends React.Component {
  render() {
    return (
      <div
        className="board"
        style={ { width: this.props.width + 'em', height:this.props.height + 'em' } }
      >
        { this.props.children }
      </div>
    );
  }
}

class Cell extends React.Component {
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
        { [...this.state.getNonEmptyCells()].map(({ x, y, value, id }) => <Cell key={ id } x={ x } y={ y } value={ value } />) }
      </Board>
    );
  }
  
  componentWillUnmount() {
    window.removeEventListener('keydown', this.onKeyDown);
  }
}

export default Game;