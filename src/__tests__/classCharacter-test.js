import Character from '../js/Character';
import Daemon from '../js/characters/classDaemon';
import Bowman from '../js/characters/classBowman';
import Magician from '../js/characters/classMagician';
import Swordsman from '../js/characters/classSwordsman';
import Undead from '../js/characters/classUndead';
import Vampire from '../js/characters/classVampire';

test('should throw a error', () => {
  expect(() => {
    // eslint-disable-next-line no-unused-vars
    const char = new Character(2);
  }).toThrow();
});

test('should create a new Character', () => {
  const char = new Daemon(1);
  expect(char).toBeInstanceOf(Character);
});

test.each([
  [new Daemon(1), 10, 10, 'daemon', 1],
  [new Bowman(1), 25, 25, 'bowman', 1],
  [new Swordsman(1), 40, 10, 'swordsman', 1],
  [new Magician(1), 10, 40, 'magician', 1],
  [new Undead(1), 40, 10, 'undead', 1],
  [new Vampire(1), 25, 25, 'vampire', 1],
])(('should return %s with attack %i, defence %i, type %s, level %i'), (char, attack, defence, type, level) => {
  expect(char.attack).toBe(attack);
  expect(char.defence).toBe(defence);
  expect(char.type).toBe(type);
  expect(char.level).toBe(level);
});
