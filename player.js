import Dice from './dice.js';
import Points from './points.js';

export default class Player {
  constructor(player) {
    this.player = player
    this.bonus = 35;
    this.score = 0;
    this.numYahtzee = 0;
    this.dice = new Dice()
    this.points = 0
    this.compOptions = ['cu1', 'cu2', 'cu3', 'cu4', 'cu5', 'cu6', 'cx3', 'cx4', 'cfh', 'css', 'cls', 'cx5', 'cch']
    this.play = { points: 0, box: '' }
  }

  updateScore(points) {
    if (points >= 50) this.numYahtzee++
    this.score += points
  }

  addBonus() {
    this.score += this.bonus
    this.bonus = 0
  }

  compTurn() {
    this.play = { points: 0, box: '' }

    this.rollComp()
    if (this.play.points === 0) this.play = { points: 0, box: this.compOptions[0] }

    this.compOptions.splice(this.compOptions.indexOf(this.play.box), 1)
    this.points = 0
    this.dice.reset()
    return {
      target: this.play.box,
      points: this.play.points
    }
  }

  rollComp() {
    for (let i = 0; i < 10; i++) {
      this.dice.newRoll()
      this.compOptions.forEach(op => {
        this.getPoints(op)
        if (this.points > this.play.points) this.play = { points: this.points, box: op }
      })
      this.dice.canRoll = true
    }
  }

  getPoints(target) {
    const points = new Points(this.dice.roll, this.player.numYahtzee)

    this.points = points.calculate(target)
  }
}