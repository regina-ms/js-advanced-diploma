import { generateTeam } from '../js/generators';
import Character from '../js/Character';
import Bowman from '../js/characters/classBowman';
import Swordsman from '../js/characters/classSwordsman';
import Magician from '../js/characters/classMagician';

const allowedTypes = [Bowman, Swordsman, Magician];

test.each([
  [generateTeam(allowedTypes, 4, 5), 4, 5],
  [generateTeam(allowedTypes, 2, 3), 2, 3],
])(('should return %s with max level %i, length %i'), (team, maxLevel, length) => {
  expect(team.characters.length).toBe(length);
  for (const char of team.characters) {
    expect(char.level <= maxLevel).toBeTruthy();
  }
});
