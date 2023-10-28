import Character from '../Character';

export default class Daemon extends Character {
  constructor(level) {
    super(level);
    this.level = 1;
    this.type = 'daemon';
    this.attack = 10;
    this.defence = 10;
    if (level > 1) {
      this.levelUp(level);
    }
  }
}
