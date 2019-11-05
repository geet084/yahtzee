import Player from '../player';
import Dice from '../dice';

describe('Player', () => {
  let player;
  const blankResult = {
    player: 'comp',
    bonus: 35,
    score: 0,
    numYahtzee: 0,
    dice: new Dice(),
    points: 0,
    compOptions: ['cu1', 'cu2', 'cu3', 'cu4', 'cu5', 'cu6', 'cx3', 'cx4', 'cfh', 'css', 'cls', 'cx5', 'cch'],
    play: { points: 0, box: '' }
  }

  beforeEach(() => {
    player = new Player('comp')
  });

  describe('Default', () => {
    it('should be a class', () => {
      expect(player).toBeInstanceOf(Player)
    });

    it('should instaniate player class with player data', () => {
      expect(player).toEqual(blankResult)
    });
  });

  describe('Update Score', () => {
    it('should update a players score if it is not a yahtzee', () => {
      const expected = 33

      player.updateScore(expected)

      expect(player.score).toEqual(expected)
    });

    it('should update a players score if it is a yahtzee', () => {
      const expected = 52
      expect(player.numYahtzee).toEqual(0)

      player.updateScore(expected)

      expect(player.score).toEqual(expected)
      expect(player.numYahtzee).toEqual(1)
    });
  });

  describe('Add Bonus', () => {
    it('should add a bonus to the players score', () => {
      expect(player.score).toEqual(0)
      expect(player.bonus).toEqual(35)

      player.addBonus()

      expect(player.score).toEqual(35)
      expect(player.bonus).toEqual(0)
    });
  });

  describe('Comp Turn', () => {
    it('should take a turn for the computer and score more than zero', () => {
      const expected = {
        target: 'cx5',
        points: 55
      }
      player.dice.reset = jest.fn()
      player.rollComp = jest.fn().mockImplementation(() => (
        player.play = {
          box: expected.target,
          points: expected.points
        }
      ))

      const result = player.compTurn()

      expect(player.rollComp).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
      expect(player.compOptions.indexOf(expected.target)).toEqual(-1)
      expect(player.points).toEqual(0)
      expect(player.dice.reset).toHaveBeenCalledTimes(1)
    });

    it('should take a turn for the computer and score zero', () => {
      const expected = {
        target: 'cu1',
        points: 0
      }
      player.dice.reset = jest.fn()
      player.rollComp = jest.fn().mockImplementation(() => (
        player.play = {
          box: expected.target,
          points: expected.points
        }
      ))

      const result = player.compTurn()

      expect(result).toEqual(expected)
      expect(player.compOptions.indexOf(expected.target)).toEqual(-1)
    });
  });

  describe('Roll Comp', () => {
    it('should roll for the computer', () => {
      player.dice.newRoll = jest.fn()
      player.dice.roll = [1, 1, 1, 1, 1]
      const expected = {
        calls: 10,
        points: 5,
        play: { points: 50, box: 'cx5' }
      }

      player.rollComp()

      expect(player.dice.newRoll).toHaveBeenCalledTimes(expected.calls)
      expect(player.points).toEqual(expected.points)
      expect(player.play).toEqual(expected.play)
    });
  });

  describe('Get Points', () => {
    it('should return a current players points based on rolling a yahtzee', () => {
      player.dice.roll = [1, 1, 1, 1, 1]

      player.getPoints('cx5')

      expect(player.points).toEqual(50)
    });
  });
});