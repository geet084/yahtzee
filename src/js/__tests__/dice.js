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
      const expected = {
        roll: [1, 2, 1, 2, 1],
        rollCount: 1
      }

      const result = dice.newRoll()

      expect(result.rollCount).toEqual(expected.rollCount)
      expect(result.roll).not.toEqual(expected.roll)
    });

    it('should not re-roll dice that are held', () => {
      dice.newRoll()
      const heldDice = dice.roll

      dice.toggleHold(1)
      dice.toggleHold(3)
      const mockRollOne = dice.newRoll()
      
      expect(mockRollOne.roll[1]).toEqual(heldDice[1])
      expect(mockRollOne.roll[3]).toEqual(heldDice[3])
      
      const mockRollTwo = dice.newRoll()
      dice.newRoll()

      expect(mockRollTwo.roll[1]).toEqual(heldDice[1])
      expect(mockRollTwo.roll[3]).toEqual(heldDice[3])
    });
  });
});