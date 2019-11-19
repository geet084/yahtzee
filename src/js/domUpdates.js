import * as index from './index.js';

let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);
window.addEventListener('resize', () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});

const select = (selector) => document.querySelector(selector);
const getDOMArray = (selector) => {
  return Array.from(document.querySelectorAll(selector));
};

window.onload = function () {
  getDOMArray('.comp').forEach(box => box.style.visibility = 'hidden')
  select('.comp-score').style.display = 'none'
}

select('.btm-section').addEventListener('click', handleClick)
select('.start-game').addEventListener('click', startGame)
select('.return').addEventListener('click', returnToSplash)
select('.end-return').addEventListener('click', returnToSplash)
select('.restart').addEventListener('click', restartGame)
select('.single').addEventListener('click', togglePlayers)
select('.computer').addEventListener('click', togglePlayers)
getDOMArray('.die').forEach(die => die.addEventListener('click', helpBox))
select('.overlay').addEventListener('click', helpBox)
select('.help-box').addEventListener('click', helpBox)

function helpBox({ target }) {
  const helpBox = select('.help-box')
  const overlay = select('.overlay')

  if (helpBox.style.visibility === 'visible') {
    helpBox.style.visibility = 'hidden'
    overlay.style.zIndex = '-10'
    overlay.style.backgroundColor = ''
  } else {
    target = !target.classList.contains('die') ? target.closest('.die') : target

    const distTop = getElementOffset(target).top;
    const distLeft = getElementOffset(target).left;

    helpBox.style.top = `${distTop + 60}px`
    helpBox.style.left = `${distLeft + 5}px`
    helpBox.style.visibility = 'visible'
    helpBox.style.color = 'rgb(93, 90, 97)'
    let helpInfo = getHelpText(target.classList[1])
    helpBox.innerHTML = helpInfo

    overlay.style.zIndex = '2'
    overlay.style.backgroundColor = 'rgba(0,0,0,0.3)'
  }
}

function getHelpText(target) {
  switch (target) {
    case 'x3':
      return '<div><p class="infoTitle">3 of a Kind</p><p class="infoBody">At least three of the same dice</p><p class="infoScore">Score: Sum of all dice</p></div>'
    case 'x4':
      return '<div><p class="infoTitle">4 of a Kind</p><p class="infoBody">At least four of the same dice</p><p class="infoScore">Score: Sum of all dice</p></div>'
    case 'fh':
      return '<div><p class="infoTitle">Full House</p><p class="infoBody">A three of a kind and a pai.</p><p class="infoScore">Score: 25 points</p></div>'
    case 'ss':
      return '<div><p class="infoTitle">Small Straight</p><p class="infoBody">Four dice in a sequenc.</p><p class="infoScore">Score: 30 points</p></div>'
    case 'ls':
      return '<div><p class="infoTitle">Large Straight</p><p class="infoBody">Five dice in a sequenc.</p><p class="infoScore">Score: 40 points</p></div>'
    case 'x5':
      return '<div><p class="infoTitle">Yahtzee</p><p class="infoBody">All five of the same dice</p><p class="infoScore">Score: 50 points</p></div>'
    case 'chance-box':
      return '<div><p class="infoTitle">Chance</p><p class="infoBody">Any combination of dice</p><p class="infoScore">Score: Sum of all dice</p></div>'
    default:
      if (target === 'six') target += 'e'
      const targetTitle = target[0].toUpperCase() + target.slice(1)
      return `<div><p class="infoTitle">${targetTitle}s</p><p class="infoBody">Any number of ${targetTitle}s</p><p class="infoScore">Score: Sum of ${targetTitle}s</p></div>`
  }
}

function togglePlayers() {
  playSound('tick')
  getDOMArray('.comp').forEach(box => {
    const visible = box.style.visibility === 'hidden'
    box.style.visibility = visible ? 'inherit' : 'hidden'
    select('.comp-score').style.display = visible ? '' : 'none'
    if (box.classList.contains('c-bonus-num')) box.style.backgroundColor = '#938d94'
    if (box.classList.contains('ttl-comp-score')) box.style.backgroundColor = '#5d5b61'
  })
}

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

export function updateScore(score, player) {
  select(`#${player}-ttlscore`).innerText = score
  playSound('whoosh')
  const target = select('.hold')
  if (target) {
    animateScoredBox(target)
    animateDice(target)
    target.classList.remove('hold')
    target.classList.remove('pulse-hold')
    target.classList.add('scored')
  }
  removeScoreBoxEventListeners()
  if (player === 'p') index.playComp()
}

