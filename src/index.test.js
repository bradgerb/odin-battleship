/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { Ship, Gameboard } = require('./index');

test('constructor should set ship length', () => {
    const battleship = new Ship(5);
    expect(battleship.length).toBe(5);
});

test('hit() should increase hits by 1', () => {
    const battleship = new Ship(5);
    battleship.hit();
    battleship.hit();
    expect(battleship.hits).toBe(2);
});

test('isSunk should return true after hits >= length, check false condition', () => {
    const battleship = new Ship(5);
    for(let i = 0; i < 4; i++) {
        battleship.hit();
    }
    expect(battleship.isSunk()).toBe(false);
});

test('isSunk should return true after hits >= length, check true condition', () => {
    const battleship = new Ship(5);
    for(let i = 0; i < 5; i++) {
        battleship.hit();
    }
    expect(battleship.isSunk()).toBe(true);
});

test('check that hits register after placing ship on board', () => {
    const battleship = new Ship(5);
    const board = new Gameboard();
    board.placeShip('battleship', [0, 0], [0, 4]);
    board.board[0][3].hit();
    expect(board.board[0][3].hits).toBe(1);
});

test('check that hits register for entire ship', () => {
    const battleship = new Ship(5);
    const board = new Gameboard();
    board.placeShip('battleship', [0, 0], [0, 4]);
    board.board[0][0].hit();
    expect(board.board[0][3].hits).toBe(1);
});

test('check that hits register for only ship that was hit', () => {
    const battleship = new Ship(5);
    const destroyer = new Ship(4);
    const board = new Gameboard();
    board.placeShip('battleship', [0, 0], [0, 4]);
    board.placeShip('destroyer', [1, 0], [1, 3]);
    board.board[0][3].hit();
    expect(board.board[1][3].hits).toBe(0);
});

test('check receive attack coordinates', () => {
    const board = new Gameboard();
    const battleship = new Ship(5);
    board.placeShip('battleship', [1, 0], [1, 4]);
    expect(board.receiveAttack(['A', 1])).toEqual([1, 0]);
});

test('check receive attack coordinates', () => {
    const board = new Gameboard();
    expect(()=>{
        board.receiveAttack(['K', 1])
    }).toThrow('Invalid letter');
});

test('check ship stacking restriction horizontally', () => {
    const board = new Gameboard();
    const battleship = new Ship(5);
    const destroyer = new Ship(4);
    board.placeShip('battleship', [0, 0], [0, 4]);
    expect(()=>{
        board.placeShip('destroyer', [0, 0], [0, 3])
    }).toThrow('Ships may not be stacked');
});

test('check ship stacking restriction vertically', () => {
    const board = new Gameboard();
    const battleship = new Ship(5);
    const destroyer = new Ship(4);
    board.placeShip('battleship', [0, 0], [0, 4]);
    expect(()=>{
        board.placeShip('destroyer', [0, 3], [3, 3])
    }).toThrow('Ships may not be stacked');
});

test('check shots fired hits', () => {
    const board = new Gameboard();
    const battleship = new Ship(5);
    board.placeShip('battleship', [1, 0], [1, 4]);
    board.receiveAttack(['A', 1]);
    expect(board.shotsFired[1, 0]).toBe('hit');
});

test('check shots fired misses', () => {
    const board = new Gameboard();
    const battleship = new Ship(5);
    board.placeShip('battleship', [1, 0], [1, 4]);
    board.receiveAttack(['A', 9]);
    expect(board.shotsFired[9, 0]).toBe('miss');
});

test('check shots fired for square not yet shot', () => {
    const board = new Gameboard();
    const battleship = new Ship(5);
    board.placeShip('battleship', [1, 0], [1, 4]);
    board.receiveAttack(['A', 1]);
    expect(board.shotsFired[9, 9]).toBe(undefined);
});

test('check shots fired on same square again', () => {
    const board = new Gameboard();
    const battleship = new Ship(5);
    board.placeShip('battleship', [1, 0], [1, 4]);
    board.receiveAttack(['A', 1]);
    expect(()=>{
        board.receiveAttack(['A', 1])
    }).toThrow('That square has already been fired upon');
});