export default class Player {
  constructor(type) {
    this.score = 0;
    this.type = type;
  }

  score(num) {
    this.score += num
  }
}