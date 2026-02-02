export interface ScoreEntry {
  name: string;
  score: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const ApiClient = {
  async getHighScores(): Promise<ScoreEntry[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/highscores`);
      if (!response.ok) throw new Error('Failed to fetch high scores');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  async submitScore(name: string, score: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/score`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, score }),
      });
      return response.ok;
    } catch (error) {
      console.error('API Error:', error);
      return false;
    }
  },
};
