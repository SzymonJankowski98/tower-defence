import * as PIXI from 'pixi.js';
import { Field } from "./field";
import { Mob } from './mob';
import { Tower } from './tower';
import { LevelConfig } from './interfaces/levelConfig';
import { LevelInterface } from './levelInterface';
import { Game } from './game';

export class GameLevel {
  public game: Game;
  public levelConfig: LevelConfig;
  public assets: any;
  public fields: Array<Field>;
  public mobs: Array<Mob>;
  public towers: Array<Tower>;
  public health: number;
  public coins: number;
  public interface: LevelInterface;
  public levelContainer: PIXI.Container;
  private currentMob: number;
  private startTime: Date;
  private idCounter: number;
  private levelFinished: boolean;

  constructor(game: Game, assets: any, levelConfig: LevelConfig) {
    this.game = game;
    this.assets = assets;
    this.levelConfig = levelConfig;
    this.levelContainer = new PIXI.Container();

    this.health = 100;
    this.coins = 200;
    this.currentMob = 0;
    this.idCounter = 1;
    this.levelFinished = false;
    this.startTime = new Date();
    this.interface = new LevelInterface(this);
    this.fields = this.createFields();
    this.mobs = [];
    this.towers = [];
  }

  public updateLevel(delta: GLfloat) {
    if (this.levelFinished) return;
    this.spawnMobs();
    this.mobs.forEach(mob => { mob.update(delta) });
    this.towers.forEach(towers => { towers.update(delta) });
    this.interface.update();

    if (this.health <= 0) { 
      this.levelFinished = true;
      this.interface.showGameComplete("Game Over", "red");
    } else if (this.currentMob >= this.levelConfig.mobs.length && this.mobs.length === 0) {
      this.levelFinished = true;
      this.interface.showGameComplete("You won!", "green");
      const unlockedLevel = this.levelConfig.id + 1
      if (!this.game.unlockedLevels.includes(unlockedLevel)) this.game.unlockedLevels.push(unlockedLevel);
      localStorage.setItem('unlockedLevels', JSON.stringify(this.game.unlockedLevels));
    }
  }

  public dealDamage(damage: number) {
    this.health -= damage;
  }

  public killMob(killedMob: Mob, withReward = false) {
    if (withReward) this.coins += killedMob.reward;
    killedMob.destroy();
    this.mobs.splice(this.mobs.findIndex((mob) => mob.id === killedMob.id), 1)
  }

  public getNewId() {
    return this.idCounter++;
  }

  public tileSize(): number {
    return this.game.app.renderer.width / 20
  }

  public buyTower(id: number, x: number, y: number) {
    const towerConfig = this.levelConfig.towers[id];
    if (towerConfig.price > this.coins) return;
    if (this.towers.find(tower => tower.x === x && tower.x === y )) return;
    

    this.towers.push(new Tower(this, id, x, y))
    this.coins -= towerConfig.price;
  }

  private createFields() {
    const route = this.levelConfig.route;
    const firstPoint = route[0];
    let currentPoint = 1;
    let currentX = firstPoint.x;
    let currentY = firstPoint.y;
    const fields = [new Field(this, currentX, currentY)];
    while (currentPoint < route.length) {
      if (currentX !==  route[currentPoint].x) {
        currentX += currentX < route[currentPoint].x ? 1 : -1;
      } else {
        currentY += currentY < route[currentPoint].y ? 1 : -1;
      }

      fields.push(new Field(this, currentX, currentY));

      if (currentX === route[currentPoint].x && currentY === route[currentPoint].y ) {
        currentPoint += 1
      }
    }

    return fields;
  }

  private spawnMobs() {
    if (this.currentMob >= this.levelConfig.mobs.length) return;

    const mobConfig = this.levelConfig.mobs[this.currentMob]
    if (this.startTime.getTime() / 1000 + mobConfig.spawnTime > Math.round(Date.now() / 1000)) return;

    this.mobs.push(new Mob(this, mobConfig.health, mobConfig.damage, mobConfig.reward, mobConfig.asset));
    this.currentMob += 1;
    this.spawnMobs();
  }
}