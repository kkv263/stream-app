
import type { SvelteComponentTyped } from 'svelte/internal';

export type InputError = {
  regex?: RegExp,
  error: string
}

export type CellBlock = {
  [index: string],
  block: $$Generic<typeof SvelteComponentTyped<any, any, any>>;
  val: string,
  sizeX: number,
  sizeY: number,
  pos: string,
  draggable: boolean,
  hovered: boolean,
  invisible: boolean,
  locked: boolean,
  x: number,
  y: number
}

export interface Block {
  [val: string]: { 
    name: string;
    block: $$Generic<typeof SvelteComponentTyped<any, any, any>>;
    sizeX: number;
    sizeY: number;
  }
}


export interface SaveBlock {
  val: string,
  pos: number;
  sizeX: number;
  sizeY: number;
}

export interface SaveState {
  [val?: string]: SaveBlock | null | undefined
}