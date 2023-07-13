import * as PIXI from 'pixi.js';
import { GameLevel } from './gameLevel';

export class Field {
  public xNumber: number;
  public yNumber: number;
  private gameLevel: GameLevel;
  private field: PIXI.Sprite;

  constructor(gameLevel: GameLevel, x: number, y: number) {
    this.gameLevel = gameLevel;
    this.xNumber = x;
    this.yNumber = y;
    this.field = PIXI.Sprite.from(this.gameLevel.assets.ground);

    this.createField(x, y);
  }

  private createField(x: number, y: number) {
    this.field.width = this.gameLevel.tileSize();
    this.field.height = this.gameLevel.tileSize();
    this.field.x = x * this.gameLevel.tileSize();
    this.field.y = y * this.gameLevel.tileSize();


    this.gameLevel.levelContainer.addChild(this.field);
  }
}
