import * as PIXI from 'pixi.js';
import { Game } from './game';

export class MainMenu {
  public game: Game;
  public assets: any;
  public container: PIXI.Container;

  constructor(game:Game, assets: any) {
    this.game = game;
    this.assets = assets;

    this.container = new PIXI.Container();
    this.createBackground();
    this.createTitle();
    this.createLevelButtons();
  }

  private createBackground() {
    const background = new PIXI.Graphics()
    background.beginFill('gray')
      .lineStyle(2, 'darkgray')
      .drawRect(0, 0, 350, 250)
      .endFill();
    background.x = this.game.app.renderer.width / 2 - 175;
    background.y = this.game.app.renderer.height / 2 - 175;
    background.alpha = 0.15;

    this.container.addChild(background);
  }

  private createTitle() {
    const mainMenu = new PIXI.Text(`Tower Defence`, {
      fontFamily: 'Arial Black',
      fontSize: 36,
      fill: "cyan",
      align: 'center',
    });
    mainMenu.anchor.set(0.5);
    mainMenu.x = this.game.app.renderer.width / 2
    mainMenu.y = this.game.app.renderer.height / 2 - 130

    this.container.addChild(mainMenu);
  }

  private createLevelButtons() {
    for (let level = 1; level < 4; level++) {
      const levelButton = new PIXI.Text(`Level ${level}`, {
        fontFamily: 'Arial Black',
        fontSize: 22,
        fill: "white",
        align: 'center',
      });
      levelButton.anchor.set(0.5);
      levelButton.x = this.game.app.renderer.width / 2
      levelButton.y = this.game.app.renderer.height / 2 - 100 + level * 40
      if (this.game.unlockedLevels.includes(level)) {
        levelButton.interactive = true;
        levelButton.cursor = "pointer"
        
        levelButton.on('pointerdown', () => { this.game.playGame(level) });
      } else {
        levelButton.alpha = 0.5
      }
  
      this.container.addChild(levelButton); 
    }
  }
}