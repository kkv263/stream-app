import { writable } from 'svelte/store'
import type { CellBlock } from '$lib/types/general';

export const cellDragStore = writable({} as CellBlock);
export const cellDragOffset = writable(0);