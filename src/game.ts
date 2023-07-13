import * as PIXI from 'pixi.js';
import { GameLevel } from "./gameLevel";
import { level1Config, level2Config, level3Config } from './levelConfigs';
import { MainMenu } from './mainMenu';

export class Game {
  public app: PIXI.Application<HTMLCanvasElement>;
  public unlockedLevels: Array<number>;
  private assets: any;
  private gameLevel: any;
  private gameContainer: PIXI.Container;

  constructor() {
    this.app = new PIXI.Application<HTMLCanvasElement>(this.gameConfig());
    this.gameContainer = new PIXI.Container()
    this.unlockedLevels = localStorage.unlockedLevels ? JSON.parse(localStorage.unlockedLevels) : [1];

    document.body.appendChild(this.app.view);
    this.app.renderer.view.style.position = 'absolute';
    this.app.ticker.add(this.gameLoop.bind(this));
  }

  public async init() {
    this.assets = await this.getAssets();

    this.gameContainer = new MainMenu(this, this.assets).container
    this.app.stage.addChild(this.gameContainer);
  }

  public playGame(level: number) {
    const configs = { 1: level1Config, 2: level2Config, 3: level3Config };
    this.gameContainer.destroy();
    this.gameLevel = new GameLevel(this, this.assets, (configs as any)[level]);
    this.app.stage.addChild(this.gameLevel.levelContainer);
  }

  public backToMenu() {
    this.gameLevel.levelFinished = true;
    this.gameLevel.levelContainer.destroy();
    this.gameLevel.levelContainer = null;
    this.gameContainer = new MainMenu(this, this.assets).container
    this.app.stage.addChild(this.gameContainer);
  }

  private gameLoop(delta: GLfloat) {
    if (!this.gameLevel) return
    this.gameLevel.updateLevel(delta);
  }

  private gameConfig() {
    return {
      background: 'black',
      resizeTo: window,
      antialias: true
    }
  }

  private async getAssets() {
    PIXI.Assets.addBundle('images', {
      ground: '../src/images/ground.png',
      orc: '../src/images/orc.png',
      orcMage: '../src/images/orcMage.png',
      clubOrc: '../src/images/clubOrc.png',
      kamikazeOrc: '../src/images/kamikazeOrc.png',
      minotaur: '../src/images/minotaur.png',
      tower: '../src/images/tower1.png',
      tower2: '../src/images/tower2.png',
      tower3: '../src/images/tower3.png',
      arrow: '../src/images/arrow.png',
    });
  
    return await PIXI.Assets.loadBundle('images')
  }
}