import Dice from './dice.js';
import Points from './points.js';

export default class Comp {
  constructor(player) {
    this.player = player
    this.dice = new Dice()
    this.points = 0
    this.opt = ['cu1', 'cu2', 'cu3', 'cu4', 'cu5', 'cu6', 'cx3', 'cx4', 'cfh', 'css', 'cls', 'cx5', 'cch']
    this.arr = { points: 0, box: '' }
  }

  compTurn() {
    this.arr = { points: 0, box: '' }

    this.rollComp()
    if (this.arr.points === 0) this.arr = { points: 0, box: this.opt[0] }

    this.opt.splice(this.opt.indexOf(this.arr.box), 1)
    this.points = 0
    this.dice.reset()
    return {
      target: this.arr.box,
      points: this.arr.points
    }
  }

  rollComp() {
    for (let i = 0; i < 10; i++) {
      this.dice.newRoll()
      this.opt.forEach(op => {
        this.getPoints(op)
        if (this.points > this.arr.points) this.arr = { points: this.points, box: op }
      })
      this.dice.canRoll = true
    }
  }

  getPoints(target) {
    const points = new Points(this.dice.roll, this.player.numYahtzee)

    this.points = points.calculate(target)
  }
}