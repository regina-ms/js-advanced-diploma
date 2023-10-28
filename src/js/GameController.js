/* eslint-disable no-param-reassign */
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';
import Bowman from './characters/classBowman';
import Swordsman from './characters/classSwordsman';
import Magician from './characters/classMagician';
import Daemon from './characters/classDaemon';
import Undead from './characters/classUndead';
import Vampire from './characters/classVampire';
import themes from './themes';
import GamePlay from './GamePlay';
import GameState from './GameState';
import Character from './Character';
import Team from './Team';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.teamSize = 4;
    this.teamTypes = {
      bot: [Daemon, Undead, Vampire],
      user: [Bowman, Swordsman, Magician],
    };

    this.botPlayers = [];
    this.userPlayers = [];
    this.points = 0;
    this.level = 1;
  }

  init(points = this.points) {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService

    if (this.stateService.load()) {
      this.onLoadGameClick();
    } else {
      this.gamePlay.drawUi(themes[1]);

      this.getPlayersCells();

      this.botTeam = generateTeam(this.teamTypes.bot, 1, this.teamSize);
      this.userTeam = generateTeam(this.teamTypes.user, 1, this.teamSize);

      this.positionCharacters(this.botTeam, this.botCells);
      this.positionCharacters(this.userTeam, this.userCells);

      this.positioned = [...this.botPlayers, ...this.userPlayers];

      this.gamePlay.redrawPositions(this.positioned);
      this.currentMoveTeam = 'user';
      this.points = points;
      this.level = 1;
    }

    const cellEnter = this.onCellEnter.bind(this);
    this.gamePlay.addCellEnterListener(cellEnter);

    const cellLeave = this.onCellLeave.bind(this);
    this.gamePlay.addCellLeaveListener(cellLeave);

    const cellClick = this.onCellClick.bind(this);
    this.gamePlay.addCellClickListener(cellClick);

    const saveGameClick = this.onSaveGameClick.bind(this);
    this.gamePlay.addSaveGameListener(saveGameClick);

    const newGameClick = this.onNewGameClick.bind(this);
    this.gamePlay.addNewGameListener(newGameClick);

    const loadGameClick = this.onLoadGameClick.bind(this);
    this.gamePlay.addLoadGameListener(loadGameClick);
  }

  onLoadGameClick() {
    try {
      this.state = GameState.from(this.stateService.load());
      this.formTeamsFromState();
      this.formPlayersFromState();

      this.positioned = [...this.botPlayers, ...this.userPlayers];
      this.level = this.state.level;
      this.currentMoveTeam = this.state.currentMoveTeam;
      this.gamePlay.drawUi(themes[this.level]);
      this.gamePlay.redrawPositions(this.positioned);
      this.points = this.state.points;
    } catch (e) {
      GamePlay.showError('Сохранений нет');
    }
  }

  formPlayersFromState() {
    this.botPlayers = [];
    this.userPlayers = [];
    this.state.botPlayers.forEach((el) => {
      const loadPlayer = Object.create(PositionedCharacter.prototype);
      Object.defineProperties(
        loadPlayer,
        Object.getOwnPropertyDescriptors(el),
      );
      this.botPlayers.push(loadPlayer);
    });

    this.state.userPlayers.forEach((el) => {
      const loadPlayer = Object.create(PositionedCharacter.prototype);
      Object.defineProperties(
        loadPlayer,
        Object.getOwnPropertyDescriptors(el),
      );
      this.userPlayers.push(loadPlayer);
    });
  }

  formTeamsFromState() {
    this.botTeam = new Team([]);
    this.userTeam = new Team([]);
    this.state.botTeam.characters.forEach((el) => {
      const loadChar = Object.create(Character.prototype);
      Object.defineProperties(
        loadChar,
        Object.getOwnPropertyDescriptors(el),
      );
      this.botTeam.characters.push(loadChar);
    });
    this.state.userTeam.characters.forEach((el) => {
      const loadChar = Object.create(Character.prototype);
      Object.defineProperties(
        loadChar,
        Object.getOwnPropertyDescriptors(el),
      );
      this.userTeam.characters.push(loadChar);
    });
  }

  onSaveGameClick() {
    this.state = new GameState(
      this.botTeam,
      this.userTeam,
      this.botPlayers,
      this.userPlayers,
      this.level,
      this.points,
      this.currentMoveTeam,
    );
    this.stateService.save(this.state);
  }

  onNewGameClick() {
    this.stateService.storage.clear();

    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.newGameListeners = [];
    this.gamePlay.saveGameListeners = [];
    this.gamePlay.loadGameListeners = [];

    this.botPlayers = [];
    this.userPlayers = [];
    this.init(this.points);
  }

  setSelected(index) {
    this.selected = this.positioned.find((el) => el.position === index);
    this.setAttackArea(this.selected);
    this.setMoveArea(this.selected);
  }

  onCellClick(index) {
    // TODO: react to click
    this.gamePlay.deselectCell(index);

    if (this.selected) {
      this.userLogic(index);
    }

    const botChar = this.botPlayers.find((el) => el.position === index);
    if (!this.selected && botChar) {
      GamePlay.showError('Выберите персонажа из своей команды слева');
      return;
    }

    const userChar = this.userPlayers.find((el) => el.position === index);
    if (!this.selected && userChar) {
      this.setSelected(index);
      this.gamePlay.selectCell(index);
    }
  }

  userLogic(index) {
    const userPlayer = this.userPlayers.find((el) => el.position === index);
    const botPlayer = this.botPlayers.find((el) => el.position === index);
    const botCell = this.selected.attackArea.find((el) => el === index);
    const moveCell = this.selected.moveArea.find((el) => el === index);

    if (userPlayer) {
      this.gamePlay.deselectCell(this.selected.position);
      this.setSelected(index);
      this.gamePlay.selectCell(index);
    } else if (moveCell && !botPlayer) {
      this.gamePlay.deselectCell(this.selected.position);
      this.makeMove(index);
      this.currentMoveTeam = 'bot';

      setTimeout(() => this.botPlayersLogic(), 1000);
    } else if (botPlayer && botCell) {
      this.gamePlay.deselectCell(this.selected.position);
      this.attack(botPlayer.position, botPlayer).then(() => {
        this.points += 10;
        if (this.botPlayers.length === 0) {
          this.newLevel(this.level + 1);
        } else {
          this.currentMoveTeam = 'bot';
          setTimeout(() => this.botPlayersLogic(), 1000);
        }
      });
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter

    for (const char of this.positioned) {
      if (char.position === index) {
        const message = GameController.getTooltipMessage`
        \u{1F396}${char.character.level} \u2694${char.character.attack} \u{1F6E1}${char.character.defence} \u2764${char.character.health}
        `;
        this.gamePlay.showCellTooltip(message, index);
      }
    }

    if (this.selected && this.currentMoveTeam === 'user') {
      this.setCursor(index);
    } else {
      this.gamePlay.setCursor('default');
    }
  }

  setCursor(index) {
    const userChar = this.userPlayers.find((el) => el.position === index);
    const botChar = this.botPlayers.find((el) => el.position === index);
    const moveCell = this.selected.moveArea.find((el) => el === index);
    const attackCell = this.selected.attackArea.find((el) => el === index);

    if (userChar) {
      this.gamePlay.setCursor('pointer');
    } else if (botChar && attackCell) {
      this.gamePlay.setCursor('crosshair');
      this.gamePlay.selectCell(index, 'red');
    } else if ((moveCell && !botChar) || (moveCell === 0 && !botChar)) {
      this.gamePlay.setCursor('pointer');
      this.gamePlay.selectCell(index, 'green');
    } else {
      this.gamePlay.setCursor('not-allowed');
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
    if (this.selected && this.selected.position !== index) {
      this.gamePlay.deselectCell(index);
    }
  }

  charDied(char) {
    const bot = this.botPlayers.find((el) => el === char);
    const user = this.userPlayers.find((el) => el === char);
    if (bot) {
      this.botPlayers.splice(this.botPlayers.indexOf(char), 1);
      this.botTeam.characters
        .splice(this.botTeam.characters.find((el) => el === char.character), 1);
    } else if (user) {
      this.userPlayers.splice(this.userPlayers.indexOf(char), 1);
      this.userTeam.characters
        .splice(this.userTeam.characters.find((el) => el === char.character), 1);
    }
    this.positioned = this.botPlayers.concat(this.userPlayers);
  }

  makeMove(index) {
    const botMove = this.botPlayers.find((el) => el.position === this.selected.position);
    const userMove = this.userPlayers.find((el) => el.position === this.selected.position);
    if (botMove) {
      this.botPlayers.find((el) => el === botMove).position = index;
    } else if (userMove) {
      this.userPlayers.find((el) => el === userMove).position = index;
    }

    this.positioned = [...this.botPlayers, ...this.userPlayers];
    this.gamePlay.redrawPositions(this.positioned);
    this.selected = null;
  }

  attack(index, char) {
    return new Promise((resolve) => {
      const target = char;
      const attacker = this.selected;
      const damage = Math.ceil(Math.max(
        attacker.character.attack - target.character.defence,
        attacker.character.attack * 0.1,
      ));
      this.gamePlay.showDamage(index, damage).then(() => {
        target.character.health -= damage;
        if (target.character.health <= 0) {
          this.charDied(target);
        }
        this.gamePlay.redrawPositions(this.positioned);
        this.selected = null;
        resolve();
      });
    });
  }

  newLevel(level) {
    if (level > 4) {
      this.gamePlay.cellClickListeners = [];
      this.gamePlay.cellEnterListeners = [];
      this.gamePlay.saveGameListeners = [];
      this.gamePlay.loadGameListeners = [];
      return;
    }

    this.botPlayers = [];
    this.userPlayers = [];
    this.getPlayersCells();

    this.botTeam = generateTeam(this.teamTypes.bot, 1, this.teamSize);
    this.positionCharacters(this.botTeam, this.botCells);

    const newUserPositions = this.getPositions(this.userCells);
    this.userTeam.characters.forEach((el, index) => {
      this.userPlayers.push(new PositionedCharacter(el, newUserPositions[index]));
    });

    this.positioned = this.userPlayers.concat(this.botPlayers);
    this.positioned.forEach((el) => {
      el.character.levelUp(level);
    });
    this.level = level;
    this.gamePlay.drawUi(themes[level]);
    this.gamePlay.redrawPositions(this.positioned);
  }

  botPlayersLogic() {
    const randomBotCharIndex = Math.floor(Math.random() * this.botPlayers.length);
    this.setSelected(this.botPlayers[randomBotCharIndex].position);

    const target = this.userPlayers.find((el) => this.selected.attackArea
      .includes(el.position));

    if (target) {
      this.attack(target.position, target);
      this.currentMoveTeam = 'user';
    } else {
      const positions = [];
      for (const item of this.positioned) {
        positions.push(item.position);
      }

      const moveCells = this.selected.moveArea.filter((el) => !positions.includes(el));
      const randomMoveCell = moveCells[Math.floor(Math.random() * moveCells.length)];

      this.makeMove(randomMoveCell);

      this.currentMoveTeam = 'user';
    }
  }

  positionCharacters(team, cells) {
    const positions = this.getPositions(cells);

    switch (team) {
      case this.botTeam:
        this.botTeam.characters.forEach((el, index) => {
          this.botPlayers.push(new PositionedCharacter(el, positions[index]));
        });
        break;

      case this.userTeam:
        this.userTeam.characters.forEach((el, index) => {
          this.userPlayers.push(new PositionedCharacter(el, positions[index]));
        });
        break;

      default:
        break;
    }
  }

  getPositions(allowedCells) {
    const positions = [];

    for (let i = 0; i < this.teamSize; i += 1) {
      const randomIndex = Math.floor(Math.random() * (allowedCells.length - i));
      positions.push(allowedCells[randomIndex]);
      allowedCells.splice(randomIndex, 1);
    }

    return positions;
  }

  getPlayersCells() {
    this.userCells = [];
    this.botCells = [];

    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      if (i % this.gamePlay.boardSize === 0) {
        this.userCells.push(i);
        this.userCells.push(i + 1);
      } else if ((i + 1) % this.gamePlay.boardSize === 0) {
        this.botCells.push(i - 1);
        this.botCells.push(i);
      }
    }
  }

  getColumn(index, area) {
    const top = [];
    const bottom = [];

    for (let i = 1; i <= area; i += 1) {
      const topIndex = index - this.gamePlay.boardSize * i;
      if (topIndex >= 0) top.push(topIndex);
    }

    for (let i = 1; i <= area; i += 1) {
      const bottomIndex = index + this.gamePlay.boardSize * i;
      if (bottomIndex < this.gamePlay.cells.length) bottom.push(bottomIndex);
    }
    return bottom.concat(top);
  }

  getRow(index, area) {
    const right = [];
    const left = [];
    for (let i = 1; i <= area; i += 1) {
      if ((index + 1) % this.gamePlay.boardSize === 0) break;
      const rightIndex = index + i;
      if ((rightIndex + 1) % this.gamePlay.boardSize === 0) {
        right.push(rightIndex);
        break;
      }
      right.push(rightIndex);
    }

    for (let i = 1; i <= area; i += 1) {
      if (index % this.gamePlay.boardSize === 0) break;
      const leftIndex = index - i;
      if (leftIndex % this.gamePlay.boardSize === 0) {
        left.push(leftIndex);
        break;
      }
      left.push(leftIndex);
    }
    return right.concat(left);
  }

  getInsideSquare(index, area) {
    const row = this.getRow(index, area);
    let inside = [];
    for (const item of row) {
      inside = inside.concat(this.getColumn(item, area));
    }
    return inside;
  }

  getAcross(index, area) {
    const inside = this.getInsideSquare(index, area);
    const across = [];
    for (let i = 1; i <= area; i += 1) {
      const moveLeftDown = (this.gamePlay.boardSize - 1) * i;
      if (index % this.gamePlay.boardSize === 0) break;
      const item = inside.find((el) => el === index + moveLeftDown);
      if (item !== undefined) {
        across.push(item);
      }
      if (item % this.gamePlay.boardSize === 0) break;
    }

    for (let i = 1; i <= area; i += 1) {
      const moveRightDown = (this.gamePlay.boardSize + 1) * i;
      const item = inside.find((el) => el === index + moveRightDown);
      if (item !== undefined) {
        across.push(item);
      }
      if ((item + 1) % this.gamePlay.boardSize === 0) break;
    }

    for (let i = 1; i <= area; i += 1) {
      const moveRightUp = (this.gamePlay.boardSize - 1) * i;
      const item = inside.find((el) => el === index - moveRightUp);
      if (item !== undefined) {
        across.push(item);
      }
      if ((item + 1) % this.gamePlay.boardSize === 0) break;
    }

    for (let i = 1; i <= area; i += 1) {
      const moveLeftUp = (this.gamePlay.boardSize + 1) * i;
      const item = inside.find((el) => el === index - moveLeftUp);
      if (item !== undefined) {
        across.push(item);
      }
      if (item % this.gamePlay.boardSize === 0) break;
    }
    return across;
  }

  setAttackArea(positioned) {
    switch (positioned.character.type) {
      case 'swordsman':
      case 'undead':
        positioned.attackArea = this.getColumn(positioned.position, 1)
          .concat(this.getRow(positioned.position, 1))
          .concat(this.getInsideSquare(positioned.position, 1));
        break;
      case 'bowman':
      case 'vampire':
        positioned.attackArea = this.getColumn(positioned.position, 2)
          .concat(this.getRow(positioned.position, 2))
          .concat(this.getInsideSquare(positioned.position, 2));
        break;
      case 'magician':
      case 'daemon':
        positioned.attackArea = this.getColumn(positioned.position, 4)
          .concat(this.getRow(positioned.position, 4))
          .concat(this.getInsideSquare(positioned.position, 4));
        break;
      default:
        break;
    }
  }

  setMoveArea(positioned) {
    switch (positioned.character.type) {
      case 'swordsman':
      case 'undead':
        positioned.moveArea = this.getColumn(positioned.position, 4)
          .concat(this.getRow(positioned.position, 4))
          .concat(this.getAcross(positioned.position, 4));
        break;
      case 'bowman':
      case 'vampire':
        positioned.moveArea = this.getColumn(positioned.position, 2)
          .concat(this.getRow(positioned.position, 2))
          .concat(this.getAcross(positioned.position, 2));
        break;
      case 'magician':
      case 'daemon':
        positioned.moveArea = this.getColumn(positioned.position, 1)
          .concat(this.getRow(positioned.position, 1))
          .concat(this.getAcross(positioned.position, 1));
        break;
      default:
        break;
    }
  }

  static getTooltipMessage(strings, ...expr) {
    let str = '';
    for (let i = 0; i < strings.length - 1; i += 1) {
      str += `${strings[i]}${expr[i]} `;
    }
    return str;
  }
}
