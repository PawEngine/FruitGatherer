export const PHYSICS = {
  GRAVITY: 1000,
  MOVE_ACCELERATION: 1500,
  MAX_SPEED: 400,
  JUMP_FORCE: -750,  // Increased for better platform reach
  FRICTION: 10,
  GROUND_HEIGHT: 60,
  ITEM_GRAVITY: 500,
  ITEM_BOUNCE: 0.6
};

export const COLORS = {
  BACKGROUND: '#5AB9EA',    // Bright sky blue
  GROUND: '#8B6F47',        // Warm brown
  GROUND_TOP: '#7EC850',    // Vibrant grass green
  PIPE: '#4CAF50',          // Modern green
  PIPE_DARK: '#388E3C',     // Darker green
  PLAYER: '#FF0000',
  TEXT: '#FFFFFF',
  TEXT_SHADOW: '#000000',
  APPLE: '#FFD700',         // Gold
  BANANA: '#FFE135',        // Bright yellow
  ORANGE: '#FF8C42',        // Vibrant orange
  SPIKE: '#2C2C2C',         // Dark gray
  PLATFORM: '#D4A574',      // Light wood
  PLATFORM_DARK: '#A67C52', // Dark wood
  HEART: '#FF1744',         // Bright red
  CLOUD: '#FFFFFF'          // White clouds
};

export const SPAWN = {
  PIPE_OFFSET_Y: 80,
  PIPE_EXTEND: 60,
  INTERVAL_INITIAL: 2.0,
  INTERVAL_MIN: 0.5,
  INTERVAL_MAX: 3.0
};

export const GAME_DURATION = 120; // seconds

export const DIFFICULTY_CURVE = [
  { time: 0, spawnInterval: 2.0 },    // Start
  { time: 30, spawnInterval: 1.5 },   // 30s
  { time: 60, spawnInterval: 1.2 },   // 60s
  { time: 90, spawnInterval: 0.9 },   // 90s
  { time: 110, spawnInterval: 0.7 }   // 110s
];

export const FRUIT_SCORES = {
  APPLE: 200,
  BANANA: 100,
  ORANGE: 150
};
