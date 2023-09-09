import Character from '../Character';

export default class Vampire extends Character {
  constructor(level, type = 'vampire') {
    super(level);
    this.level = level;
    this.type = type;
    this.attack = 25;
    this.defence = 25;
  }
}
