import Game from '../game';
import Player from '../player';
import Dice from '../dice';

describe('Game', () => {
  let game;
  const blankResult = {
    round: 13,
    currentPlayer: 'p1',
    players: { p1: new Player('human'), p2: new Player('comp') },
    dice: new Dice(),
    points: 0
  }

  beforeEach(() => {
    game = new Game()
  });

  describe('Default', () => {
    it('should be a class', () => {
      expect(game).toBeInstanceOf(Game)
    });

    it('should instantiate game class with game data', () => {
      expect(game).toEqual(blankResult)
    });
  });

  describe('Update Score', () => {
    it('should update player scores and reset', () => {
      game.rollDice()
      game.getPoints('pch')
      const result = game

      game.updateScore()

      expect(game.getScore().score).toEqual(result.players.p1.score)
      expect(game.points).toEqual(0)
      expect(game.round).toEqual(result.round)
    });
  });

  describe('Get Score', () => {
    it('should return score of current player', () => {
      game.rollDice()
      game.getPoints('pch')
      const expected = {
        score: game.points,
        player: 'p1'
      }
      game.updateScore()

      const result = game.getScore()

      expect(result).toEqual(expected)
    });
  });

  describe('Comp Turn', () => {
    it('should take a turn for the computer', () => {
      game.players.p2.compTurn = jest.fn().mockReturnValue({
        target: 'cch',
        points: 10
      })

      game.nextPlayer()
      const result = game.compTurn()

      expect(result).toEqual({ target: 'cch', points: 10, score: game.players.p2.score })
    });
  });

  describe('Next Player', () => {
    it('should change players', () => {
      const result1 = 'p2'
      const result2 = 'p1'

      game.nextPlayer()

      expect(game.currentPlayer).toEqual(result1)

      game.nextPlayer()

      expect(game.currentPlayer).toEqual(result2)
    });
  });

  describe('Roll Dice', () => {
    it('should roll and return dice info', () => {
      const expected = {
        dice: [1, 2, 3, 4, 5],
        rollCount: 1
      }
      game.dice.newRoll = jest.fn().mockReturnValue({
        roll: expected.dice,
        rollCount: expected.rollCount
      })

      const result = game.rollDice()

      expect(game.dice.newRoll).toHaveBeenCalledTimes(1)
      expect(result).toEqual(expected)
    });
  });

  describe('Toggle Held Dice', () => {
    it('should toggle dice to be held', () => {
      const result = 2
      game.dice.toggleHold = jest.fn()

      game.toggleHeldDice(result)

      expect(game.dice.toggleHold).toBeCalledWith(result)
    });
  });

  describe('Get Points', () => {
    it('should return a current players points based on rolling a yahtzee', () => {
      game.dice.roll = [1, 1, 1, 1, 1]
      game.getPoints('px5')

      expect(game.points).toEqual(50)
    });
  });

  describe('Add Bonus', () => {
    it('should add a bonus to the player', () => {
      game.players.p1.addBonus = jest.fn()

      game.addBonus('p1')

      expect(game.players.p1.addBonus).toHaveBeenCalledTimes(1)
    });
  });
});