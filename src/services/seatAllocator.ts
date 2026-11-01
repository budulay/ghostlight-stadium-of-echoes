import { StadiumSeatLocation } from '../types/memory';

const STANDS: Array<StadiumSeatLocation['stand']> = [
  'North Stand',
  'South Stand',
  'East Stand',
  'West Stand',
];

const TIERS: Array<StadiumSeatLocation['tier']> = [
  'Upper Tier',
  'Lower Tier',
  'Terrace',
];

/**
 * Generates an illuminated stadium coordinate for a new memory.
 * Ensures points are distributed naturally throughout the stadium grandstands.
 */
export function allocateStadiumSeat(existingCount = 0): StadiumSeatLocation {
  const stand = STANDS[existingCount % STANDS.length];
  const tier = TIERS[Math.floor(existingCount / 4) % TIERS.length];
  const sectorNumber = (existingCount % 12) + 1;
  const seatNumber = ((existingCount * 7) % 80) + 1;

  let x = 50;
  let y = 50;

  // Stand-specific geometric distributions around the stadium oval
  const jitterX = (Math.sin(existingCount * 2.3) * 12);
  const jitterY = (Math.cos(existingCount * 1.7) * 8);

  switch (stand) {
    case 'North Stand':
      // Top grandstand rows (strictly above the pitch Y: 24.6%)
      x = 24 + ((existingCount * 17) % 52) + (Math.sin(existingCount * 2.3) * 4);
      y = tier === 'Upper Tier' ? 12 : tier === 'Lower Tier' ? 16 : 19.5;
      break;
    case 'South Stand':
      // Bottom grandstand rows (strictly below the pitch Y: 75.4%)
      x = 24 + ((existingCount * 19) % 52) + (Math.sin(existingCount * 2.3) * 4);
      y = tier === 'Upper Tier' ? 88 : tier === 'Lower Tier' ? 84 : 80.5;
      break;
    case 'West Stand':
      // Left grandstand rows (strictly to the left of pitch X: 22%)
      x = tier === 'Upper Tier' ? 10 : tier === 'Lower Tier' ? 14 : 17.5;
      y = 28 + ((existingCount * 13) % 44) + (Math.cos(existingCount * 1.7) * 4);
      break;
    case 'East Stand':
      // Right grandstand rows (strictly to the right of pitch X: 78%)
      x = tier === 'Upper Tier' ? 90 : tier === 'Lower Tier' ? 86 : 82.5;
      y = 28 + ((existingCount * 23) % 44) + (Math.cos(existingCount * 1.7) * 4);
      break;
  }

  // Constrain within bounds (8% to 92%)
  x = Math.max(8, Math.min(92, Math.round(x)));
  y = Math.max(10, Math.min(90, Math.round(y)));

  return {
    stand,
    tier,
    sectorNumber,
    seatNumber,
    x,
    y,
  };
}
