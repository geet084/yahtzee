import Player from './player.js';
import Points from './points.js';
import Dice from './dice.js';

export default class Game {
  constructor() {
    this.round = 13
    this.currentPlayer = 'p1';
    this.players = { p1: new Player('human'), p2: new Player('comp') }
    this.dice = new Dice()
    this.p1Bonus = 35
    this.p2Bonus = 35
    this.points = 0
    this.numYahtzee = 0
    this.compTarget = 'cx5'
  }

  updateScore() {
    this.players[this.currentPlayer].score += this.points
    this.points = 0
    this.dice.reset()
    if (this.currentPlayer === 'p1') {
      this.round--
      return { player: this.currentPlayer, score: this.players[this.currentPlayer].score }
    }
  }

  compTurn() {
    let opt = ['cu1', 'cu2', 'cu3', 'cu4', 'cu5', 'cu6', 'cx3', 'cx4', 'cfh', 'css', 'cls', 'cx5', 'cch']
    this.compTarget = opt[this.round]
    let num = Math.floor(Math.random() * 5) + 1
    this.players[this.currentPlayer].score += num
    return { points: num, score: this.players[this.currentPlayer].score }
  }

  nextPlayer() {
    this.currentPlayer = this.currentPlayer === 'p1' ? 'p2' : 'p1'
  }

  rollDice() {
    this.dice.newRoll()

    return {
      dice: this.dice.roll,
      rollCount: this.dice.rollCount,
      canRoll: this.dice.canRoll
    }
  }

  toggleHeldDice(index) {
    this.dice.toggleHold(index)
  }

  getPoints(target) {
    let points = new Points(this.dice.roll, this.numYahtzee)
    this.points = points.calculate(target)

    if (this.points >= 50) this.numYahtzee += 1
  }

  addPlayerBonus() {
    this.players.p1.score += this.bonus
    this.p1Bonus = 0
  }

  addCompBonus() {
    this.players.p2.score += this.bonus
    this.p2Bonus = 0
  }
}