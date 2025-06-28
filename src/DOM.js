function helloWorld(){
    console.log('hello world');
}

const playerOneBoard = document.querySelector('.one');
const playerTwoBoard = document.querySelector('.two');

const createBoard = (board)=> {
    for(let i = 0; i < 11; i++) {
        for(let j = 0; j < 11; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.textContent = `i: ${i}; j:${j}`;
            board.appendChild(cell);
        }
    }
}

createBoard(playerOneBoard);
createBoard(playerTwoBoard);

export { helloWorld }