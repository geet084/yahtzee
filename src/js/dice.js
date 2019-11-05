export default class Dice {
  constructor() {
    this.roll = [0, 0, 0, 0, 0]
    this.heldDice = [false, false, false, false, false]
    this.rollCount = 0
  }

  reset() {
    this.roll = [0, 0, 0, 0, 0]
    this.heldDice = [false, false, false, false, false]
    this.rollCount = 0
  }

  toggleHold(index) {
    this.heldDice[index] = !this.heldDice[index]
  }

  newRoll() {
    this.rollCount++

    newDiceRoll().map((die, i) => {
      const notHeld = this.heldDice[i] === false
      if (notHeld) this.roll[i] = die
    })
    return { roll: this.roll, rollCount: this.rollCount }
  }
}

function newDiceRoll() {
  let dice = []
  for (let i = 0; i < 5; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1)
  }
  return dice
}