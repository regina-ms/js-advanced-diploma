import { characterGenerator } from '../js/generators';
import Character from '../js/Character';
import Bowman from '../js/characters/classBowman';
import Swordsman from '../js/characters/classSwordsman';
import Magician from '../js/characters/classMagician';

test('should always return a character', () => {
  const allowedTypes = [Bowman, Swordsman, Magician];
  let i = 0;
  while (i < (1000)) {
    expect(characterGenerator(allowedTypes, 3).next().value).toBeInstanceOf(Character);
    i += 1;
  }
});
