import { InputManager } from '../InputManager';
import { PHYSICS, COLORS } from '../Config';
import { type Platform } from '../Platform';

export class Player {
  public x: number = 100;
  public y: number = 100;
  public width: number = 32;
  public height: number = 32;
  
  private vx: number = 0;
  private vy: number = 0;
  private isGrounded: boolean = false;
  private canDropThrough: boolean = false;
  
  // Animation & effects
  private input: InputManager;
  private isInvincible: boolean = false;
  private invincibleTimer: number = 0;
  private squashStretch: number = 1; // For jump animation

  constructor(input: InputManager) {
    this.input = input;
  }

  public update(dt: number, canvasWidth: number, canvasHeight: number, platforms: Platform[], onJump?: (x: number, y: number) => void) {
    // Update invincibility
    if (this.isInvincible) {
      this.invincibleTimer -= dt;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
      }
    }
    
    // 1. Horizontal Movement
    const dir = this.input.getHorizontalAxis();
    
    if (dir !== 0) {
      this.vx += dir * PHYSICS.MOVE_ACCELERATION * dt;
    } else {
      if (Math.abs(this.vx) > 10) {
        const frictionSign = Math.sign(this.vx) * -1;
        this.vx += frictionSign * PHYSICS.MOVE_ACCELERATION * 0.8 * dt;
         if ((frictionSign < 0 && this.vx < 0) || (frictionSign > 0 && this.vx > 0)) {
           this.vx = 0;
         }
      } else {
        this.vx = 0;
      }
    }

    this.vx = Math.max(-PHYSICS.MAX_SPEED, Math.min(PHYSICS.MAX_SPEED, this.vx));

    // 2. Vertical Movement (Gravity)
    this.vy += PHYSICS.GRAVITY * dt;

    // 3. Jump
    if ((this.input.isKeyDown('Space') || this.input.isKeyDown('ArrowUp') || this.input.isKeyDown('KeyW')) && this.isGrounded) {
       this.vy = PHYSICS.JUMP_FORCE;
       this.isGrounded = false;
       this.squashStretch = 0.7; // Squash on jump
       
       // Trigger jump effect
       if (onJump) {
         onJump(this.x + this.width / 2, this.y + this.height);
       }
    }
    
    // Variable Jump Height
    if (!this.input.isKeyDown('Space') && !this.input.isKeyDown('ArrowUp') && !this.input.isKeyDown('KeyW') && this.vy < 0) {
       this.vy *= 0.5;
    }

    // Drop through platform
    if (this.input.isKeyDown('ArrowDown') || this.input.isKeyDown('KeyS')) {
      this.canDropThrough = true;
    } else {
      this.canDropThrough = false;
    }

    // 4. Update Position
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    // 5. Platform Collision
    this.isGrounded = false;
    
    for (const platform of platforms) {
      if (this.vy >= 0 && !this.canDropThrough) {
        const prevY = this.y - this.vy * dt;
        const prevBottom = prevY + this.height;
        
        if (prevBottom <= platform.y &&
            this.y + this.height > platform.y &&
            this.y < platform.y + platform.height &&
            this.x + this.width > platform.x &&
            this.x < platform.x + platform.width) {
          
          this.y = platform.y - this.height;
          this.vy = 0;
          this.isGrounded = true;
          this.squashStretch = 1.3; // Stretch on landing
          break;
        }
      }
    }

    // 6. Ground Collision
    const groundY = canvasHeight - PHYSICS.GROUND_HEIGHT;
    if (this.y + this.height > groundY) {
      this.y = groundY - this.height;
      this.vy = 0;
      this.isGrounded = true;
      this.squashStretch = 1.3; // Stretch on landing
    }

    // 7. Screen Wrap
    if (this.x > canvasWidth) {
      this.x = -this.width;
    } else if (this.x + this.width < 0) {
      this.x = canvasWidth;
    }
    
