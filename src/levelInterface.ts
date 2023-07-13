import * as PIXI from 'pixi.js';
import { GameLevel } from './gameLevel';

export class LevelInterface {
  private gameLevel: GameLevel;
  private healthBar: PIXI.Text;
  private coinsBar: PIXI.Text;
  private dragTarget?: PIXI.Sprite;
  private dragTargetId?: number;
  private mesh?: { [key: number]: { [key: number]: true } };
  private meshContainer?: PIXI.Container;
  private towerBarContainer: Array<PIXI.Sprite>
  private towerInfo?: PIXI.Container;

  constructor(gameLevel: GameLevel) {
    this.gameLevel = gameLevel;
    this.healthBar = this.createHealthBar();
    this.coinsBar = this.createCoinsBar();
    this.towerBarContainer = [];

    this.gameLevel.levelContainer.interactive = true;
    this.gameLevel.levelContainer.hitArea = this.gameLevel.game.app.screen;
    this.gameLevel.levelContainer.on('pointerup', this.onDragEnd.bind(this));
    this.gameLevel.levelContainer.on('pointerupoutside', this.onDragEnd.bind(this));
    this.towerBar();
    this.createQuitButton();
  }

  public update() {
    this.healthBar.text = `Health: ${this.gameLevel.health}`;
    this.coinsBar.text = `Coins: ${this.gameLevel.coins}`;

    this.towerBarContainer.forEach((tower, index) => {
      const towerConfig = this.gameLevel.levelConfig.towers[index];
      if (towerConfig.price > this.gameLevel.coins) {
        tower.alpha = 0.1;
      } else {
        tower.alpha = 1;
      }
    });
  }

  public showGameComplete(text: string, color: string) {
    const background = new PIXI.Graphics()
    background.beginFill('darkgray')
      .lineStyle(2, color)
      .drawRect(0, 0, 350, 180)
      .endFill();
    background.x = this.gameLevel.game.app.renderer.width / 2 - 175;
    background.y = this.gameLevel.game.app.renderer.height / 2 - 90;
    background.alpha = 1;

    this.gameLevel.levelContainer.addChild(background);

    const message = new PIXI.Text(text, {
      fontFamily: 'Arial Black',
      fontSize: 40,
      fill: color,
      align: 'center',
    });
    message.anchor.set(0.5);
    message.x = this.gameLevel.game.app.renderer.width / 2
    message.y = this.gameLevel.game.app.renderer.height / 2 - 45

    this.gameLevel.levelContainer.addChild(message);

    const quitButton = new PIXI.Text('Back to menu', {
      fontFamily: 'Arial',
      fontSize: 25,
      fill: "white",
      align: 'center',
    });
    quitButton.anchor.set(0.5);
    quitButton.x = this.gameLevel.game.app.renderer.width / 2;
    quitButton.y = this.gameLevel.game.app.renderer.height / 2 + 30;
    quitButton.interactive = true;
    quitButton.cursor = "pointer"
    quitButton.on('pointerdown', () => { this.gameLevel.game.backToMenu() });

    this.gameLevel.levelContainer.addChild(quitButton);
  }

  private towerBar() {
    const container = new PIXI.Container();
 
    const barBackground = new PIXI.Graphics()
    barBackground.beginFill('gray')
      .lineStyle(2, 'darkgray')
      .drawRect(0, 0, this.gameLevel.levelConfig.towers.length * this.gameLevel.tileSize(), this.gameLevel.tileSize())
      .endFill();
    barBackground.alpha = 0.4;

    container.x = this.gameLevel.game.app.renderer.width / 2 - barBackground.width / 2;
    container.y = this.gameLevel.game.app.renderer.height - barBackground.height - 5;
    
    container.addChild(barBackground);
    this.createTowerButtons(container);
    this.gameLevel.levelContainer.addChild(container);
  }

  private createTowerButtons(container: PIXI.Container) {
    this.gameLevel.levelConfig.towers.forEach((tower, index) => {
      const button = new PIXI.Sprite(this.gameLevel.assets[tower.asset]);
      button.anchor.set(0.5);
      button.height = this.gameLevel.tileSize() * 0.75;
      button.width = this.gameLevel.tileSize() * 0.75;
      button.x = this.gameLevel.tileSize() * 0.5 + this.gameLevel.tileSize() * index;
      button.y = container.height / 2;
      button.interactive = true;
      button.cursor = 'pointer';
      button.on('pointerdown', () => { this.onDragStart(button, index) }, button);
      button.on('mouseover', () => { this.showTowerInfo(button, index); }, button);
      button.on('mouseout', () => { this.hideTowerInfo() }, button);
      this.towerBarContainer.push(button)
      container.addChild(button);
    });
  }

  private showTowerInfo(button: PIXI.Sprite, id: number) {
    const container = new PIXI.Container();
    const background = new PIXI.Graphics()
    background.beginFill('gray')
      .lineStyle(2, "darkgray")
      .drawRect(0, 0, 100, 90)
      .endFill();
    background.alpha = 0.4;

    container.addChild(background);

    const towerConfig = this.gameLevel.levelConfig.towers[id];
    const title = new PIXI.Text(towerConfig.name, {
      fontFamily: 'Arial Black',
      fontSize: 18,
      fill: "cyan",
      align: 'center',
    });
    title.anchor.set(0.5);
    title.x = container.width / 2;
    title.y = title.height - 5;

    container.addChild(title);

    ["price", "damage", "speed"].forEach((info, infoId) => {
      const text = new PIXI.Text(`${info}: ${(towerConfig as any)[info]}`, {
        fontFamily: 'Arial',
        fontSize: 12,
        fill: "white",
        align: 'left',
      });
      text.x = 5;
      text.y = title.height * 1.5 + infoId * text.height;
  
      container.addChild(text);
    })

    container.x = this.gameLevel.game.app.renderer.width / 2 - container.width + id * this.gameLevel.tileSize()
    container.y = this.gameLevel.game.app.renderer.height - this.gameLevel.tileSize() - container.height - 8

    this.towerInfo = container;
    this.gameLevel.levelContainer.addChild(container);
  }

