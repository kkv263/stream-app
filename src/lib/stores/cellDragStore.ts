import { writable } from 'svelte/store'
import type { CellBlock } from '$lib/types/general';

export const cellDragStore = writable({} as CellBlock);