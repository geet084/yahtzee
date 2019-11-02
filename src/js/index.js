import Game from './game.js';
import * as dom from './domUpdates.js'

let game;
dom.highScores()

export function newGame() {
  game = new Game();
}

export function handleScore() {
  game.updateScore()
  dom.checkForUpperPlayerBonus()
  const { player, score } = game.getScore()
  if (player === 'p1') dom.updateScore(score, 'p')
  game.nextPlayer()
  dom.nextTurn()
  checkForGameEnd()
}

export function playComp() {
  game.nextPlayer()
  if (game.round !== 0 || (game.round === 0 && game.currentPlayer === 'p2')) {
    const { target, points, score } = game.compTurn()
    dom.compScore(target, points)
    dom.updateScore(score, 'c')
    dom.checkForUpperCompBonus()
    checkForGameEnd()
  }
}

export function handleBonus(total, player) {
  if (total >= 63) game.addBonus(player)
}

export function handleRoll() {
  dom.addScoreBoxEventListeners()
  const { dice, rollCount } = game.rollDice()

  if (rollCount <= 3) dom.updateDiceArea(dice, rollCount)
}

export function toggleHeldDice(index) {
  game.toggleHeldDice(index)
}

export function getRolledPoints(target) {
  game.getPoints(target)
  return game.points
}

function checkForGameEnd() {
  if (game.round === 0) {
    const p1Score = game.players.p1.score
    const p2Score = game.players.p2.score
    dom.checkForUpperPlayerBonus()
    dom.checkForUpperCompBonus()
    dom.updateScore(p1Score, 'p')
    dom.updateScore(p2Score, 'c')
    dom.endGame()
  }
}