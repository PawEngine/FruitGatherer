export interface Platform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const PLATFORMS: Platform[] = [
  { x: 500, y: 500, width: 200, height: 20 },  // Center platform (very low)
  { x: 150, y: 420, width: 150, height: 20 },  // Left platform
  { x: 900, y: 420, width: 150, height: 20 },  // Right platform
];
