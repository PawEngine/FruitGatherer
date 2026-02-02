import { COLORS, PHYSICS } from './Config';
import { PLATFORMS } from './Platform';

export class LevelRenderer {
  public draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
    // 1. Sky Background
    ctx.fillStyle = COLORS.BACKGROUND;
    ctx.fillRect(0, 0, width, height);

    // 2. Clouds (Simple decor)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    this.drawCloud(ctx, 100, 100, 60);
    this.drawCloud(ctx, 400, 150, 50);
    this.drawCloud(ctx, 700, 80, 70);

    // 3. Ground
    const groundY = height - PHYSICS.GROUND_HEIGHT;
    
    // Dirt
    ctx.fillStyle = COLORS.GROUND;
    ctx.fillRect(0, groundY, width, PHYSICS.GROUND_HEIGHT);
    
    // Grass Top
    ctx.fillStyle = COLORS.GROUND_TOP;
    ctx.fillRect(0, groundY, width, 10);

    // 4. Pipes (Screen edges)
    // Bottom Pipes (Loops)
    this.drawPipe(ctx, 0, groundY, 60, 80, 'UP'); 
    this.drawPipe(ctx, width - 60, groundY, 60, 80, 'UP');

    // Top Pipes (Spawners)
    const topPipeY = 140; // Bottom of the pipe
    this.drawPipe(ctx, 0, topPipeY, 80, 60, 'RIGHT');   // Left Top
    this.drawPipe(ctx, width - 80, topPipeY, 80, 60, 'LEFT'); // Right Top

    // 5. Platforms
    for (const platform of PLATFORMS) {
      this.drawPlatform(ctx, platform.x, platform.y, platform.width);
    }
  }

  private drawCloud(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.arc(x + size * 0.8, y + size * 0.2, size * 0.8, 0, Math.PI * 2);
    ctx.arc(x - size * 0.8, y + size * 0.2, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawPipe(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') {
    ctx.fillStyle = COLORS.PIPE;
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    const capSize = 25;

    if (dir === 'UP') {
        // Vertical Pipe from bottom
        ctx.fillRect(x, y - h, w, h);
        ctx.strokeRect(x, y - h + capSize, w, h - capSize);
        // Cap
        ctx.fillRect(x - 4, y - h, w + 8, capSize);
        ctx.strokeRect(x - 4, y - h, w + 8, capSize);
        // Inner
        ctx.fillStyle = COLORS.PIPE_DARK;
        ctx.fillRect(x + 10, y - h + capSize, w - 20, h - capSize);
    } 
    else if (dir === 'RIGHT') {
        // Horizontal Pipe from Left wall
        ctx.fillRect(x, y - h, w, h); // Body
        ctx.strokeRect(x, y - h, w - capSize, h);
        // Cap
        ctx.fillRect(x + w - capSize, y - h - 4, capSize, h + 8);
        ctx.strokeRect(x + w - capSize, y - h - 4, capSize, h + 8);
        // Inner Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x, y - h + 5, w - capSize, h - 10);
        // Black hole
        ctx.fillStyle = '#000';
        ctx.fillRect(x + w - 5, y - h + 10, 5, h - 20);
    }
    else if (dir === 'LEFT') {
        // Horizontal Pipe from Right wall
        ctx.fillRect(x, y - h, w, h);
        ctx.strokeRect(x + capSize, y - h, w - capSize, h);
        // Cap
        ctx.fillRect(x, y - h - 4, capSize, h + 8);
        ctx.strokeRect(x, y - h - 4, capSize, h + 8);
        // Inner Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(x + capSize, y - h + 5, w - capSize, h - 10);
        // Black hole
        ctx.fillStyle = '#000';
        ctx.fillRect(x, y - h + 10, 5, h - 20);
    }
  }

  private drawPlatform(ctx: CanvasRenderingContext2D, x: number, y: number, width: number) {
    const height = 20;
    
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(x + 4, y + 4, width, height);
    
    // Main platform body
    ctx.fillStyle = COLORS.PLATFORM;
    ctx.fillRect(x, y, width, height);
    
    // Top highlight
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(x, y, width, 6);
    
    // Bottom shadow
    ctx.fillStyle = COLORS.PLATFORM_DARK;
    ctx.fillRect(x, y + height - 6, width, 6);
    
    // Border
    ctx.strokeStyle = '#8B6F47';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Decorative dots
    ctx.fillStyle = COLORS.PLATFORM_DARK;
    for (let i = 0; i < width / 30; i++) {
      const dotX = x + 15 + i * 30;
      ctx.beginPath();
      ctx.arc(dotX, y + height / 2, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
