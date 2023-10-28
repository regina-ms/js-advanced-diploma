import GameStateService from '../js/GameStateService';
import GamePlay from '../js/GamePlay';

const gameStateService = new GameStateService();

const mockCalled = jest.fn(gameStateService.load);
const mockReturned = jest.fn(GamePlay.showError);

test('должна быть вызвана функци showError', () => {
  mockReturned.mockReturnValue('error');
  mockCalled.mockReturnValue(mockReturned());
  mockCalled();
  expect(mockCalled).toHaveReturnedWith('error');
});
