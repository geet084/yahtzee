import Player from './player.js';
import Points from './points.js';
import Dice from './dice.js';

export default class Game {
  constructor() {
    this.round = 13
    this.currentPlayer = 'p1';
    this.players = { p1: new Player('human'), p2: new Player('comp') }
    this.dice = new Dice()
    this.points = 0
    this.opt = ['cu1', 'cu2', 'cu3', 'cu4', 'cu5', 'cu6', 'cx3', 'cx4', 'cfh', 'css', 'cls', 'cx5', 'cch']
    this.arr = { points: 0, box: '' }
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
    this.arr = { points: 0, box: '' }

    this.rollComp()
    if (this.arr.points === 0) this.arr = { points: 0, box: this.opt[0] }

    this.opt.splice(this.opt.indexOf(this.arr.box), 1)
    this.players[this.currentPlayer].updateScore(this.arr.points)
    this.points = 0
    this.dice.reset()
    return {
      target: this.arr.box,
      points: this.arr.points,
      score: this.players[this.currentPlayer].score
    }
  }

  rollComp() {
    for (let i = 0; i < 3; i++) {
      this.dice.newRoll()
      this.opt.forEach(op => {
        this.getPoints(op)
        if (this.points > this.arr.points) this.arr = { points: this.points, box: op }
      })
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