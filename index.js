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
  dom.checkForUpperPlayerBonus()
  if (player === 'p1') dom.updateScore(score, 'p')
  dom.nextTurn()
  checkForGameEnd()
}

export function playComp() {
  if (game.round !== 0 || (game.round === 0 && game.currentPlayer === 'p2')) {
    const { points, score } = game.compTurn()
    dom.compScore(game.compTarget, points)
    dom.updateScore(score, 'c')
    dom.checkForUpperCompBonus()
    game.nextPlayer()
    checkForGameEnd()
  }
}

export function handlePlayerBonus(total) {
  if (total >= 63) game.addPlayerBonus()
}

export function handleCompBonus(total) {
  if (total >= 63) game.addCompBonus()
}

export function handleRoll() {
  dom.addScoreBoxEventListeners()
  const { canRoll, dice, rollCount } = game.rollDice()

  if (canRoll) dom.updateDiceArea(dice, rollCount)
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