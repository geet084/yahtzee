export default class Dice {
  constructor() {
    this.roll = [0, 0, 0, 0, 0]
    this.heldDice = [false, false, false, false, false]
    this.rollCount = 0
    this.canRoll = true
  }

  reset() {
    this.heldDice = [false, false, false, false, false]
    this.rollCount = 0
  }

  toggleHold(index) {
    this.heldDice[index] = !this.heldDice[index]
  }

  newRoll() {
    if (this.rollCount === 3) this.canRoll = false
    this.rollCount++

    newDiceRoll().map((die, i) => {
      const notHeld = this.heldDice[i] === false
      if (notHeld) this.roll[i] = die
    })
    return this.roll
  }
}

function newDiceRoll() {
  let dice = []
  for (let i = 0; i < 5; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1)
  }
  return dice
}