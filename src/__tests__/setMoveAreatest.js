import GameController from '../js/GameController';
import GamePlay from '../js/GamePlay';
import GameState from '../js/GameState';
import PositionedCharacter from '../js/PositionedCharacter';
import Bowman from '../js/characters/classBowman';
import Daemon from '../js/characters/classDaemon';
import Magician from '../js/characters/classMagician';
import Swordsman from '../js/characters/classSwordsman';
import Undead from '../js/characters/classUndead';
import Vampire from '../js/characters/classVampire';

test.each([
  [17, new Magician(1), 8],
  [55, new Daemon(1), 63],
  [42, new Vampire(1), 56],
  [23, new Bowman(1), 7],
  [56, new Undead(1), 60],
  [36, new Swordsman(1), 0],
])(('индекс %i входит в зону передвижения персонажа класса %s на позиции %i'), (expected, char, index) => {
  const play = new GamePlay();
  const state = new GameState();
  const game = new GameController(play, state);
  play.cells.length = 63;

  const positioned = new PositionedCharacter(char, index);
  game.setMoveArea(positioned);
  expect(positioned.moveArea.includes(expected)).toBeTruthy();
});

test.each([
  [35, new Magician(1), 22],
  [45, new Daemon(1), 50],
  [41, new Vampire(1), 56],
  [43, new Bowman(1), 28],
  [9, new Undead(1), 0],
  [24, new Swordsman(1), 32],
])(('индекс %i входит в зону атаки персонажа класса %s на позиции %i'), (expected, char, index) => {
  const play = new GamePlay();
  const state = new GameState();
  const game = new GameController(play, state);
  play.cells.length = 63;

  const positioned = new PositionedCharacter(char, index);
  game.setAttackArea(positioned);
  expect(positioned.attackArea.includes(expected)).toBeTruthy();
});
