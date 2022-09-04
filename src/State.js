export class State {
  width = 4;
  height = 4;
  currentCells = Array.from({ length: this.width * this.height }).map(() => null);
  previousCells = [ ...this.currentCells ];
  nextId = 1;
  listeners = new Set();
  locked = false;

  subscribe(cb) {
    this.listeners.add(cb);
    return { unsubscribe: () => this.listeners.delete(cb) };
  }

  emit() {
    const mapCells = cells => new Map(cells.flatMap((cell, i) =>
      cell
        ? [ [ cell.id, { cell, coords: this.indexToCoords(i) } ] ]
        : [],
    ));

    const before = mapCells(this.previousCells);
    const after = mapCells(this.currentCells);
    const state = [];

    before.forEach(({ cell, coords }, id) => {
      if (!after.has(id)) {
        state.push({ cell, from: coords, to: null });
      }
    });

    after.forEach(({ cell, coords }, id) => {
      state.push({ cell, from: before.get(id)?.coords ?? null, to: coords });
    });

    this.previousCells = [ ...this.currentCells ];
    this.listeners.forEach(cb => cb(state));
  }

  addRandomCell() {
    const freeIndices = this.currentCells.map((v, i) => v === null ? i : null).filter(v => v !== null);
    if (freeIndices.length > 0) {
      const index = freeIndices[Math.floor(Math.random() * freeIndices.length)];
      this.currentCells[index] = { id: this.nextId++, value: 2 };
      this.emit();
    }
  }

  move({ x, y }) {
    if (this.locked) {
      return;
    }

    const newCells = [ ...this.currentCells ];

    const getRow = y => Array.from({ length: this.width }).map((_, x) => newCells[x + y * this.width]);
    const getColumn = x => Array.from({ length: this.height }).map((_, y) => newCells[x + y * this.width]);
    const setRow = (y, cells) => Array.from({ length: this.width }).forEach((_, x) => newCells[x + y * this.width] = cells[x]);
    const setColumn = (x, cells) => Array.from({ length: this.height }).forEach((_, y) => newCells[x + y * this.width] = cells[y]);
    const collapse = (cells, reverse) => {
      const newCells = [];

      for (const cell of reverse ? cells.reverse() : cells) {
        if (cell) {
          if (newCells.length > 0 && newCells[newCells.length - 1].value === cell.value) {
            newCells[newCells.length - 1].value <<= 1;
          } else {
            newCells.push({ ...cell });
          }
        }
      }

      while (newCells.length < cells.length) {
        newCells.push(null);
      }

      return reverse ? newCells.reverse() : newCells;
    };

    if (!x && !y) {
      return;
    }

    const maxI = x ? this.height : this.width;
    const getCells = x ? getRow : getColumn;
    const setCells = x ? setRow : setColumn;
    const shouldReverse = x ? x > 0 : y > 0;

    for (let i = 0; i < maxI; i++) {
      setCells(i, collapse(getCells(i), shouldReverse));
    }

    this.currentCells = newCells;
    this.emit();

    this.locked = true;
    setTimeout(() => {
      this.locked = false;
      this.addRandomCell();
    }, 250);
  }

  indexToCoords(index) {
    return { x: index % this.width, y: Math.floor(index / this.width) };
  }
}