function animateScoredBox(target) {
  setTimeout(() => {
    target.classList.add('flipBox')
  }, 700);
  setTimeout(() => {
    target.classList.remove('flipBox')
  }, 1500);
}

function animateDice(target) {
  getDOMArray('.dice').map((die, i) => {
    const moveDie = die.cloneNode(true)

    const root = document.documentElement.style;
    const targetBox = document.getElementById(target.id)

    const distTop = getElementOffset(targetBox).top;
    const distLeft = getElementOffset(targetBox).left;

    root.setProperty('--dest-box-top', distTop + 'px')
    root.setProperty('--dest-box-left', distLeft + 'px')
    root.setProperty('--dice-top', die.offsetTop + 'px')
    root.setProperty(`--dice-${i + 1}-left`, die.offsetLeft + 'px')

    moveDie.setAttribute('id', `m${die.id}`)
    moveDie.classList.add('moved')
    moveDie.innerText = die.innerText
    document.querySelector('.dice-area').appendChild(moveDie)
    moveDie.classList.add(`animate-dice-${i + 1}`)
  })
}

export function updateDiceArea(dice, count) {
  clearLastBox()
  playSound('roll')
  getDOMArray('.dice').map((die, i) => {
    if (!die.classList.contains('held')) die.classList.add('bounce')
    die.innerText = dice[i]
  })
  const rollCount = select(`.roll-${count}`)
  rollCount.classList.add('roll-count')
  rollCount.innerText = count
  if (count === 3) {
    getDOMArray('.roll').map(roll => roll.classList.add('done'))
    select('.roll').classList.remove('avail-btn')
  }

  setTimeout(() => {
    getDOMArray('.dice').map(die => {
      die.classList.remove('bounce')
    })
  }, 300);
}

export function nextTurn() {
  resetDice()
  getDOMArray('.roll').map(roll => roll.classList.remove('done'))
  select('.roll').classList.add('avail-btn')
  select('.score').classList.add('done')
  select('.score').classList.remove('avail-btn')
  select('.score').removeEventListener('click', index.handleScore)
  getDOMArray('.rolls').map(box => {
    box.classList.remove('roll-count')
    box.innerText = ""
  })
  getDOMArray('.dbox').map(die => {
    die.classList.remove('rolled')
  })
}

export function resetDice() {
  getDOMArray('.dbox').map(die => {
    if (!die.classList.contains('moved')) resetDie(die);
  })

  setTimeout(() => {
    getDOMArray('.dbox').map(die => {
      if (die.classList.contains('moved')) die.remove()
    })
  }, 1100);

  function resetDie(die) {
    die.innerText = '';
    die.classList.remove('held');
  }
}

export function checkForUpperPlayerBonus() {
  let upperTotal = 0

  getDOMArray('.player').map(box => {
    const value = parseInt(box.innerText)
    const isUpper = box.id.includes('u')
    if (value >= 0 && isUpper) upperTotal += value
  })
  select('.p-bonus-num').innerText = `${upperTotal} / 63`
  index.handleBonus(upperTotal, 'p1')
}

export function checkForUpperCompBonus() {
  let upperTotal = 0

  getDOMArray('.comp').map(box => {
    const value = parseInt(box.innerText)
    const isUpper = box.id.includes('u')
    if (value >= 0 && isUpper) upperTotal += value
  })
  select('.c-bonus-num').innerText = `${upperTotal} / 63`
  index.handleBonus(upperTotal, 'p2')
}

export function endGame() {
  select('.btm-section').removeEventListener('click', handleClick)
  select('.roll').classList.add('done')
  select('.score').classList.add('done')

  setTimeout(() => {
    select('.scores').classList.add('partial-fade');
    select('.mid-section').classList.add('partial-fade');
    select('.btm-section').classList.add('fade-out')
  }, 1700);

  setTimeout(() => {
    select('.btm-section').style.opacity = 0
    select('.btm-section').style.display = 'none'
    select('.scores').style.opacity = .3;
    select('.mid-section').style.opacity = .3;
    select('.end-game').style.display = ''
  }, 2500);

  select('.end-game').classList.add('slide-up')
  select('.end-game').style.position = 'relative'
}

function startGame() {
  select('.main-splash').style.display = 'none'
  select('.main-game').style.display = ''
  select('#notification').style.display = 'none'
  index.newGame()
}

function returnToSplash() {
  playSound('tick')
  const gameOver = getDOMArray('.scored').length >= 13
  select('.main-splash').style.display = ''
  select('.main-game').style.display = 'none'
  select('#notification').style.display = ''

  if (gameOver) {
    restartGame()
    select('.start-game').innerText = "New Game"
  } else select('.start-game').innerText = "Resume Game"
}

