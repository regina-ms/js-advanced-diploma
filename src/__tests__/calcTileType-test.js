import { calcTileType } from '../js/utils';

test.each([
  ['top-left', 0, 5],
  ['top-right', 10, 11],
  ['bottom-left', 56, 8],
  ['bottom-right', 24, 5],
  ['top', 7, 11],
  ['right', 39, 8],
  ['left', 5, 5],
  ['bottom', 119, 11],
  ['center', 22, 8],
])(('should return %s with args %i, %i'), (expected, index, boardSize) => {
  expect(calcTileType(index, boardSize)).toBe(expected);
});
