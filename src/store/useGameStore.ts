import { create } from 'zustand';
import { ApiClient, type ScoreEntry } from '../api/ApiClient';

export type GameState = 'TITLE' | 'PLAYING' | 'GAME_OVER';

interface GameStore {
  gameState: GameState;
  score: number;
  highScore: number;
  lives: number;
  timeRemaining: number;
  highScores: ScoreEntry[];
  startGame: () => void;
  endGame: () => void;
  resetGame: () => void;
  addScore: (points: number) => void;
  loseLife: () => void;
  decreaseTime: (delta: number) => void;
  setGameState: (state: GameState) => void;
  isMuted: boolean;
  toggleMute: () => void;
  volume: number;
  setVolume: (value: number) => void;
  fetchHighScores: () => Promise<void>;
  submitScore: (name: string) => Promise<void>;
}

export const useGameStore = create<GameStore>((set) => ({
  gameState: 'TITLE',
  score: 0,
  highScore: 0,
  lives: 3,
  timeRemaining: 120,
  isMuted: false,
  volume: 0.5,
  highScores: [],
  toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
  setVolume: (value) => set({ volume: Math.max(0, Math.min(1, value)) }),
  startGame: () => {
    set({ gameState: 'PLAYING', score: 0, lives: 3, timeRemaining: 120 });
  },
  endGame: () => set((state) => ({
    gameState: 'GAME_OVER',
    highScore: Math.max(state.score, state.highScore),
    lives: 0,
    timeRemaining: 0
  })),
  resetGame: () => set({ gameState: 'TITLE', score: 0, lives: 3, timeRemaining: 120 }),
  addScore: (points) => set((state) => ({ score: state.score + points })),
  loseLife: () => set((state) => {
    const newLives = state.lives - 1;
    if (newLives <= 0) {
      return {
        lives: 0,
        gameState: 'GAME_OVER',
        highScore: Math.max(state.score, state.highScore),
        timeRemaining: 0
      };
    }
    return { lives: newLives };
  }),
  decreaseTime: (delta) => set((state) => {
    const newTime = Math.max(0, state.timeRemaining - delta);
    if (newTime <= 0 && state.gameState === 'PLAYING') {
      return {
        timeRemaining: 0,
        gameState: 'GAME_OVER',
        highScore: Math.max(state.score, state.highScore),
        lives: 0
      };
    }
    return { timeRemaining: newTime };
  }),
  setGameState: (state) => set({ gameState: state }),
  fetchHighScores: async () => {
    const scores = await ApiClient.getHighScores();
    set({ highScores: scores });
  },
  submitScore: async (name) => {
    const { score } = useGameStore.getState();
    const success = await ApiClient.submitScore(name, score);
    if (success) {
      const scores = await ApiClient.getHighScores();
      set({ highScores: scores });
    }
  },
}));
