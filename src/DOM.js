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
    placeNewShip(playerOne, 'battleship', [0, 0], [0, 4]);
    placeNewShip(playerTwo, 'battleship', [1, 0], [1, 4]);
    console.log(playerOne);
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