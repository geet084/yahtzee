import Game from './game.js';
import * as dom from './domUpdates.js'

let game = new Game();

export function handleScore() {
  const score = game.updateScore()
  dom.checkForUpperBonus()
  dom.updateScore(score)
  game.round > 0 ? dom.nextTurn() : endOfGame(score)
  // dom.nextTurn()
  // checkForGameEnd()
}

export function handleBonus(total) {
  if (total >= 63) game.addBonus()
}

export function handleRoll() {
  dom.addScoreBoxEventListeners()

  if (game.rollCount < 3) {
    let dice = game.rollDice()
    dom.updateDiceArea(dice, game.rollCount)
  }
}

export function toggleHeldDice(index) {
  game.heldDice[index] = !game.heldDice[index]
}

export function getRolledPoints(target) {
  game.getPoints(target)
  return game.points
}

function endOfGame(score) {
  dom.endGame()
  dom.checkForUpperBonus()
  dom.updateScore(score)
}
// function checkForGameEnd() {
//   if (game.round === 0) {
//     const score = game.updateScore()
//     dom.checkForUpperBonus()
//     dom.updateScore(score)
//     dom.endGame()
//   }
// }

export function restartGame() {
  game = new Game()
}