    // 8. Squash & Stretch animation (smooth return to normal)
    this.squashStretch += (1 - this.squashStretch) * 5 * dt;
  }

  public draw(ctx: CanvasRenderingContext2D, lives: number) {
    // Invincibility flashing
    if (this.isInvincible) {
      const flash = Math.floor(Date.now() / 100) % 2 === 0;
      if (flash) {
        ctx.globalAlpha = 0.3;
      }
    }
    
    // Draw character (Cat) with squash & stretch
    const centerX = this.x + this.width / 2;
    const baseY = this.y + this.height / 2;
    
    // Apply squash/stretch
    const scaleY = this.squashStretch;
    const scaleX = 1 / Math.sqrt(scaleY); // Preserve volume
    
    ctx.save();
    ctx.translate(centerX, baseY);
    ctx.scale(scaleX, scaleY);
    ctx.translate(-centerX, -baseY);
    
    const centerY = baseY;
    
    // Body
    ctx.fillStyle = '#FF6B9D';
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.width / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Ears
    ctx.fillStyle = '#FF6B9D';
    ctx.beginPath();
    ctx.moveTo(centerX - 10, this.y + 5);
    ctx.lineTo(centerX - 15, this.y - 5);
    ctx.lineTo(centerX - 5, this.y + 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(centerX + 10, this.y + 5);
    ctx.lineTo(centerX + 15, this.y - 5);
    ctx.lineTo(centerX + 5, this.y + 2);
    ctx.fill();
    
    // Eyes
    ctx.fillStyle = 'white';
    const lookDir = Math.sign(this.vx) || 1;
    const eyeOffsetX = lookDir > 0 ? 4 : -4;
    ctx.beginPath();
    ctx.arc(centerX + eyeOffsetX - 6, centerY - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + eyeOffsetX + 6, centerY - 4, 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(centerX + eyeOffsetX - 6 + lookDir * 1, centerY - 4, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(centerX + eyeOffsetX + 6 + lookDir * 1, centerY - 4, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Nose
    ctx.fillStyle = '#FF1493';
    ctx.beginPath();
    ctx.arc(centerX, centerY + 2, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Whiskers
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = -1; i <= 1; i++) {
      ctx.beginPath();
      ctx.moveTo(centerX - 12, centerY + i * 3);
      ctx.lineTo(centerX - 20, centerY + i * 3);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX + 12, centerY + i * 3);
      ctx.lineTo(centerX + 20, centerY + i * 3);
      ctx.stroke();
    }
    
    ctx.restore();
    ctx.globalAlpha = 1;
    
    // Lives (hearts above head) - with spacing
    for (let i = 0; i < lives; i++) {
      this.drawHeart(ctx, centerX - 18 + i * 14, this.y - 15);
    }
  }
  
  private drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number) {
    const size = 6;
    ctx.fillStyle = COLORS.HEART;
    ctx.beginPath();
    ctx.moveTo(x, y + size * 0.3);
    ctx.bezierCurveTo(x, y, x - size * 0.5, y - size * 0.5, x - size * 0.8, y - size * 0.5);
    ctx.bezierCurveTo(x - size, y - size * 0.5, x - size, y, x - size, y + size * 0.3);
    ctx.bezierCurveTo(x - size, y + size * 0.7, x - size * 0.7, y + size, x, y + size * 1.3);
    ctx.bezierCurveTo(x + size * 0.7, y + size, x + size, y + size * 0.7, x + size, y + size * 0.3);
    ctx.bezierCurveTo(x + size, y, x + size, y - size * 0.5, x + size * 0.8, y - size * 0.5);
    ctx.bezierCurveTo(x + size * 0.5, y - size * 0.5, x, y, x, y + size * 0.3);
    ctx.fill();
    
    // Outline
    ctx.strokeStyle = '#CC0000';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  
  public takeDamage() {
    if (!this.isInvincible) {
      this.isInvincible = true;
      this.invincibleTimer = 1.0; // 1 second
      return true; // Damage taken
    }
    return false; // No damage (invincible)
  }
  
  public isPlayerInvincible(): boolean {
    return this.isInvincible;
  }
}
