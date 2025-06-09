function sum(a, b) {
  return a + b;
}

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

module.exports = { sum, Ship }