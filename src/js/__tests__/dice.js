import Dice from '../dice.js';

describe('Dice', () => {
  let dice;
  const blankResult = {
    roll: [0, 0, 0, 0, 0],
    heldDice: [false, false, false, false, false],
    rollCount: 0
  }
  
  beforeEach(() => {
    dice = new Dice()
  });

  describe('Default', () => {
    it('should be a class', () => {
      expect(dice).toBeInstanceOf(Dice)
    });

    it('should instantiate dice class with turn data', () => {
      expect(dice).toEqual(blankResult)
    });
  });

  describe('Reset', () => {
    it('should reset the dice', () => {
      dice.newRoll()
      dice.toggleHold(3)
      dice.toggleHold(4)
      dice.reset()

      expect(dice).toEqual(blankResult)
    });
  });

  describe('Toggle', () => {
    it('should toggle dice to be held', () => {
      const result = [false, true, false, true, false]

      dice.toggleHold(1)
      dice.toggleHold(3)

      expect(dice.heldDice).toEqual(result)
    });
  });

  describe('New Roll', () => {
    it('should roll a new set of dice', () => {
      const result = {
        roll: [1, 2, 1, 2, 1],
        rollCount: 1
      }

      dice.newRoll()

      expect(dice.rollCount).toEqual(result.rollCount)
      expect(dice.roll).not.toEqual(result.roll)
    });

    it('should not re-roll dice that are held', () => {
      dice.newRoll()
      const result = dice.roll

      dice.toggleHold(1)
      dice.toggleHold(3)
      dice.newRoll()

      expect(dice.roll[1]).toEqual(result[1])
      expect(dice.roll[3]).toEqual(result[3])

      dice.newRoll()

      expect(dice.roll[1]).toEqual(result[1])
      expect(dice.roll[3]).toEqual(result[3])
    });
  });
});