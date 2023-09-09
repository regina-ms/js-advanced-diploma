import Team from './Team';
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  while (true) {
    const randomLevel = Math.ceil(Math.random() * maxLevel);
    const maxIndex = allowedTypes.length;
    const randomIndex = Math.floor(Math.random() * maxIndex);
    const RandomCharacter = allowedTypes[randomIndex];
    yield new RandomCharacter(randomLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const charactersInTeam = [];
  // eslint-disable-next-line no-plusplus
  for (let i = 1; i <= characterCount; i++) {
    charactersInTeam.push(characterGenerator(allowedTypes, maxLevel).next().value);
  }
  return new Team(charactersInTeam);
}
