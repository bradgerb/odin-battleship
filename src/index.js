class Ship {
    constructor(length) {
        this.length = length;
        this.hits = 0;
    }

    hit() {
        this.hits++;
        return this.hits
    }

    isSunk() {
        if (this.hits >= this.length) {
            return true
        }
        return false
    }
}

class Gameboard {
    constructor() {
        this.rows = 10;
        this.columns = 10;
        this.board = [];

        for (let i = 0; i < this.rows; i++) {
            this.board[i] = new Array(this.columns).fill(null)
        }
    }

    placeShip(name, [rowStart, columnStart], [rowEnd, columnEnd]) {
        let shipLength = 0;
        let orientation = 'none';
        
        if(this.#checkValidPlacement([rowStart, columnStart], [rowEnd, columnEnd])){            
            if (rowStart === rowEnd) {
                orientation = 'horizontal';
                shipLength = Math.abs(columnEnd - columnStart) + 1;
            } else {
                orientation = 'vertical';
                shipLength = Math.abs(rowEnd - rowStart) + 1;
            };

            name = new Ship(shipLength);

            if (orientation === 'horizontal') {
                for (let i = 0; i < shipLength; i++) {
                    this.board[rowStart][columnStart + i] = name;
                }
            } else {
                for (let i = 0; i < shipLength; i++) {
                    this.board[rowStart + i][columnStart] = name;
                }
            }
            
        };
    }

    #checkValidPlacement([rowStart, columnStart], [rowEnd, columnEnd]) {
        if (rowStart < 0 || columnStart < 0 || rowEnd < 0 || columnEnd < 0) {
            return false
        }
        if (rowStart > this.rows || columnStart > this.columns || rowEnd > this.rows || columnEnd > this.columns) {
            return false
        }
        if (rowStart != rowEnd && columnStart != columnEnd) {
            return false
        }
        return true
    }
}

// eslint-disable-next-line no-undef
module.exports = { Ship, Gameboard }