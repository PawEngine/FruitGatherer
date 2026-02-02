import { PHYSICS, COLORS } from '../Config';

export type ItemType = 'APPLE' | 'BANANA' | 'ORANGE' | 'SPIKE';

export class Item {
  public x: number;
  public y: number;
  public vx: number;
  public vy: number;
  public width: number = 24;
  public height: number = 24;
  public type: ItemType;
  public isActive: boolean = true;

  constructor(x: number, y: number, vx: number, vy: number, type: ItemType) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
  }

  public update(dt: number, canvasWidth: number, canvasHeight: number, platforms: { x: number; y: number; width: number; height: number }[]) {
    // Apply gravity
    this.vy += PHYSICS.ITEM_GRAVITY * dt;

    // Update position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // Platform collision
    for (const platform of platforms) {
      if (this.vy >= 0) {
        const prevY = this.y - this.vy * dt;
        const prevBottom = prevY + this.height;
        
        if (prevBottom <= platform.y &&
            this.y + this.height > platform.y &&
            this.y < platform.y + platform.height &&
            this.x + this.width > platform.x &&
            this.x < platform.x + platform.width) {
          
          this.y = platform.y - this.height;
          this.vy = -this.vy * PHYSICS.ITEM_BOUNCE;
          
          // Reduce horizontal velocity on bounce
          this.vx *= 0.9;
          
          // Ensure minimum velocity to prevent getting stuck
          if (Math.abs(this.vy) < 100) {
            this.vy = -150;
          }
          break;
        }
      }
    }

    // Ground collision
    const groundY = canvasHeight - PHYSICS.GROUND_HEIGHT;
    if (this.y + this.height > groundY) {
      this.y = groundY - this.height;
      this.vy = -this.vy * PHYSICS.ITEM_BOUNCE;
      this.vx *= 0.95; // Less friction
      
      // Ensure minimum velocity to prevent getting stuck
      if (Math.abs(this.vy) < 100) {
        this.vy = -150;
      }
    }
    
    // Ensure horizontal movement continues
    if (Math.abs(this.vx) < 50) {
      this.vx = this.vx >= 0 ? 80 : -80;
    }

    // Mark as inactive if out of bounds
    if (this.x + this.width < 0 || this.x > canvasWidth || this.y > canvasHeight) {
      this.isActive = false;
    }
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    
    if (this.type === 'APPLE') {
      // Gold Apple with sparkle effect
      const time = Date.now() / 1000;
      
      // Main apple body
      ctx.fillStyle = COLORS.APPLE;
      ctx.beginPath();
      ctx.arc(centerX, centerY, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#B8860B';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.beginPath();
      ctx.arc(centerX - 4, centerY - 4, 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Stem
      ctx.strokeStyle = '#8B4513';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, this.y + 2);
      ctx.lineTo(centerX, this.y + 8);
      ctx.stroke();
      
      // Sparkle effect
      for (let i = 0; i < 4; i++) {
        const angle = (time * 2 + i * Math.PI / 2) % (Math.PI * 2);
        const dist = 14 + Math.sin(time * 3 + i) * 2;
        const sx = centerX + Math.cos(angle) * dist;
        const sy = centerY + Math.sin(angle) * dist;
        const size = 2 + Math.sin(time * 4 + i) * 1;
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath();
        ctx.moveTo(sx, sy - size);
        ctx.lineTo(sx + size * 0.3, sy);
        ctx.lineTo(sx, sy + size);
        ctx.lineTo(sx - size * 0.3, sy);
        ctx.closePath();
        ctx.fill();
      }
    } else if (this.type === 'BANANA') {
      // Banana (emoji-like)
      // Yellow curved shape
      ctx.fillStyle = COLORS.BANANA;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, this.width / 2.5, this.height / 2, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      
      // Brown tips
      ctx.fillStyle = '#8B4513';
      ctx.beginPath();
      ctx.arc(centerX - 6, centerY - 8, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(centerX + 6, centerY + 8, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Curve detail
      ctx.strokeStyle = '#FFA500';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(centerX - 2, centerY, this.width / 3, -0.5, 2);
      ctx.stroke();
      
      // Outline
      ctx.strokeStyle = '#DAA520';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(centerX, centerY, this.width / 2.5, this.height / 2, Math.PI / 6, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.type === 'ORANGE') {
      // Orange (emoji-like)
      ctx.fillStyle = COLORS.ORANGE;
      ctx.beginPath();
      ctx.arc(centerX, centerY, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Texture pattern (dimples)
      ctx.fillStyle = '#FF8C00';
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dx = Math.cos(angle) * (this.width / 3.5);
        const dy = Math.sin(angle) * (this.height / 3.5);
        ctx.beginPath();
        ctx.arc(centerX + dx, centerY + dy, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Leaf on top
      ctx.fillStyle = '#228B22';
      ctx.beginPath();
      ctx.ellipse(centerX + 2, this.y + 4, 4, 2, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Outline
      ctx.strokeStyle = '#FF6347';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, this.width / 2, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Spike ball (sea urchin / chestnut style)
      const spikeCount = 16;
      const innerRadius = this.width / 3;
      const outerRadius = this.width / 1.5;
      
      // Draw spikes
      ctx.fillStyle = COLORS.SPIKE;
      ctx.beginPath();
      for (let i = 0; i < spikeCount; i++) {
        const angle = (i / spikeCount) * Math.PI * 2;
        const nextAngle = ((i + 1) / spikeCount) * Math.PI * 2;
        
        // Inner point
        const ix = centerX + Math.cos(angle) * innerRadius;
        const iy = centerY + Math.sin(angle) * innerRadius;
        
        // Outer spike tip
        const ox = centerX + Math.cos(angle) * outerRadius;
        const oy = centerY + Math.sin(angle) * outerRadius;
        
        // Next inner point
        const nix = centerX + Math.cos(nextAngle) * innerRadius;
        const niy = centerY + Math.sin(nextAngle) * innerRadius;
        
        if (i === 0) {
          ctx.moveTo(ix, iy);
        }
        ctx.lineTo(ox, oy);
        ctx.lineTo(nix, niy);
      }
      ctx.closePath();
      ctx.fill();
      
      // Inner core
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius * 0.7, 0, Math.PI * 2);
      ctx.fill();
      
      // Highlight spikes
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < spikeCount; i += 2) {
        const angle = (i / spikeCount) * Math.PI * 2;
        const ox = centerX + Math.cos(angle) * outerRadius;
        const oy = centerY + Math.sin(angle) * outerRadius;
        const ix = centerX + Math.cos(angle) * innerRadius;
        const iy = centerY + Math.sin(angle) * innerRadius;
        
        ctx.beginPath();
        ctx.moveTo(ix, iy);
        ctx.lineTo(ox, oy);
        ctx.stroke();
      }
    }
  }

  public collidesWith(x: number, y: number, w: number, h: number): boolean {
    return (
      this.x < x + w &&
      this.x + this.width > x &&
      this.y < y + h &&
      this.y + this.height > y
    );
  }
}