  private hideTowerInfo() {
    this.towerInfo?.destroy();
    this.towerInfo = undefined;
  }

  private prepareMesh() {
    const mesh: { [key: number]: { [key: number]: true } } = {};
    this.gameLevel.fields.forEach(field => {
      [[-1, 1], [-1, 0], [-1, -1], [0, 1],
       [0, -1], [1, 1], [1, 0], [1, -1]].forEach(([shiftX, shiftY]) => {
        const meshX = field.xNumber + shiftX;
        const meshY = field.yNumber + shiftY;
        if (meshX < 0 || meshX >= 20 || meshY < 0 || meshY >= 20) return;

        mesh[meshX] ||= {};
        mesh[meshX][meshY] = true;
      });
    });

    this.gameLevel.fields.forEach(field => { delete mesh[field.xNumber][field.yNumber]});
    return mesh;
  }

  private drawMesh() {
    this.meshContainer = new PIXI.Container();
    this.mesh = this.prepareMesh();

    Object.keys(this.mesh).forEach(x => {
      if (!this.mesh) return
      Object.keys(this.mesh[Number(x)]).forEach(y => {
        const meshField = new PIXI.Graphics()
        meshField.lineStyle(1, 'cyan')
        meshField.beginFill('gray')
          .drawRect(Number(x) * this.gameLevel.tileSize(), Number(y) * this.gameLevel.tileSize(), this.gameLevel.tileSize(), this.gameLevel.tileSize())
          .endFill();
        meshField.alpha = 0.2

        this.meshContainer?.addChild(meshField);
      });
    });

    this.gameLevel.levelContainer.addChild(this.meshContainer);
  }

  private onDragStart(button: PIXI.Sprite, id: number) {
    this.dragTarget = button;
    this.dragTargetId = id;
    button.alpha = 0.5;
    this.hideTowerInfo();
    this.gameLevel.levelContainer.on('pointermove', this.onDragMove.bind(this));
    this.drawMesh();
  }

  private onDragMove(event: any) {
    if (!this.dragTarget) return;
    const tile = this.tileNumberFromCoordinates(event.global.x, event.global.y)
    if (this.mesh && this.mesh[tile.x][tile.y]) {
      this.dragTarget.parent.toLocal(
        { x: tile.x * this.gameLevel.tileSize() + this.gameLevel.tileSize() * 0.5,
          y: tile.y * this.gameLevel.tileSize() + this.gameLevel.tileSize() * 0.5 },
        undefined,
        this.dragTarget.position
      );
    } else {
      this.dragTarget.parent.toLocal(event.global, undefined, this.dragTarget.position);
    }
  }

  private onDragEnd(event: any) {
    if (!this.dragTarget) return
    const tile = this.tileNumberFromCoordinates(event.global.x, event.global.y)
    if (this.mesh && this.mesh[tile.x][tile.y]) {
      this.gameLevel.buyTower(this.dragTargetId || 0, tile.x, tile.y);
    }

    // TODO: doesn't turn off
    this.gameLevel.levelContainer.off('pointermove', this.onDragMove.bind(this));
    this.dragTarget.alpha = 1;
    this.dragTarget.x = this.gameLevel.tileSize() * 0.5 + this.gameLevel.tileSize() * (this.dragTargetId || 0);
    this.dragTarget.y = this.gameLevel.tileSize() * 0.5;
    this.dragTarget = undefined;
    this.dragTargetId = undefined;
    this.meshContainer?.destroy()
  }

  private createHealthBar() {
    const healthBar = new PIXI.Text(`Health: ${this.gameLevel.health}`, {
      fontFamily: 'Arial Black',
      fontSize: 28,
      fill: 0xff1010,
      align: 'center',
    });
    healthBar.x = 5;

    this.gameLevel.levelContainer.addChild(healthBar);
    return healthBar;
  }

  private createCoinsBar() {
    const coinsBar = new PIXI.Text(`Coins: ${this.gameLevel.coins}`, {
      fontFamily: 'Arial Black',
      fontSize: 28,
      fill: 0xffff00,
      align: 'center',
    });
    coinsBar.x = this.gameLevel.game.app.renderer.width - coinsBar.width - 5;

    this.gameLevel.levelContainer.addChild(coinsBar);
    return coinsBar;
  }

  private createQuitButton() {
    const quitButton = new PIXI.Text(`Quit`, {
      fontFamily: 'Arial Black',
      fontSize: 28,
      fill: "white",
      align: 'center',
    });
    quitButton.x = this.gameLevel.game.app.renderer.width - quitButton.width - 5;
    quitButton.y = this.gameLevel.game.app.renderer.height - quitButton.height - 5;
    quitButton.interactive = true;
    quitButton.cursor = "pointer"
    quitButton.on('pointerdown', () => { this.gameLevel.game.backToMenu() });

    this.gameLevel.levelContainer.addChild(quitButton);
  }

  private tileNumberFromCoordinates(x: number, y: number) {
    return { x: Math.floor(x / this.gameLevel.tileSize()), y: Math.floor(y / this.gameLevel.tileSize()) }
  }
}
