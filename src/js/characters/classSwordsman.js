import Character from '../Character';

export default class Swordsman extends Character {
  constructor(level) {
    super(level);
    this.level = level;
    this.type = 'swordsman';
    this.attack = 40;
    this.defence = 10;
    if (level > 1) {
      this.levelUp(level);
    }
  }
}
