import { supabase } from "$lib/_includes/supabaseClient";
import TwitterGetTweets from "$lib/components/Twitter/TwitterGetTweets.svelte";
import Clock from "$lib/components/BrowserSource/Clock.svelte";
import type { CellBlock, SaveBlock, Block } from '$lib/types/general';

export const blockCodes:Block = {
  'CLCK': {
    name: 'Clock',
    block: Clock,
    sizeX: 4,
    sizeY: 2
  },
  'TWTR-GET' : {
    name: 'Twitter Get Tweets',
    block: TwitterGetTweets,
    sizeX: 4,
    sizeY: 4
  }
};

export const checkExistingRow = async() => {
  let saveState:SaveBlock = {}

  try {
    const user = supabase.auth.user();
    let { data, error, status } = await supabase
      .from('grid')
      .select('*')
      .eq('id', user?.id)
      .single();

    if (error && status !== 406) { throw error; }

    if (data) {
      const {id: _i, updated_at: _u, ...filterSave} = data;

      saveState = Object.keys(filterSave)
      .filter((k) => filterSave[k] != null)
      .reduce((a, k) => ({ ...a, [k]: filterSave[k] }), {});
    }

    // If there's no row, create a row.
    if (status === 406) {
      const { error } = await supabase
      .from('grid')
      .insert({ id: user?.id }, { returning: "minimal" });
      if (error) { throw error; }
    }
  } catch (error) {
    console.error(error);
  }

  return saveState;
}

export const updateSaveState = async(saveState:SaveBlock) => {
  try {
    const user = supabase.auth.user();
    const updates = {
      id: user?.id,
      updated_at: new Date(),
      ...saveState
    };

    let { error } = await supabase.from("grid").upsert(updates, {
      returning: "minimal", // Don't return the value after inserting
    });

    if (error) throw error;
  } catch(error: any) {
    alert(error.message);
  }
};