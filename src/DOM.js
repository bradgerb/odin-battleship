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

    //controller variables
    let currentPlayer = 1;
    let playerBoard;
    let turnsEnabled = true;
    const allCells = document.querySelectorAll('.cell');
    let playerOneMessage = document.querySelector('.playerOneMessage');
    let playerTwoMessage = document.querySelector('.playerTwoMessage');
    let shipsPlaced = 0;

    //player creation
    const playerOne = new Player('Bob', 'human', 1);
    const playerTwo = new Player('Not Bob', 'ai', 2);

    //game logic
    const startGame = ()=> {
        for (let i = 0; i < allCells.length; i++) {
            allCells[i].addEventListener('click', ()=> {
                playTurn(allCells[i].id);
            });
        }     
    }

    //ship placement
    const placeAllShips = ()=> {
        turnsEnabled = false;
        let shipStart = [];
        let shipEnd = [];

        playerOneMessage.textContent = 'Please place the carrier, length 5'

        function runShipPlacement(e) {

            let board = parseInt(e.target.id.charAt(0));
            let letter = e.target.id.charAt(1);
            let number = parseInt(e.target.id.slice(2)) - 1;
            let targetCell = document.getElementById(e.target.id);
            let player;

            const checkShipLength = (shipStart, shipEnd)=> {
                let shipStartRow = shipStart[0];
                let shipStartColumn = shipStart[1];
                let shipEndRow = shipEnd[0];
                let shipEndColumn = shipEnd[1];
                
                if (shipStartRow === shipEndRow) {
                    return Math.abs(shipEndColumn - shipStartColumn) + 1;
                } else if (shipStartColumn === shipEndColumn) {
                    return Math.abs(shipEndRow - shipStartRow) + 1;
                } else {
                    return false;
                }
            }

            const aiShipPlace = ()=> {
                console.log('place ai ships now');
                placeNewShip(playerTwo, 'carrier', [1, 0], [1, 4]);
                placeNewShip(playerTwo, 'battleship', [5, 4], [5, 7]);
                placeNewShip(playerTwo, 'destroyer', [9, 7], [9, 9]);
                placeNewShip(playerTwo, 'submarine', [1, 8], [3, 8]);
                placeNewShip(playerTwo, 'patrol boat', [7, 2], [8, 2]);
            }

            if (currentPlayer === 1) {
                player = playerOne;
            } else {
                player = playerTwo;
            }

            if (board === currentPlayer) {
                if (shipStart.length === 0) {
                    shipStart = [number, coordinateFromLetter(letter)];
                    targetCell.classList.add('shipPlacementAid');
                } else {
                    shipEnd = [number, coordinateFromLetter(letter)];
                }
            }

            if (shipEnd.length != 0) {

                let shipLength = checkShipLength(shipStart, shipEnd);

                if (shipLength === 5 && shipsPlaced === 0) {
                    if (placeNewShip(player, 'carrier', shipStart, shipEnd)) {
                        shipsPlaced++
                        playerOneMessage.textContent = 'Please place the battleship, length 4';
                    }
                } else if(shipLength === 4 && shipsPlaced === 1) {
                    if (placeNewShip(player, 'battleship', shipStart, shipEnd)) {
                        shipsPlaced++
                        playerOneMessage.textContent = 'Please place the destroyer, length 3';
                    }
                } else if (shipLength === 3 && shipsPlaced === 2) {
                    if (placeNewShip(player, 'destroyer', shipStart, shipEnd)) {
                        shipsPlaced++
                        playerOneMessage.textContent = 'Please place the submarine, length 3';
                    }
                } else if(shipLength === 3 && shipsPlaced === 3) {
                    if (placeNewShip(player, 'submarine', shipStart, shipEnd)) {
                        shipsPlaced++
                        playerOneMessage.textContent = 'Please place the patrol boat, length 2';
                    }
                } else if (shipLength === 2 && shipsPlaced === 4) {
                    if (placeNewShip(player, 'patrol boat', shipStart, shipEnd)) {
                        shipsPlaced++
                        playerOneMessage.textContent = 'Placement complete';
                        if (playerTwo.controlType === 'ai') {
                            aiShipPlace();
                        }
                    }
                }
            
                shipStart.length = 0;
                shipEnd.length = 0;

                for (let i = 0; i < allCells.length; i++) {
                    allCells[i].classList.remove('shipPlacementAid');
                }
            }

            checkEndShipPlacement();
        }

        for (let i = 0; i < allCells.length; i++) {
            allCells[i].addEventListener('click', runShipPlacement);
        }

        //end ship placement
        const checkEndShipPlacement = ()=> {
            if (shipsPlaced === 5) {
                for (let i = 0; i < allCells.length; i++) {
                    allCells[i].removeEventListener('click', runShipPlacement);
                }

                turnsEnabled = true;
                shipsPlaced = 0;
                startGame();
            }
        }
    }

    placeAllShips();

    //game logic
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
        emptyPlayerMessage();
        placeAllShips();
        currentPlayer = 1;
        shipsPlaced = 0;
    }

    const resetGame = ()=> {
        playerOne.resetScore();
        playerTwo.resetScore();
        scoreUpdate();
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
            allCells[i].classList.remove('hidden');
        }
    }

    const emptyPlayerMessage = ()=> {
        const playerOneDisplay = document.querySelector('.playerOneMessage');
        const playerTwoDisplay = document.querySelector('.playerTwoMessage');

        playerOneDisplay.textContent = '\u00A0';
        playerTwoDisplay.textContent = '\u00A0';
    }

    const scoreUpdate = ()=> {
        let playerOneScoreText = document.querySelector('.playerOneScore');
        let playerTwoScoreText = document.querySelector('.playerTwoScore');

        playerOneScoreText.textContent = `Player 1 score: ${playerOne.score}`
        playerTwoScoreText.textContent = `Player 2 score: ${playerTwo.score}`
    }

    newGameButton.addEventListener('click', newGame);
    resetGameButton.addEventListener('click', resetGame);
}

const placeNewShip = (player, shipName, [rowStart, columnStart], [rowEnd, columnEnd])=> {

    let returnFlag;

    if (player.board.placeShip(shipName, [rowStart, columnStart], [rowEnd, columnEnd])) {
        returnFlag = true;
    } else {
        returnFlag = false;
    }

    for(let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if(player.board.board[i][j]) {
                let cellHash = '';
                cellHash += player.number;
                cellHash += coordinateToHash([i, j]);

                const targetCell = document.getElementById(cellHash);
                targetCell.classList.add('containsShip');

                if (player.controlType === 'ai') {
                    targetCell.classList.add('hidden');
                };
            }
        }
    }
    return returnFlag
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

const coordinateFromLetter = (letter)=> {
    return letter.charCodeAt(0) - 65;
}

createBoard(playerOneBoard);
createBoard(playerTwoBoard);

export { gameController }