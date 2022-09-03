
import type { SvelteComponent } from 'svelte/internal';

export type InputError = {
  regex?: RegExp,
  error: string
}

export type CellBlock = {
  [index: string],
  block: SvelteComponent | null,
  sizeX: number,
  sizeY: number,
  pos: string,
  draggable: boolean,
  hovered: boolean,
  invisible: boolean,
  x: number,
  y: number
}