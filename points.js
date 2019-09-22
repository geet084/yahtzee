export default class Points {
  constructor(dice, numYahtzee) {
    this.dice = dice
    this.numYahtzee = numYahtzee
  }

  calculate(target) {
    let score = 0
    let scoreMap = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0
    }

    this.dice.map(die => scoreMap[die]++);
    const yahtzee = checkForYahtzee(scoreMap)
    
    if (target === 'px5' && yahtzee) score = 50
    if (target.includes('pu')) score = scoreUpperBox(target, this.dice);
    if (target === 'px3') score = scoreNumOfKind(3, scoreMap, this.dice);
    if (target === 'px4') score = scoreNumOfKind(4, scoreMap, this.dice);
    if (target === 'pfh') score = scoreFullHouse(scoreMap);
    if (target === 'pss') score = scoreSmallStraight(scoreMap);
    if (target === 'pls') score = scoreLargeStraight(scoreMap);
    if (target === 'pch') score = scoreChance(this.dice);
    
    if (yahtzee && this.numYahtzee > 0) score += 50
    
    // NEED TO FIGURE OUT SCORING FOR YAHTZEES
    return score
  }
}

function checkForYahtzee(scoreMap) {
  return Object.keys(scoreMap).filter(key => scoreMap[key] >= 5).length > 0
}

function scoreChance(dice) {
  return dice.reduce((ttl, die) => ttl += die);
}

function scoreLargeStraight(scoreMap) {
  const options = [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]];
  return isStraight(options, scoreMap) ? 40 : 0;
}

function scoreSmallStraight(scoreMap) {
  const options = [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]];
  return isStraight(options, scoreMap) ? 25 : 0;
}

function isStraight(options, scoreMap) {
  let results = options.map(option => {
    let res = Array.from(new Set(option.map(opt => scoreMap[opt] >= 1)));
    return !res.includes(false);
  });
  return Array.from(new Set(results)).includes(true);
}

function scoreFullHouse(scoreMap) {
  let fh1 = Object.keys(scoreMap).filter(key => scoreMap[key] === 3);
  let fh2 = Object.keys(scoreMap).filter(key => scoreMap[key] === 2);
  return fh1.length > 0 && fh2.length > 0 ? 25 : 0;
}

function scoreNumOfKind(num, scoreMap, dice) {
  let sum = 0;
  dice.map(die => sum += die);
  let numOfKind = Object.keys(scoreMap).filter(key => scoreMap[key] >= num);
  return numOfKind.length ? sum : 0;
}

function scoreUpperBox(id, dice) {
  let sum = 0;
  let spot = parseInt(id.split('').pop());

  dice.forEach(die => {
    if (die === spot) sum += die;
  });
  return sum;
}
