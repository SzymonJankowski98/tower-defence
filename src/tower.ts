import * as PIXI from 'pixi.js';
import { Bullet } from './bullet';
import { GameLevel } from './gameLevel';
import { Mob } from './mob';

export class Tower {
  readonly bulletThreshold = 50;
  readonly range = 5;

  public x: number;
  public y: number;

  private gameLevel: GameLevel;
  private tower: PIXI.Sprite;
  private bullets: Array<Bullet>;
  private lastBullet: GLfloat
  private damage: number

  constructor(gameLevel: GameLevel, id: number, x: number, y: number) {
    this.gameLevel = gameLevel;
    const towerConfig = this.gameLevel.levelConfig.towers[id]
    this.tower = PIXI.Sprite.from(this.gameLevel.assets[towerConfig.asset])
    this.damage = towerConfig.damage;
    this.x = x;
    this.y = y;
    
    this.createTower(x * this.gameLevel.tileSize() + this.gameLevel.tileSize() / 2,
                     y * this.gameLevel.tileSize()  + this.gameLevel.tileSize() / 2);
    this.bullets = [];
    this.lastBullet = 0;
  }

  public update(delta: GLfloat) {
    this.lastBullet += delta;
    if (this.lastBullet >= this.bulletThreshold) {
      const mob = this.mobToAttack()
      if (mob) this.shot(mob);
    }
    this.bullets.forEach(bullet => { bullet.update(delta) });
  }

  private createTower(x: number, y: number) {
    this.tower.anchor.set(0.5);
    this.tower.height = this.gameLevel.tileSize() * 0.75
    this.tower.width = this.gameLevel.tileSize() * 0.75
    this.tower.x = x;
    this.tower.y = y;

    this.gameLevel.levelContainer.addChild(this.tower);
  }

  private shot(mob: Mob) {
    this.bullets.push(new Bullet(this.gameLevel, this.tower.x, this.tower.y, this.damage, mob));
    this.lastBullet = 0;
  }

  private mobToAttack() {
    return this.gameLevel.mobs.find((mob) => {
      return this.distanceToTarget(mob.mobContainer.x, mob.mobContainer.y) <= this.range * this.gameLevel.tileSize();
    });
  }

  private distanceToTarget(endX: number, endY: number) {
    return  Math.sqrt(Math.pow((endX - this.tower.x), 2) + Math.pow((endY - this.tower.y), 2));
  }
}