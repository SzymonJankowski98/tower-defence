import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/all';
import { GameLevel } from './gameLevel';
import { Mob } from './mob';

interface Point {
  x: number;
  y: number;
}

export class Bullet {
  private gameLevel: GameLevel;
  private bullet: PIXI.Sprite;
  private endX: number;
  private endY: number;
  private damage: number;
  private targetId: number;

  constructor(gameLevel: GameLevel, x: number, y: number, damage: number, target: Mob) {
    this.gameLevel = gameLevel;
    this.targetId = target.id;
    this.damage = damage;

    this.bullet = PIXI.Sprite.from(this.gameLevel.assets.arrow)
    this.targetId = target.id;
    this.endX = target.mobContainer.x
    this.endY = target.mobContainer.y
    this.createBullet(x, y);
  }

  public update(delta: GLfloat) {}

  private createBullet(x: number, y: number) {
    this.bullet.anchor.set(0.5);
    this.bullet.x = x;
    this.bullet.y = y;
    this.bullet.width = this.gameLevel.tileSize() / 2;
    this.bullet.height = this.gameLevel.tileSize() / 2;

    let rotation = this.bulletRotation();
    this.bullet.rotation = rotation;

    gsap.registerPlugin(MotionPathPlugin);
    gsap.to(this.bullet, {
      duration: this.distanceToTarget(x, y) / 2000,
      motionPath: {
        path: [{ x: x, y: y}, { x: this.endX, y: this.endY }],
        curviness: 0
      },
      ease: "none",
      onComplete: () => { this.onHit() }
    });

    this.gameLevel.game.app.stage.addChild(this.bullet);
  }

  private onHit() {
    this.bullet.destroy();
    const target = this.gameLevel.mobs.find((mob) => mob.id === this.targetId)
    if (!target) return

    target.dealDamage(this.damage);
  }

  private distanceToTarget(x: number, y: number) {
    return  Math.sqrt(Math.pow((x - this.endX), 2) + Math.pow((y - this.endY), 2))
  }

  private bulletRotation(): number {
    const vector1 = { x: this.endX - this.bullet.x, y: this.endY - this.bullet.y };
    const vector2 = { x: this.endX - this.endX, y: this.endY + 10 - this.endY };
  
    const dotProduct = vector1.x * vector2.x + vector1.y * vector2.y;
    const magnitude1 = Math.sqrt(vector1.x * vector1.x + vector1.y * vector1.y);
    const magnitude2 = Math.sqrt(vector2.x * vector2.x + vector2.y * vector2.y);
  
    const angleInRadians = Math.acos(dotProduct / (magnitude1 * magnitude2));
  
    return (this.bullet.x < this.endX) ? -angleInRadians : angleInRadians;
  }
}