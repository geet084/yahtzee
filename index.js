import Game from './game.js';
import * as dom from './domUpdates.js'

let game;
dom.highScores()

export function newGame() {
  game = new Game();
}

export function handleScore() {
  const { player, score } = game.updateScore()
  game.nextPlayer()
  dom.checkForUpperBonus()
  if (player === 'p1') dom.updateScore(score, 'p')
  dom.nextTurn()
  checkForGameEnd()
}

export function playComp() {
  if (game.round !== 0) {
    const { points, score } = game.compTurn()
    dom.compScore(game.compTarget, points)
    dom.updateScore(score, 'c')
    game.nextPlayer()
    checkForGameEnd() 
  }
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

function checkForGameEnd() {
  if (game.round === 0) {
    const p1Score = game.players.p1.score
    const p2Score = game.players.p2.score
    dom.checkForUpperBonus()
    dom.updateScore(p1Score, 'p')
    dom.updateScore(p2Score, 'c')
    dom.endGame()
  }
}