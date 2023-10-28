import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level);
    this.level = level;
    this.type = 'vampire';
    this.attack = 25;
    this.defence = 25;
    if (level > 1) {
      this.levelUp(level);
    }
  }
}
