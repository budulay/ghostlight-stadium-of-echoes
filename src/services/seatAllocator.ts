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
      // Top grandstand
      x = 20 + ((existingCount * 17) % 60) + jitterX * 0.5;
      y = tier === 'Upper Tier' ? 14 + jitterY * 0.3 : tier === 'Lower Tier' ? 24 + jitterY * 0.3 : 32 + jitterY * 0.3;
      break;
    case 'South Stand':
      // Bottom grandstand
      x = 20 + ((existingCount * 19) % 60) + jitterX * 0.5;
      y = tier === 'Upper Tier' ? 84 + jitterY * 0.3 : tier === 'Lower Tier' ? 74 + jitterY * 0.3 : 66 + jitterY * 0.3;
      break;
    case 'West Stand':
      // Left grandstand
      x = tier === 'Upper Tier' ? 12 + jitterX * 0.3 : tier === 'Lower Tier' ? 20 + jitterX * 0.3 : 26 + jitterX * 0.3;
      y = 28 + ((existingCount * 13) % 44) + jitterY * 0.5;
      break;
    case 'East Stand':
      // Right grandstand
      x = tier === 'Upper Tier' ? 88 + jitterX * 0.3 : tier === 'Lower Tier' ? 80 + jitterX * 0.3 : 74 + jitterX * 0.3;
      y = 28 + ((existingCount * 23) % 44) + jitterY * 0.5;
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
