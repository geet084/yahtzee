import Game from '../game';
import Player from '../player';
import Dice from '../dice';

describe('Index', () => {
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
    it('should instantiate a game', () => {
      expect(game).toEqual(blankResult)
    });
  });
});