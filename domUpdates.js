import * as index from './index.js';

const select = (selector) => document.querySelector(selector);
const getDOMArray = (selector) => {
  return Array.from(document.querySelectorAll(selector));
};

select('#rolls').addEventListener('click', handleClick)

export function addScoreBoxEventListeners() {
  getDOMArray('.player').map(box => {
    const notScored = !box.classList.contains('scored')
    if (notScored) box.addEventListener('click', scoreBox)
  })
}

export function removeScoreBoxEventListeners() {
  getDOMArray('.player').map(box => {
    box.removeEventListener('click', scoreBox)
  })
}

export function updateScore(score) {
  select('#ttlscore').innerText = score
  const target = select('.hold')
  target.classList.remove('hold')
  target.classList.add('scored')
  removeScoreBoxEventListeners()
}

export function updateDiceArea(dice, count) {
  getDOMArray('.dice').map((die, i) => {
    die.innerText = dice[i]
  })
  const rollCount = select(`.roll-${count}`)
  rollCount.classList.add('roll-count')
  rollCount.innerText = count
  if (count === 3) {
    select('#roll').classList.add('done')
    select('#roll').classList.remove('avail-btn')
  }
}

export function nextTurn() {
  resetDice()
  select('#roll').classList.remove('done')
  select('#roll').classList.add('avail-btn')
  select('#score').classList.add('done')
  select('#score').classList.remove('avail-btn')
  select('#score').removeEventListener('click', index.handleScore)
  getDOMArray('.rolls').map(box => {
    box.classList.remove('roll-count')
    box.innerText = ""
  })
}

export function resetDice() {
  getDOMArray('.dbox').map(die => {
    die.innerText = ''
    die.classList.remove('held')
  })
}

export function checkForUpperBonus() {
  let upperTotal = 0

  getDOMArray('.upper').map(box => {
    const value = parseInt(box.innerText)
    if (value >= 0) upperTotal += value
  })
  select('.p-bonus-num').innerText = `${upperTotal} / 63`
  index.handleBonus(upperTotal)
}

export function endGame() {
  select('#roll').classList.add('done')
  select('#score').classList.add('done')
  alert('GAME OVER')
}

function scoreBox({ target }) {
  clearLastBox()
  select('#score').classList.remove('done')
  select('#score').classList.add('avail-btn')
  select('#score').addEventListener('click', index.handleScore)
  if (!target.classList.contains('scored')) {
    target.innerText = index.getRolledPoints(target.id);
  }
  target.classList.add('hold')
}

function handleClick({ target }) {
  if (target.id.includes('rd')) handleDice(target);
  if (target.id === 'roll') index.handleRoll();
}

function handleDice({ id, classList, innerText }) {
  const die = parseInt(id.split('').pop()) - 1
  const notBlank = innerText !== ''
  const notHeld = !classList.contains('held')

  if (notBlank) index.toggleHeldDice(die)
  if (notBlank && notHeld) classList.add('held')
  else classList.remove('held')
}

function clearLastBox() {
  getDOMArray('.box').map(box => {
    const notScored = !box.classList.contains('scored')

    if (notScored) {
      box.classList.remove('hold')
      box.innerText = ''
    }
  })
}