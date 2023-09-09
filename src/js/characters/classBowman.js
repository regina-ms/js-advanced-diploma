import Character from '../Character';

export default class Bowman extends Character {
  constructor(level, type = 'bowman') {
    super(level);
    this.level = level;
    this.type = type;
    this.attack = 25;
    this.defence = 25;
  }
}
