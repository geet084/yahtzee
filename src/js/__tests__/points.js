import Points from '../points';

describe('Points', () => {
  let points;
  
  describe('Default', () => {
    const initial = {
      dice: [1, 1, 1, 1, 1],
      numYahtzee: 0
    }

    it('should be a class', () => {
      points = new Points(initial.dice, initial.numYahtzee)

      expect(points).toBeInstanceOf(Points)
    });

    it('should instantiate points class with rolled dice data', () => {
      points = new Points(initial.dice, initial.numYahtzee)

      expect(points).toEqual(initial)
    });
  });

  describe('Calculate', () => {
    it('should check for a yahtzee', () => {
      let roll = {
        dice: [1, 1, 1, 1, 1],
        numYahtzee: 0
      }
      points = new Points(roll.dice, roll.numYahtzee)

      const result = points.calculate('cx5')

      expect(result).toEqual(50)
    });
    
    it('should add points for additional yahtzees over 1', () => {
      let roll = {
        dice: [1, 1, 1, 1, 1],
        numYahtzee: 1
      }
      points = new Points(roll.dice, roll.numYahtzee)
  
      const result = points.calculate('cx5')
  
      expect(result).toEqual(100)
    });

    it('should score a chance', () => {
      let roll = {
        dice: [3, 4, 3, 5, 5],
        numYahtzee: 0
      }
      points = new Points(roll.dice, roll.numYahtzee)

      const result = points.calculate('cch')

      expect(result).toEqual(20)
    });

    it('should score a large straight', () => {
      let roll = {
        dice: [1, 2, 3, 4, 5],
        numYahtzee: 0
      }
      points = new Points(roll.dice, roll.numYahtzee)

      const result = points.calculate('cls')

      expect(result).toEqual(40)
    });
    
    it('should score a small straight', () => {
      let roll = {
        dice: [1, 2, 3, 4, 1],
        numYahtzee: 0
      }
      points = new Points(roll.dice, roll.numYahtzee)

      const result = points.calculate('css')

      expect(result).toEqual(30)
    });
  
    it('should score a full house', () => {
      let roll = {
        dice: [1, 2, 1, 2, 1],
        numYahtzee: 0
      }
      points = new Points(roll.dice, roll.numYahtzee)

      const result = points.calculate('cfh')

      expect(result).toEqual(25)
    });
    
    it('should score a 3 of a kind with points', () => {
      let roll = {
        dice: [2, 2, 3, 2, 1],
        numYahtzee: 0
      }
      points = new Points(roll.dice, roll.numYahtzee)

      const result = points.calculate('cx3')

      expect(result).toEqual(10)
    });
    
    it('should score a 4 of a kind with no points', () => {
      let roll = {
        dice: [2, 2, 3, 2, 1],
        numYahtzee: 0
      }
      points = new Points(roll.dice, roll.numYahtzee)

      const result = points.calculate('cx4')

      expect(result).toEqual(0)
    });
    
    it('should score a on threes in the upper section', () => {
      let roll = {
        dice: [3, 3, 3, 3, 1],
        numYahtzee: 0
      }
      points = new Points(roll.dice, roll.numYahtzee)

      const result = points.calculate('cu3')

      expect(result).toEqual(12)
    });
  });
});