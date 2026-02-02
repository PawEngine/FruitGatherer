import { Item, type ItemType } from './Item';
import { SPAWN } from '../Config';

export class ItemManager {
  private items: Item[] = [];
  private spawnTimer: number = 0;
  private spawnInterval: number = SPAWN.INTERVAL_INITIAL;
  private canvasWidth: number = 800;

  public update(dt: number, canvasWidth: number, canvasHeight: number, platforms: { x: number; y: number; width: number; height: number }[]) {
    
    // Update spawn timer
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnItem();
      this.spawnTimer = 0;
    }

    // Update all items
    for (const item of this.items) {
      item.update(dt, canvasWidth, canvasHeight, platforms);
    }

    // Remove inactive items
    this.items = this.items.filter(item => item.isActive);
  }

  public setSpawnInterval(interval: number) {
    this.spawnInterval = Math.max(SPAWN.INTERVAL_MIN, Math.min(SPAWN.INTERVAL_MAX, interval));
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (const item of this.items) {
      if (item.isActive) {
        item.draw(ctx);
      }
    }
  }

  private spawnItem() {
    // Random side (left or right pipe)
    const isLeft = Math.random() < 0.5;
    
    // Spawn position (from pipe mouth)
    const x = isLeft ? 80 : this.canvasWidth - 80 - 24; // 24 = item width
    const y = 140 - 30; // Pipe bottom - half pipe height
    
    // Initial velocity (shoot toward center with arc)
    const vx = isLeft ? 150 : -150; // Horizontal speed toward center
    const vy = -200; // Upward arc
    
    // Random type (70% fruit, 30% spike)
    let type: ItemType;
    const rand = Math.random();
    
    if (rand < 0.7) {
      // 70% chance of fruit
      const fruitRand = Math.random();
      if (fruitRand < 0.33) {
        type = 'BANANA';
      } else if (fruitRand < 0.66) {
        type = 'ORANGE';
      } else {
        type = 'APPLE';
      }
    } else {
      // 30% chance of spike
      type = 'SPIKE';
    }
    
    const item = new Item(x, y, vx, vy, type);
    this.items.push(item);
  }

  public getItems(): Item[] {
    return this.items.filter(item => item.isActive);
  }

  public removeItem(item: Item) {
    item.isActive = false;
  }

  public reset() {
    this.items = [];
    this.spawnTimer = 0;
    this.spawnInterval = SPAWN.INTERVAL_INITIAL;
  }

  public increasedifficulty() {
    // Gradually decrease spawn interval
    this.spawnInterval = Math.max(SPAWN.INTERVAL_MIN, this.spawnInterval * 0.95);
  }
}
