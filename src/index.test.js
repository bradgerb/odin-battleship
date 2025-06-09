const { sum, Ship } = require('./index');

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

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