import GamePlay from './GamePlay';

export default class GameState {
  constructor(botTeam, userTeam, botPlayers, userPlayers, level, points, currentMoveTeam) {
    this.botTeam = botTeam;
    this.botPlayers = botPlayers;
    this.userPlayers = userPlayers;
    this.userTeam = userTeam;
    this.level = level;
    this.currentMoveTeam = currentMoveTeam;
    this.points = points;
  }

  static from(object) {
    // TODO: create object

    return new GameState(
      object.botTeam,
      object.userTeam,
      object.botPlayers,
      object.userPlayers,
      object.level,
      object.points,
      object.currentMoveTeam,
    );
  }
}
