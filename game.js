import Player from './player.js';
import Points from './points.js';

export default class Game {
  constructor() {
    this.round = 13
    this.currentPlayer = 'p1';
    this.players = { p1: new Player('human'), p2: new Player('comp') }
    this.rollCount = 0
    this.heldDice = [false, false, false, false, false]
    this.dice = [0, 0, 0, 0, 0]
    this.bonus = 35
    this.points = 0
    this.numYahtzee = 0
    this.compTarget = 'cx5'
  }

  updateScore() {
    this.players[this.currentPlayer].score += this.points
    this.points = 0
    this.heldDice = [false, false, false, false, false]
    this.rollCount = 0
    if (this.currentPlayer === 'p1') {
      this.round--
      return { player: this.currentPlayer, score: this.players[this.currentPlayer].score }
    }
  }

  compTurn() {
    let opt = ['cu1', 'cu2', 'cu3', 'cu4', 'cu5', 'cu6', 'cx3', 'cx4', 'cfh', 'css', 'cls', 'cx5', 'cch']
    let thing = Math.floor(Math.random() * 13) + 1
    this.compTarget = opt[thing]
    let num = Math.floor(Math.random() * 5) + 1
    this.players[this.currentPlayer].score += num
    return { points: num, score: this.players[this.currentPlayer].score }
  }

  nextPlayer() {
    this.currentPlayer = this.currentPlayer === 'p1' ? 'p2' : 'p1'
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
    this.players[this.currentPlayer].score += this.bonus
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