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
        this.shotsFired = {};
        this.shipsOnBoard = [];
        for (let i = 0; i < this.rows; i++) {
            this.board[i] = new Array(this.columns).fill(null)
        }
    }

    placeShip(name, [rowStart, columnStart], [rowEnd, columnEnd]) {
        let shipLength = 0;
        let orientation = 'none';
        
        try {(this.#checkValidPlacement([rowStart, columnStart], [rowEnd, columnEnd]))            
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
                    this.shipsOnBoard.push(name);
                }
            } else {
                for (let i = 0; i < shipLength; i++) {
                    this.board[rowStart + i][columnStart] = name;
                    this.shipsOnBoard.push(name);

                }
            }
        } catch ({name, message}) {
            console.log(name);
            console.log(message);
            return false
        }
    }

    #checkValidPlacement([rowStart, columnStart], [rowEnd, columnEnd]) {
        if (rowStart < 0 || columnStart < 0 || rowEnd < 0 || columnEnd < 0) {
            throw new Error('Coordinate must be within bounds');
        }
        if (rowStart > this.rows || columnStart > this.columns || rowEnd > this.rows || columnEnd > this.columns) {
            throw new Error('Coordinate must be within bounds');
        }
        if (rowStart != rowEnd && columnStart != columnEnd) {
            throw new Error('Ships must be placed fully vertical or horizontal');
        }
        if (rowStart === rowEnd) {
            for(let i = 0; i < Math.abs(columnEnd - columnStart); i++) {
                if (this.board[rowStart][columnStart + i] != null) {
                    throw new Error('Ships may not be stacked');
                }
            }
        } else {
            for(let i = 0; i < Math.abs(rowEnd - rowStart); i++) {
                if (this.board[rowStart + i][columnStart] != null) {
                    throw new Error('Ships may not be stacked');
                }
            }
        }
        return true
    }

    receiveAttack([letter, rowNumber]) {
        try {(this.#checkValidAttack(letter, rowNumber))
            let coordinate = [rowNumber, this.#letterToCoordinate(letter)];
            
            if(this.board[rowNumber][this.#letterToCoordinate(letter)] != null) {
                //shotsFired hash - (row * 10) + column
                this.shotsFired[(rowNumber * 10) + this.#letterToCoordinate(letter)] = 'hit';
                this.board[rowNumber][this.#letterToCoordinate(letter)].hit();
            } else {
                this.shotsFired[(rowNumber * 10) + this.#letterToCoordinate(letter)] = 'miss';
            }
            return coordinate
        } catch ({name, message}) {
            console.log(name);
            console.log(message);
            return false
        }
    }

    #checkValidAttack(letter, rowNumber) {
        let validLetters = 'abcdefghij'

        if(letter.length != 1) {
            throw new Error('Only enter one letter');
        }
        if(!validLetters.includes(letter.toLowerCase())) {
            throw new Error('Invalid letter');
        }
        if(rowNumber < 0 || rowNumber > this.rows) {
            throw new Error('Number must be within bounds');
        }
        if(this.shotsFired[(rowNumber * 10) + this.#letterToCoordinate(letter)]) {
            throw new Error('That square has already been fired upon');
        }
        return true
    }

    #letterToCoordinate(letter) {
        return letter.toLowerCase().charCodeAt(0) - 97;
    }

    allSunk() {
        for(let i = 0; i < this.shipsOnBoard.length; i++) {
            if(!this.shipsOnBoard[i].isSunk()) {
                return false
            }
        }
        return true
    }
}

class Player {
    constructor(name, controlType, number) {
        this.name = name;
        this.board = new Gameboard;
        this.score = 0;
        this.controlType = controlType;
        this.number = number;
    }

    rename(newName) {
        this.name = newName;
    }

    win() {
        this.score++;
        return this.score
    }
}

// eslint-disable-next-line no-undef
module.exports = { Ship, Gameboard, Player }