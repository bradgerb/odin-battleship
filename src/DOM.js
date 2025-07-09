import { Player } from './player.js';

const playerOneBoard = document.querySelector('.one');
const playerTwoBoard = document.querySelector('.two');

const createBoard = (board)=> {
    for(let i = 0; i < 11; i++) {
        for(let j = 0; j < 11; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            let boardNumber = 0;

            if (board.classList.contains('one')) {
                boardNumber = 1;
            } else {
                boardNumber = 2;
            }

            //cell hash - board number, column letter, row number
            if (i === 0 && j != 0) {
                cell.textContent = `${String.fromCharCode(j + 64)}`;
            } else if (i != 0 && j === 0) {
                cell.textContent = `${i}`;
            } else if (i != 0 && j != 0) {
                cell.setAttribute('id', `${boardNumber}${String.fromCharCode(j + 64)}${i}`);
            }

            board.appendChild(cell);
        }
    }
}

const gameController = ()=> {

    //player creation
    const playerOne = new Player('Bob', 'human', 1);
    const playerTwo = new Player('Not Bob', 'ai', 2);

    //ship placement
    placeNewShip(playerOne, 'carrier', [0, 0], [0, 4]);
    placeNewShip(playerOne, 'battleship', [2, 3], [5, 3]);
    placeNewShip(playerOne, 'destroyer', [9, 1], [9, 3]);
    placeNewShip(playerOne, 'submarine', [5, 5], [7, 5]);
    placeNewShip(playerOne, 'patrol boat', [3, 7], [4, 7]);

    placeNewShip(playerTwo, 'carrier', [1, 0], [1, 4]);
    placeNewShip(playerTwo, 'battleship', [5, 4], [5, 7]);
    placeNewShip(playerTwo, 'destroyer', [9, 7], [9, 9]);
    placeNewShip(playerTwo, 'submarine', [1, 8], [3, 8]);
    placeNewShip(playerTwo, 'patrol boat', [7, 2], [8, 2]);

    //game logic
    const allCells = document.querySelectorAll('.cell')
    for (let i = 0; i < allCells.length; i++) {
        allCells[i].addEventListener('click', ()=> {
            playTurn(allCells[i].id);
        });
    }

    let currentPlayer = 1;
    let playerBoard;

    const playTurn = (id)=> {
        let boardAttacked = parseInt(id.charAt(0));
        let cell = id.slice(1);
        let letter = cell.charAt(0);
        let number = parseInt(cell.slice(1)) - 1;

        if (boardAttacked === 1) {
            playerBoard = playerOne;
        } else {
            playerBoard = playerTwo;
        }

        if (boardAttacked != currentPlayer) {
            if (playerBoard.board.receiveAttack([letter, number])) {
                shotsFiredBoardUpdate(playerBoard, letter, number);

                if (playerBoard.board.allSunk()) {
                    if (currentPlayer === 1) {
                        console.log('Player 1 wins!')
                    } else {
                        console.log('Player 2 wins!')
                    }
                }

                switchPlayer();
            }
        }
    }

    const switchPlayer = ()=> {
        if (currentPlayer === 1) {
            currentPlayer = 2;
        } else {
            currentPlayer = 1;
        }
    }

    const shotsFiredBoardUpdate = (board, letter, number)=> {
        let cellID = `${board.number}${letter}${number + 1}`
        let shotsFiredHash = (number * 10) + letter.toLowerCase().charCodeAt(0) - 97
        const activeCell = document.getElementById(`${cellID}`);
        const display = document.querySelector('.textDisplay');

        if(board.board.shotsFired[shotsFiredHash] === 'hit') {
            activeCell.classList.add('hitCell');
            display.textContent = 'You hit!'
        } else {
            activeCell.classList.add('missedCell');
            display.textContent = 'You missed.'
        }
    }
}

const placeNewShip = (player, shipName, [rowStart, columnStart], [rowEnd, columnEnd])=> {
    player.board.placeShip(shipName, [rowStart, columnStart], [rowEnd, columnEnd]);

    for(let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if(player.board.board[i][j]) {
                let cellHash = '';
                cellHash += player.number;
                cellHash += coordinateToHash([i, j]);

                const targetCell = document.getElementById(cellHash);
                targetCell.classList.add('containsShip');
            }
        }
    }
}

const coordinateToHash = (coordinate)=> {
    let row = coordinate[0];
    let column = String.fromCharCode(coordinate[1] + 65);
    let hash = `${column}${row + 1}`

    return hash
}

createBoard(playerOneBoard);
createBoard(playerTwoBoard);

export { gameController }