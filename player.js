export default class Player {
  constructor(type) {
    this.score = 0;
    this.type = type;
    this.bonus = 35;
    this.numYahtzee = 0;
  }

  updateScore(points) {
    if (points >= 50) this.numYahtzee++
    this.score += points
  }

  addBonus() {
    this.score += this.bonus
    this.bonus = 0
  }
}