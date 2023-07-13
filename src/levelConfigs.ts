import { LevelConfig } from './interfaces/levelConfig';
import { SharedConfig } from './interfaces/sharedConfig';

const sharedConfig: SharedConfig = {
  towers: [
    { damage: 12, price: 100, asset: "tower", name: "Basic", speed: 0.5 },
    { damage: 30, price: 220, asset: "tower2", name: "Medium", speed: 0.6 },
    { damage: 75, price: 500, asset: "tower3", name: "Advance", speed: 0.7  }
  ]
}

export const level1Config: LevelConfig = {
  id: 1,
  route: [
    { x: 0, y: 5 },
    { x: 1, y: 5 },
    { x: 1, y: 9 },
    { x: 5, y: 9 },
    { x: 5, y: 4 },
    { x: 9, y: 4 },
    { x: 10, y: 4 },
    { x: 10, y: 3 },
    { x: 17, y: 3 },
    { x: 17, y: 4 },
    { x: 19, y: 4 }
  ],
  mobs: level1Mobs(),
  ...sharedConfig
} 

function level1Mobs() {
  let mobs = [];
  for (let i = 4; i < 24; i += 2) {
    mobs.push({ health: 48, spawnTime: i, reward: 25, damage: 10, asset: "orc" });
  };

  for (let i = 24; i < 44; i += 1) {
    mobs.push({ health: 75, spawnTime: i, reward: 30, damage: 15, asset: "clubOrc" });
  };

  for (let i = 44; i < 64; i += 1) {
    mobs.push({ health: 120, spawnTime: i, reward: 35, damage: 30, asset: "orcMage" });
  };

  for (let i = 64; i < 84; i += 1) {
    mobs.push({ health: 250, spawnTime: i, reward: 40, damage: 35, asset: "kamikazeOrc" });
  };

  for (let i = 84; i < 104; i += 1) {
    mobs.push({ health: 350, spawnTime: i, reward: 50, damage: 50, asset: "minotaur" });
  };

  return mobs;
}

export const level2Config: LevelConfig = {
  id: 2,
  route: [
    { x: 0, y: 6 },
    { x: 1, y: 6 },
    { x: 1, y: 2 },
    { x: 4, y: 2 },
    { x: 4, y: 4 },
    { x: 6, y: 4 },
    { x: 10, y: 4 },
    { x: 10, y: 8 },
    { x: 14, y: 8 },
    { x: 14, y: 4 },
    { x: 17, y: 4 },
    { x: 19, y: 4 }
  ],
  mobs: level2Mobs(),
  ...sharedConfig
} 

function level2Mobs() {
  let mobs = [];
  for (let i = 4; i < 24; i += 2) {
    mobs.push({ health: 48, spawnTime: i, reward: 25, damage: 10, asset: "orc" });
  };

  for (let i = 24; i < 44; i += 1) {
    mobs.push({ health: 80, spawnTime: i, reward: 30, damage: 15, asset: "clubOrc" });
  };

  for (let i = 44; i < 64; i += 1) {
    mobs.push({ health: 120, spawnTime: i, reward: 35, damage: 30, asset: "orcMage" });
  };

  for (let i = 64; i < 84; i += 1) {
    mobs.push({ health: 220, spawnTime: i, reward: 40, damage: 35, asset: "kamikazeOrc" });
  };

  for (let i = 84; i < 104; i += 1) {
    mobs.push({ health: 300, spawnTime: i, reward: 50, damage: 50, asset: "minotaur" });
  };

  return mobs;
}

export const level3Config: LevelConfig = {
  id: 3,
  route: [
    { x: 0, y: 7 },
    { x: 1, y: 7 },
    { x: 1, y: 9 },
    { x: 5, y: 9 },
    { x: 5, y: 4 },
    { x: 2, y: 4 },
    { x: 2, y: 1 },
    { x: 9, y: 1 },
    { x: 9, y: 4 },
    { x: 9, y: 6 },
    { x: 17, y: 6 },
    { x: 17, y: 4 },
    { x: 19, y: 4 }
  ],
  mobs: level3Mobs(),
  ...sharedConfig
} 

function level3Mobs() {
  let mobs = [];
  for (let i = 4; i < 24; i += 2) {
    mobs.push({ health: 48, spawnTime: i, reward: 25, damage: 10, asset: "orc" });
  };

  for (let i = 24; i < 44; i += 1) {
    mobs.push({ health: 75, spawnTime: i, reward: 30, damage: 15, asset: "clubOrc" });
  };

  for (let i = 44; i < 64; i += 0.8) {
    mobs.push({ health: 120, spawnTime: i, reward: 35, damage: 30, asset: "orcMage" });
  };

  for (let i = 64; i < 84; i += 0.7) {
    mobs.push({ health: 220, spawnTime: i, reward: 40, damage: 35, asset: "kamikazeOrc" });
  };

  for (let i = 84; i < 104; i += 0.5) {
    mobs.push({ health: 300, spawnTime: i, reward: 50, damage: 50, asset: "minotaur" });
  };

  return mobs;
}