import Tile from './models/Tile';

const tileBreakdown = [
  { letter: 'A', count: 13 },
  { letter: 'B', count: 3 },
  { letter: 'C', count: 3 },
  { letter: 'D', count: 6 },
  { letter: 'E', count: 18 },
  { letter: 'F', count: 3 },
  { letter: 'G', count: 4 },
  { letter: 'H', count: 3 },
  { letter: 'I', count: 12 },
  { letter: 'J', count: 2 },
  { letter: 'K', count: 2 },
  { letter: 'L', count: 5 },
  { letter: 'M', count: 3 },
  { letter: 'N', count: 8 },
  { letter: 'O', count: 11 },
  { letter: 'P', count: 3 },
  { letter: 'Q', count: 2 },
  { letter: 'R', count: 9 },
  { letter: 'S', count: 6 },
  { letter: 'T', count: 9 },
  { letter: 'U', count: 6 },
  { letter: 'V', count: 3 },
  { letter: 'W', count: 3 },
  { letter: 'X', count: 2 },
  { letter: 'Y', count: 3 },
  { letter: 'Z', count: 2 },
];

export const getTiles = (multiplier: number): Tile[] =>
  tileBreakdown
    .map(({ letter, count }) =>
      Array(count * multiplier)
        .fill(null)
        .map((_, i) => new Tile(`${letter}${i}`, letter))
    )
    .flat();

export default tileBreakdown;
