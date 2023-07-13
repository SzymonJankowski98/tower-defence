import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/all';
import { GameLevel } from './gameLevel';

export class Mob {
  public id: number;
  public mobContainer: PIXI.Container;
  public mob: PIXI.Sprite;
  private gameLevel: GameLevel;
  public reward: number;
  private health: number;
  private maxHealth: number;
  private damage: number;
  private movementAnimation: any;
  private healthIndicator?: PIXI.Graphics;

  constructor(gameLevel: GameLevel, health: number, damage: number, reward: number, asset: string) {
    this.gameLevel = gameLevel;
    this.mobContainer = new PIXI.Container
    this.mob = PIXI.Sprite.from(gameLevel.assets[asset])
    this.health = health;
    this.maxHealth = health;
    this.damage = damage;
    this.reward = reward;
    this.id = this.gameLevel.getNewId();

    this.createMob();
  }

  public update(delta: GLfloat) {
    // this.mob.x += delta;
    this.updateHealthIndicator();
  }

  public destroy() {
    this.movementAnimation.kill();
    this.mobContainer.destroy();
  }

  public dealDamage(damage: number) {
    this.health -= damage;
    if (this.health <= 0) this.gameLevel.killMob(this, true);
  }

  private createMob() {
    this.mob.anchor.set(0.5);
    this.mob.width = this.gameLevel.tileSize() * 0.7;
    this.mob.height = this.gameLevel.tileSize() * 0.7;
    this.mobContainer.x = this.gameLevel.levelConfig.route[0].x * this.gameLevel.tileSize() - 0.5 * this.gameLevel.tileSize();
    this.mobContainer.y = this.gameLevel.levelConfig.route[0].y * this.gameLevel.tileSize() + 0.5 * this.gameLevel.tileSize();

    gsap.registerPlugin(MotionPathPlugin);
    this.movementAnimation = gsap.to(this.mobContainer, {
      duration: 10,
      motionPath: {
        path: this.gaspPath(),
        curviness: 0
      },
      ease: "none",
      onComplete: () => { this.onPathEnd() }
    });

    this.createHealthBar();
    this.mobContainer.addChild(this.mob)
    this.gameLevel.levelContainer.addChild(this.mobContainer);
  }

  private createHealthBar() {
    const healthBar = new PIXI.Graphics()
    healthBar.beginFill('gray')
            .lineStyle(1, 'darkgray')
            .drawRect(0, 0, this.mob.width * 0.6, 7)
            .endFill();
    healthBar.x = -this.mob.width / 2 + this.mob.width * 0.2;
    healthBar.y = this.mob.height / 2;
    healthBar.alpha = 0.5

    this.healthIndicator = new PIXI.Graphics()
    this.healthIndicator.beginFill('red')
            .drawRect(0, 0, this.mob.width * 0.6, 7)
            .endFill();
    this.healthIndicator.x = -this.mob.width / 2 + this.mob.width * 0.2;
    this.healthIndicator.y = this.mob.height / 2;
    this.healthIndicator.alpha = 0.5
    
    
    this.mobContainer.addChild(healthBar);
    this.mobContainer.addChild(this.healthIndicator);
  }

  private updateHealthIndicator() {
    if (!this.healthIndicator) return;
    const percentagoOfHPLeft = this.health / this.maxHealth;
    this.healthIndicator.width = percentagoOfHPLeft * this.mob.width * 0.6;
  }

  private onPathEnd() {
    this.gameLevel.dealDamage(this.damage)
    this.gameLevel.killMob(this)
  }

  private gaspPath() {
    const path = this.gameLevel.levelConfig.route.map(({ x, y }) => {
      return { x: x * this.gameLevel.tileSize() + 0.5 * this.gameLevel.tileSize(), y: y  * this.gameLevel.tileSize() + 0.5 * this.gameLevel.tileSize() }
    })
    path[path.length - 1].x += this.gameLevel.tileSize()

    return path
  }
}
