import { SharedConfig } from "./sharedConfig";

export interface LevelConfig extends SharedConfig {
  id: number,
  route: { x: number; y: number; }[],
  mobs: { health: number, spawnTime: number, damage: number, reward: number, asset: string }[]
}
