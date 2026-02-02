export class GameLoop {
  private lastTime: number = 0;
  private animationFrameId: number | null = null;
  private onUpdate: (deltaTime: number) => void;
  private onDraw: () => void;
  private isRunning: boolean = false;

  constructor(onUpdate: (dt: number) => void, onDraw: () => void) {
    this.onUpdate = onUpdate;
    this.onDraw = onDraw;
  }

  public start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public stop() {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private loop = (time: number) => {
    if (!this.isRunning) return;

    // Calculate delta time in seconds
    const deltaTime = (time - this.lastTime) / 1000;
    this.lastTime = time;

    // Limit delta time to prevent huge jumps (max 0.1s)
    const clampedDeltaTime = Math.min(deltaTime, 0.1);

    this.onUpdate(clampedDeltaTime);
    this.onDraw();

    this.animationFrameId = requestAnimationFrame(this.loop);
  };
}
