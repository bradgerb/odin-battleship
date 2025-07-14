import { Player } from './player.js';

const playerOneBoard = document.querySelector('.one');
const playerTwoBoard = document.querySelector('.two');
const newGameButton = document.querySelector('.newGame');
const resetGameButton = document.querySelector('.resetGame');

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
    const placeAllShips = ()=> {
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
    }
    placeAllShips();

    //game logic
    const allCells = document.querySelectorAll('.cell')
    for (let i = 0; i < allCells.length; i++) {
        allCells[i].addEventListener('click', ()=> {
            playTurn(allCells[i].id);
        });
    }

    let currentPlayer = 1;
    let playerBoard;
    let turnsEnabled = true;

    const playTurn = (id)=> {
        if(turnsEnabled) {
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

                    allSunkCheck();
                    switchPlayer();

                    if (playerBoard.controlType === 'ai') {
                        playComputerTurn();
                    }
                }
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
        let display;

        if (board.number === 2) {
            display = document.querySelector('.playerOneMessage');
        } else {
            display = document.querySelector('.playerTwoMessage');
        }
        

        if(board.board.shotsFired[shotsFiredHash] === 'hit') {
            activeCell.classList.add('hitCell');
            display.textContent = 'You hit!'
        } else {
            activeCell.classList.add('missedCell');
            display.textContent = 'You missed.'
        }
    }

    const allSunkCheck = ()=> {
        let scoreText;
        let playerOneMessage = document.querySelector('.playerOneMessage');
        let playerTwoMessage = document.querySelector('.playerTwoMessage');

        if (currentPlayer === 1) {
            if (playerTwo.board.allSunk()) {
                playerOne.win();
                scoreText = document.querySelector('.playerOneScore');
                scoreText.textContent = `Player 1 score: ${playerOne.score}`
                playerOneMessage.textContent = 'You win!';
                playerTwoMessage.textContent = 'You lose';
                turnsEnabled = false;
            }
        } else {
            if (playerOne.board.allSunk()) {
                playerTwo.win();
                scoreText = document.querySelector('.playerTwoScore');
                scoreText.textContent = `Player 2 score: ${playerTwo.score}`
                playerOneMessage.textContent = 'You lose';
                playerTwoMessage.textContent = 'You win!';
                turnsEnabled = false;
            }
        }
    }

    const playComputerTurn = ()=> {
        if (turnsEnabled) {
            let row = Math.floor(Math.random() * 10);
            let column = Math.floor(Math.random() * 10);
            let hash = (row * 10) + column;

            while (playerOne.board.shotsFired[hash]) {
                row = Math.floor(Math.random() * 10);
                column = Math.floor(Math.random() * 10);
                hash = (row * 10) + column;
            }
            
            let letter = letterFromCoordinate(column);

            playerOne.board.receiveAttack([letter, row]);
            shotsFiredBoardUpdate(playerOne, letter, row);

            allSunkCheck();
            switchPlayer();
        }
    }

    const newGame = ()=> {
        emptyPlayerMemory(playerOne);
        emptyPlayerMemory(playerTwo);
        placeAllShips();
    }

    const resetGame = ()=> {
        playerOne.resetScore();
        playerTwo.resetScore();
        newGame();
    }

    const emptyPlayerMemory = (player)=> {
        emptyBoard(player);
        emptyShotsFired(player);
        emptyShipsOnBoard(player);
        emptyCellColors();
    }

    const emptyBoard = (player)=> {
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                player.board.board[i][j] = null;
            }
        }
    }

    const emptyShotsFired = (player)=> {
        player.board.shotsFired = {};
    }

    const emptyShipsOnBoard = (player)=> {
        player.board.shipsOnBoard.length = 0;
    }

    const emptyCellColors = ()=> {
        for (let i = 0; i < allCells.length; i++) {
            allCells[i].classList.remove('containsShip');
            allCells[i].classList.remove('hitCell');
            allCells[i].classList.remove('missedCell');   
        }
    }

    newGameButton.addEventListener('click', newGame);
    resetGameButton.addEventListener('click', resetGame);
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

const letterFromCoordinate = (coordinate)=> {
    return String.fromCharCode(coordinate + 65);
}

createBoard(playerOneBoard);
createBoard(playerTwoBoard);

export { gameController }