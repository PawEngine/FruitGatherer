import React from 'react';
import { useGameStore } from '../store/useGameStore';

const ScoreBoard: React.FC<{ scores: any[] }> = ({ scores }) => (
  <div style={{
    background: 'rgba(0,0,0,0.6)',
    padding: '20px',
    borderRadius: '12px',
    marginTop: '20px',
    minWidth: '250px',
    color: '#FFD700',
    border: '2px solid #FFD700'
  }}>
    <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>🌍 WORLD RANKING</h3>
    <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
      {scores.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#fff' }}>No scores yet</div>
      ) : (
        scores.map((s, i) => (
          <div key={i} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            padding: '4px 0',
            borderBottom: '1px solid rgba(255,215,0,0.3)',
            color: i === 0 ? '#FFF' : '#FFD700',
            fontWeight: i === 0 ? 'bold' : 'normal'
          }}>
            <span>{i + 1}. {s.name}</span>
            <span>{s.score.toLocaleString()}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

const TitleScreen: React.FC = () => {
  const { startGame, highScores } = useGameStore();

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      background: 'rgba(0,0,0,0.7)', color: 'white',
      zIndex: 10
    }}>
      <h1 style={{ fontSize: '48px', marginBottom: '10px', textShadow: '2px 2px #4CAF50' }}>FRUIT GATHERER</h1>
      <p style={{ fontSize: '18px', marginBottom: '30px' }}>フルーツを集めてハイスコアを目指そう！</p>
      <button 
        onClick={startGame}
        style={{
          padding: '15px 40px',
          fontSize: '24px',
          backgroundColor: '#4CAF50',
          border: 'none',
          borderRadius: '30px',
          color: 'white',
          cursor: 'pointer',
          boxShadow: '0 5px #2E7D32',
          transition: 'all 0.1s'
        }}
      >
        START GAME
      </button>
      <ScoreBoard scores={highScores} />
    </div>
  );
};

const GameOverScreen: React.FC = () => {
  const { score, highScore, resetGame, highScores, submitScore } = useGameStore();
  const [playerName, setPlayerName] = React.useState('ANONYMOUS');
  const [hasSubmitted, setHasSubmitted] = React.useState(false);

  const handleSubmit = async () => {
    if (playerName.trim()) {
      await submitScore(playerName);
      setHasSubmitted(true);
    }
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      background: 'rgba(0,0,0,0.85)', color: 'white',
      zIndex: 10
    }}>
      <h1 style={{ fontSize: '64px', color: '#FF1744', marginBottom: '10px' }}>GAME OVER</h1>
      <div style={{ fontSize: '32px', marginBottom: '10px' }}>SCORE: {score}</div>
      <div style={{ fontSize: '20px', color: '#FFD700', marginBottom: '30px' }}>PERSONAL BEST: {highScore}</div>
      
      {!hasSubmitted ? (
        <div style={{ marginBottom: '30px', textAlign: 'center' }}>
          <input 
            type="text" 
            maxLength={10} 
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value.toUpperCase())}
            style={{
              padding: '10px',
              fontSize: '18px',
              borderRadius: '4px',
              border: 'none',
              marginRight: '10px',
              width: '150px',
              textAlign: 'center'
            }}
          />
          <button 
            onClick={handleSubmit}
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              backgroundColor: '#FFD700',
              border: 'none',
              borderRadius: '4px',
              color: '#000',
              cursor: 'pointer'
            }}
          >
            ランクイン！
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '30px', color: '#4CAF50', fontSize: '18px' }}>スコアを送信しました！</div>
      )}

      <button 
        onClick={resetGame}
        style={{
          padding: '12px 30px',
          fontSize: '20px',
          backgroundColor: '#2196F3',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer'
        }}
      >
        RETRY
      </button>
      <ScoreBoard scores={highScores} />
    </div>
  );
};

export const HUD: React.FC = () => {
  const { score, gameState, timeRemaining, isMuted, toggleMute, volume, setVolume } = useGameStore();

  if (gameState !== 'PLAYING') return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isTimeLow = timeRemaining <= 30;

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none',
      padding: '20px',
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'space-between',
      color: 'white',
      fontFamily: 'monospace',
      fontSize: '24px',
      textShadow: '2px 2px 0 #000'
    }}>
      <div style={{ pointerEvents: 'auto' }}>
        <div>SCORE: {score.toString().padStart(6, '0')}</div>
        <div style={{ 
          color: isTimeLow ? '#FF1744' : 'white',
          marginTop: '8px',
          animation: isTimeLow ? 'blink 1s step-end infinite' : 'none'
        }}>
          TIME: {formatTime(timeRemaining)}
        </div>
        <div style={{
          marginTop: '12px',
          background: 'rgba(0,0,0,0.4)',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
          width: '200px'
        }}>
          <div style={{ 
            fontSize: '14px', 
            marginBottom: '8px', 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>VOLUME: {Math.round(volume * 100)}%</span>
            <button 
              onClick={toggleMute}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                padding: '0 5px'
              }}
            >
              {isMuted ? '🔈' : '🔊'}
            </button>
          </div>
          <input 
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            style={{
              width: '100%',
              cursor: 'pointer',
              accentColor: '#4CAF50'
            }}
          />
        </div>
      </div>
      
      <div style={{ textAlign: 'right', fontSize: '16px', lineHeight: '1.5' }}>
        <div>← → : 移動</div>
        <div>SPACE : ジャンプ</div>
      </div>

      <style>{`
        @keyframes blink {
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export const GameOverlay: React.FC = () => {
  const { gameState, fetchHighScores } = useGameStore();

  React.useEffect(() => {
    fetchHighScores();
  }, [fetchHighScores]);

  return (
    <>
      {gameState === 'TITLE' && <TitleScreen />}
      {gameState === 'GAME_OVER' && <GameOverScreen />}
      <HUD />
    </>
  );
};
