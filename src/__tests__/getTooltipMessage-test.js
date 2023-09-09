import GameController from '../js/GameController';
import Bowman from '../js/characters/classBowman';

test('should return characteristic string', () => {
  const ink = new Bowman(1);
  const result = GameController.getTooltipMessage`level-${ink.level}attack-${ink.attack}defence-${ink.defence}health-${ink.health}`;
  expect(result).toMatch('level-1 attack-25 defence-25 health-50');
});
