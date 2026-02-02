import React, { useEffect, useRef } from 'react';
import { GameLoop } from '../game/GameLoop';
import { InputManager } from '../game/InputManager';
import { Player } from '../game/entities/Player';
import { ItemManager } from '../game/entities/ItemManager';
import { LevelRenderer } from '../game/LevelRenderer';
import { ParticleSystem } from '../game/ParticleSystem';
import { GameOverlay } from './GameOverlay';
import { useGameStore } from '../store/useGameStore';
import { PLATFORMS } from '../game/Platform';
import { FRUIT_SCORES, COLORS, GAME_DURATION, SPAWN, DIFFICULTY_CURVE } from '../game/Config';
import { AudioManager } from '../game/AudioManager';

const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Connect to store
  const { gameState, addScore, loseLife, lives, timeRemaining, decreaseTime } = useGameStore();
  const gameStateRef = useRef(gameState);
  const livesRef = useRef(lives);
  const timeRemainingRef = useRef(timeRemaining);

  // Sync refs for game loop access
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  useEffect(() => {
    livesRef.current = lives;
  }, [lives]);

  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize Systems
    const input = new InputManager();
    const player = new Player(input);
    const itemManager = new ItemManager();
    const renderer = new LevelRenderer();
    const particles = new ParticleSystem();
    const audio = new AudioManager();
    
    // Sync muted state
    const unsubscribeMute = useGameStore.subscribe(
      (state) => {
        audio.setMuted(state.isMuted);
      }
    );
    // Sync volume
    const unsubscribeVolume = useGameStore.subscribe(
      (state) => {
        audio.setGlobalVolume(state.volume);
      }
    );
    // Initial sync
    audio.setMuted(useGameStore.getState().isMuted);
    audio.setGlobalVolume(useGameStore.getState().volume);
    
    // Handle specific canvas sizing
    const resizeCanvas = () => {
        canvas.width = 1200;
        canvas.height = 700;
    };
    resizeCanvas();

    const update = (dt: number) => {
      if (gameStateRef.current === 'PLAYING') {
        // Update timer
        decreaseTime(dt);
        
        // Update difficulty based on elapsed time
        const elapsedTime = GAME_DURATION - timeRemainingRef.current;
        let targetInterval = SPAWN.INTERVAL_INITIAL;
        
        // Find the appropriate difficulty level
        for (let i = 0; i < DIFFICULTY_CURVE.length - 1; i++) {
          const current = DIFFICULTY_CURVE[i];
          const next = DIFFICULTY_CURVE[i + 1];
          
          if (elapsedTime >= current.time && elapsedTime < next.time) {
            // Linear interpolation between difficulty levels
            const t = (elapsedTime - current.time) / (next.time - current.time);
            targetInterval = current.spawnInterval + (next.spawnInterval - current.spawnInterval) * t;
            break;
          } else if (elapsedTime >= DIFFICULTY_CURVE[DIFFICULTY_CURVE.length - 1].time) {
            targetInterval = DIFFICULTY_CURVE[DIFFICULTY_CURVE.length - 1].spawnInterval;
          }
        }
        
        itemManager.setSpawnInterval(targetInterval);
        
        player.update(dt, canvas.width, canvas.height, PLATFORMS, (x, y) => {
          particles.spawnJumpEffect(x, y);
        });
        itemManager.update(dt, canvas.width, canvas.height, PLATFORMS);
        particles.update(dt);
        
        // BGM management (Empty in AudioManager)
        audio.playBGM();

        // Collision detection
        const items = itemManager.getItems();
        for (const item of items) {
          if (item.collidesWith(player.x, player.y, player.width, player.height)) {
            if (item.type === 'APPLE') {
              addScore(FRUIT_SCORES.APPLE);
              audio.playSFX('collect_apple');
              particles.spawnCollectEffect(
                item.x + item.width / 2,
                item.y + item.height / 2,
                COLORS.APPLE
              );
              particles.spawnScorePopup(
                item.x + item.width / 2,
                item.y,
                FRUIT_SCORES.APPLE,
                COLORS.APPLE
              );
              itemManager.removeItem(item);
            } else if (item.type === 'BANANA') {
              addScore(FRUIT_SCORES.BANANA);
              audio.playSFX('collect_banana');
              particles.spawnCollectEffect(
                item.x + item.width / 2,
                item.y + item.height / 2,
                COLORS.BANANA
              );
              particles.spawnScorePopup(
                item.x + item.width / 2,
                item.y,
                FRUIT_SCORES.BANANA,
                '#FFE135'
              );
              itemManager.removeItem(item);
            } else if (item.type === 'ORANGE') {
              addScore(FRUIT_SCORES.ORANGE);
              audio.playSFX('collect_orange');
              particles.spawnCollectEffect(
                item.x + item.width / 2,
                item.y + item.height / 2,
                COLORS.ORANGE
              );
              particles.spawnScorePopup(
                item.x + item.width / 2,
                item.y,
                FRUIT_SCORES.ORANGE,
                COLORS.ORANGE
              );
              itemManager.removeItem(item);
            } else if (item.type === 'SPIKE') {
              const damageTaken = player.takeDamage();
              if (damageTaken) {
                loseLife();
                particles.spawnDamageEffect(
                  player.x + player.width / 2,
                  player.y + player.height / 2
                );
                particles.triggerScreenShake(12, 0.4);
              }
              itemManager.removeItem(item);
            }
          }
        }
      } else if (gameStateRef.current === 'TITLE') {
        // Reset items and particles when on title screen
        itemManager.reset();
        particles.reset();
        audio.stopBGM();
      } else if (gameStateRef.current === 'GAME_OVER') {
        audio.stopBGM();
      }
    };

    const draw = () => {
      ctx.save();
      
      // Apply shake
      const shake = particles.getShakeOffset();
      ctx.translate(shake.x, shake.y);

      // Clear & Draw Level
      renderer.draw(ctx, canvas.width, canvas.height);

      // Draw Items
      itemManager.draw(ctx);

      // Draw Particles
      particles.draw(ctx);

      // Draw Player with lives
      player.draw(ctx, livesRef.current);

      ctx.restore();
    };

    const gameLoop = new GameLoop(update, draw);
    gameLoop.start();

    return () => {
      gameLoop.stop();
      input.dispose();
      unsubscribeMute();
      unsubscribeVolume();
    };
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F6FF 100%)',
      padding: '40px 20px'
    }}>
      <div style={{ position: 'relative', width: 1200, height: 700 }}>
          <canvas 
            ref={canvasRef} 
            style={{ 
                width: '100%', 
                height: '100%', 
                border: '6px solid #fff', 
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3), 0 0 0 2px #333',
                imageRendering: 'pixelated' 
            }}
          />
          <GameOverlay />
      </div>
    </div>
  );
};

export default GameCanvas;
