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

            let boardNumber = 0;

            if (board.classList.contains('one')) {
                boardNumber = 1;
            } else {
                boardNumber = 2;
            }

            if (i === 0 && j != 0) {
                cell.textContent = `${String.fromCharCode(j + 64)}`;
            } else if (i != 0 && j === 0) {
                cell.textContent = `${i}`;
            } else if (i != 0 && j != 0) {
                cell.setAttribute('id', `${String.fromCharCode(j + 64)}${i}${boardNumber}`);
            }

            board.appendChild(cell);
        }
    }
}

createBoard(playerOneBoard);
createBoard(playerTwoBoard);

export { helloWorld }