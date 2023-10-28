import Character from '../Character';

export default class Magician extends Character {
  constructor(level) {
    super(level);
    this.level = level;
    this.type = 'magician';
    this.attack = 10;
    this.defence = 40;
    if (level > 1) {
      this.levelUp(level);
    }
  }
}
