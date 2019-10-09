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

select('.btm-section').addEventListener('click', handleClick)
select('.start-game').addEventListener('click', startGame)
select('.return').addEventListener('click', returnToSplash)
select('.end-return').addEventListener('click', returnToSplash)
select('.restart').addEventListener('click', restartGame)

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
  if (target) {
    animateScoredBox(target)
    animateDice(target)
    target.classList.remove('hold')
    target.classList.add('scored')
  }
  removeScoreBoxEventListeners()
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
  getDOMArray('.dice').map((die, i) => {
    if (!die.classList.contains('held')) die.classList.add('bounce')
    die.innerText = dice[i]
  })
  const rollCount = select(`.roll-${count}`)
  rollCount.classList.add('roll-count')
  rollCount.innerText = count
  if (count === 3) {
    select('.roll').classList.add('done')
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
  select('.roll').classList.remove('done')
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

export function checkForUpperBonus() {
  let upperTotal = 0

  getDOMArray('.player').map(box => {
    const value = parseInt(box.innerText)
    const isUpper = box.id.includes('u')
    if (value >= 0 && isUpper) upperTotal += value
  })
  select('.p-bonus-num').innerText = `${upperTotal} / 63`
  index.handleBonus(upperTotal)
}

export function endGame() {
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
}

function returnToSplash() {
  const gameOver = getDOMArray('.scored').length >= 13
  select('.main-splash').style.display = ''
  select('.main-game').style.display = 'none'

  if (gameOver) {
    restartGame()
    select('.start-game').innerText = "New Game"
  } else select('.start-game').innerText = "Resume Game"
}

function restartGame() {
  index.restartGame()

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
    select('#ttlscore').innerText = 0
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

function scoreBox({ target }) {
  clearLastBox()
  select('.score').classList.remove('done')
  select('.score').classList.add('avail-btn')
  select('.score').addEventListener('click', index.handleScore)
  if (!target.classList.contains('scored')) {
    target.innerText = index.getRolledPoints(target.id);
  }
  target.classList.add('hold')
}

function handleClick({ target }) {
  if (target.id.includes('rd')) handleDice(target);
  if (target.classList.contains('roll')) {
    getDOMArray('.dbox').map(die => {
      die.classList.add('rolled')
    })
    index.handleRoll();
  }
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