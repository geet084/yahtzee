import Player from './player.js';
import Points from './points.js';

export default class Game {
  constructor() {
    this.round = 13
    this.players = new Player()
    this.rollCount = 0
    this.heldDice = [false, false, false, false, false]
    this.dice = [0, 0, 0, 0, 0]
    this.bonus = 35
    this.points = 0
    this.numYahtzee = 0
  }

  updateScore() {
    this.players.score += this.points
    this.round--
    this.points = 0
    this.rollCount = 0
    this.heldDice = [false, false, false, false, false]
    return this.players.score
  }

  rollDice() {
    this.rollCount++
    newDiceRoll().map((die, i) => {
      const notHeld = this.heldDice[i] === false
      if (notHeld) this.dice[i] = die
    })
    return this.dice
  }

  getPoints(target) {
    let points = new Points(this.dice, this.numYahtzee)
    this.points = points.calculate(target)
    
    if (this.points >= 50) this.numYahtzee += 1
  }

  addBonus() {
    this.players.score += this.bonus
    this.bonus = 0
  }
}

function newDiceRoll() {
  let dice = []
  for (let i = 0; i < 5; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1)
  }
  return dice
}