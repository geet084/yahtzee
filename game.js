import Player from './player.js';
import Points from './points.js';
import Dice from './dice.js';
import Comp from './comp.js';

export default class Game {
  constructor() {
    this.round = 13
    this.currentPlayer = 'p1';
    this.players = { p1: new Player('human'), p2: new Player('comp') }
    this.dice = new Dice()
    this.points = 0
    this.comp = new Comp(this.players.p2)
  }

  updateScore() {
    this.players[this.currentPlayer].updateScore(this.points)
    this.points = 0
    this.dice.reset()
    if (this.currentPlayer === 'p1') this.round--
  }

  getScore() {
    return { player: this.currentPlayer, score: this.players[this.currentPlayer].score }
  }

  compTurn() {
    const { target, points } = this.comp.compTurn()
    this.players.p2.updateScore(points)

    return {
      target,
      points,
      score: this.players[this.currentPlayer].score
    }
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
    const player = this.players[this.currentPlayer]
    const points = new Points(this.dice.roll, player.numYahtzee)

    this.points = points.calculate(target)
  }

  addBonus(player) {
    this.players[player].addBonus()
  }
}