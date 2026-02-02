export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface ScorePopup {
  x: number;
  y: number;
  score: number;
  color: string;
  life: number;
  maxLife: number;
}

export class ParticleSystem {
  private particles: Particle[] = [];
  private scorePopups: ScorePopup[] = [];
  private shakeIntensity: number = 0;
  private shakeDuration: number = 0;

  public spawnCollectEffect(x: number, y: number, color: string) {
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const speed = 100 + Math.random() * 100;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 100,
        life: 0.5,
        maxLife: 0.5,
        color,
        size: 3 + Math.random() * 2
      });
    }
  }

  public spawnDamageEffect(x: number, y: number) {
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 150 + Math.random() * 150;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 50,
        life: 0.6,
        maxLife: 0.6,
        color: '#FF0000',
        size: 4 + Math.random() * 3
      });
    }
  }

  public spawnJumpEffect(x: number, y: number) {
    for (let i = 0; i < 8; i++) {
      const angle = Math.PI / 4 + (Math.random() - 0.5) * Math.PI / 2;
      const speed = 100 + Math.random() * 50;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed * (Math.random() < 0.5 ? 1 : -1),
        vy: Math.sin(angle) * speed,
        life: 0.4,
        maxLife: 0.4,
        color: '#FFFFFF',
        size: 3 + Math.random() * 2
      });
    }
  }

  public spawnScorePopup(x: number, y: number, score: number, color: string) {
    this.scorePopups.push({
      x,
      y,
      score,
      color,
      life: 1.0,
      maxLife: 1.0
    });
  }

  public triggerScreenShake(intensity: number, duration: number) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
  }

  public update(dt: number) {
    // Update particles
    for (const particle of this.particles) {
      particle.x += particle.vx * dt;
      particle.y += particle.vy * dt;
      particle.vy += 500 * dt; // Gravity
      particle.life -= dt;
    }
    this.particles = this.particles.filter(p => p.life > 0);

    // Update popups
    for (const popup of this.scorePopups) {
      popup.y -= 40 * dt; // Float up
      popup.life -= dt;
    }
    this.scorePopups = this.scorePopups.filter(p => p.life > 0);

    // Update shake
    if (this.shakeDuration > 0) {
      this.shakeDuration -= dt;
      if (this.shakeDuration <= 0) {
        this.shakeIntensity = 0;
      }
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const particle of this.particles) {
      const alpha = particle.life / particle.maxLife;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = particle.color;
      ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
    }
    ctx.globalAlpha = 1.0;

    // Draw Score Popups
    ctx.textAlign = 'center';
    ctx.font = 'bold 20px monospace';
    for (const popup of this.scorePopups) {
      const alpha = Math.min(1.0, popup.life * 2);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = '#000000'; // Shadow
      ctx.fillText(`+${popup.score}`, popup.x + 2, popup.y + 2);
      ctx.fillStyle = popup.color;
      ctx.fillText(`+${popup.score}`, popup.x, popup.y);
    }
    ctx.globalAlpha = 1.0;
  }

  public getShakeOffset(): { x: number; y: number } {
    if (this.shakeDuration <= 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.shakeIntensity,
      y: (Math.random() - 0.5) * this.shakeIntensity
    };
  }

  public reset() {
    this.particles = [];
  }
}
