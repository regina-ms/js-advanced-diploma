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

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerTypes = [Bowman, Swordsman, Magician];
    this.enemyTypes = [Daemon, Undead, Vampire];
    this.teamSize = 4;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.gamePlay.drawUi(themes.prairie);

    const playerCells = this.getPlayerCells();
    const playerPositions = this.getPositions(playerCells);
    const playerTeam = generateTeam(this.playerTypes, 1, this.teamSize);
    const positionedPlayers = [];
    for (let i = 0; i < playerTeam.characters.length; i += 1) {
      positionedPlayers.push(new PositionedCharacter(playerTeam.characters[i], playerPositions[i]));
    }

    const enemyCells = this.getEnemyCells();
    const enemyPositions = this.getPositions(enemyCells);
    const enemyTeam = generateTeam(this.enemyTypes, 1, this.teamSize);
    const positionedEnemy = [];
    for (let i = 0; i < enemyTeam.characters.length; i += 1) {
      positionedEnemy.push(new PositionedCharacter(enemyTeam.characters[i], enemyPositions[i]));
    }

    this.positioned = positionedPlayers.concat(positionedEnemy);
    this.gamePlay.redrawPositions(this.positioned);

    const cellEnter = this.onCellEnter.bind(this);
    this.gamePlay.addCellEnterListener(cellEnter);
    const cellLeave = this.onCellLeave.bind(this);
    this.gamePlay.addCellLeaveListener(cellLeave);
    const cellClick = this.onCellClick.bind(this);
    this.gamePlay.addCellClickListener(cellClick);
  }

  onCellClick(index) {
    // TODO: react to click
    const selectedCell = this.gamePlay.cells.find((el) => el.classList.contains('selected'));
    if (selectedCell) {
      this.gamePlay.deselectCell(this.gamePlay.cells.indexOf(selectedCell));
    }
    const char = this.positioned.find((el) => el.position === index);
    const types = [];
    for (const Character of this.playerTypes) {
      types.push(new Character().type);
    }

    if (char && types.includes(char.character.type)) {
      this.gamePlay.selectCell(index);
      GameState.from(char);
    } else {
      GamePlay.showError('er');
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
  }

  static getTooltipMessage(strings, ...expr) {
    let str = '';
    for (let i = 0; i < strings.length - 1; i += 1) {
      str += `${strings[i]}${expr[i]} `;
    }
    return str;
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    this.gamePlay.hideCellTooltip(index);
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

  getPlayerCells() {
    const playerCells = [];
    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      if (i % this.gamePlay.boardSize === 0) {
        playerCells.push(i);
        playerCells.push(i + 1);
      }
    }
    return playerCells;
  }

  getEnemyCells() {
    const enemyCells = [];
    for (let i = 0; i < this.gamePlay.cells.length; i += 1) {
      if ((i + 1) % this.gamePlay.boardSize === 0) {
        enemyCells.push(i - 1);
        enemyCells.push(i);
      }
    }
    return enemyCells;
  }
}