function restartGame() {
  playSound('tick')
  highScores(select('#p-ttlscore').innerText)
  index.newGame()
  select('.btm-section').addEventListener('click', handleClick)

  setTimeout(() => {
    select('.scores').classList.remove('partial-fade');
    select('.mid-section').classList.remove('partial-fade');
    select('.btm-section').classList.remove('fade-out')
    select('.end-game').classList.remove('slide-up')
    select('.end-game').classList.add('slide-down')
    select('.scores').classList.add('fade-in');
    select('.mid-section').classList.add('fade-in');
    getDOMArray('.box').map(box => {
      box.innerText = ''
      box.classList.remove('scored')
    })
    select('.p-bonus-num').innerText = '0 / 63'
    select('.c-bonus-num').innerText = '0 / 63'
    select('#p-ttlscore').innerText = 0
    select('#c-ttlscore').innerText = 0
  }, 300);

  setTimeout(() => {
    select('.btm-section').style.display = ''
    select('.btm-section').classList.add('fade-in')
  }, 500);

  setTimeout(() => {
    select('.end-game').style.position = 'absolute'
    select('.end-game').style.bottom = '-200px'
    select('.end-game').style.display = 'none'
    select('.btm-section').style.opacity = 1;
    select('.scores').style.opacity = 1;
    select('.mid-section').style.opacity = 1;
    select('.end-game').classList.remove('slide-down')
    select('.scores').classList.remove('fade-in');
    select('.mid-section').classList.remove('fade-in');
    select('.btm-section').classList.remove('fade-in')
  }, 1100);
}

export function compScore(target, score) {
  select(`#${target}`).innerText = score;
  select(`#${target}`).classList.add('scored');
}

function scoreBox({ target }) {
  clearLastBox()
  select('.score').classList.remove('done')
  select('.score').classList.add('avail-btn')
  select('.score').addEventListener('click', index.handleScore)
  if (!target.classList.contains('scored')) {
    target.innerText = index.getRolledPoints(target.id);
  }
  target.classList.add('hold')
  select('.hold').classList.add('pulse-hold')
}

function handleClick({ target }) {
  if (target.id.includes('rd')) handleDice(target);
  if (target.classList.contains('roll') && !target.classList.contains('done')) {
    select('.score').classList.remove('avail-btn')
    select('.score').classList.add('done')
    getDOMArray('.dbox').map(die => {
      die.classList.add('rolled')
    })
    if (select('.avail-btn')) index.handleRoll();
  }
}

function handleDice({ id, classList, innerText }) {
  const die = parseInt(id.split('').pop()) - 1
  const notBlank = innerText !== ''
  const notHeld = !classList.contains('held')

  playSound('bloop')
  if (notBlank) index.toggleHeldDice(die)
  if (notBlank && notHeld) classList.add('held')
  else classList.remove('held')
}

function clearLastBox() {
  getDOMArray('.box').map(box => {
    const notScored = !box.classList.contains('scored')

    if (notScored) {
      box.classList.remove('hold')
      box.classList.remove('pulse-hold')
      box.innerText = ''
    }
  })
}

function getElementOffset(el) {
  let top = 0;
  let left = 0;
  let element = el;

  do {
    top += element.offsetTop || 0;
    left += element.offsetLeft || 0;
    element = element.offsetParent;
  } while (element);

  top -= window.outerHeight > 900 ? 20 : 10
  left -= window.outerWidth > 700 ? 30 : 10

  return { top, left };
}

export function highScores(score) {
  const stored = JSON.parse(localStorage.getItem('yScores'))
  const highScores = stored ? stored : new Array(3).fill({ score: 0, date: '1/1/2000' })
  const newScore = { score: parseInt(score), date: getFormattedDate(new Date()) }

  highScores.push(newScore)
  highScores.sort((a, b) => b.score - a.score)
  highScores.pop()

  getDOMArray('.high-scores').map((highScore, i) => {
    if (highScores[i].score >= 1) {
      const score = highScores[i].score.toString().padStart(3)
      highScore.innerText = `${score} - ${highScores[i].date}`
    }
  })

  localStorage.setItem('yScores', JSON.stringify(highScores))
}

function getFormattedDate(date) {
  let year = parseInt(date.getFullYear().toString().slice(2, 4))
  let month = (1 + date.getMonth()).toString().padStart(2, '0');
  let day = date.getDate().toString().padStart(2, '0');

  return month + '/' + day + '/' + year;
}

function playSound(type) {
  new Audio(`./audio/${type}.wav`).play()
}