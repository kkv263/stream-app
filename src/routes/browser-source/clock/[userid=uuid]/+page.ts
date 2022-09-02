// TODO: Use this to grab "user" settings for clock
import type { Load } from "@sveltejs/kit";
import { supabase } from "$lib/_includes/supabaseClient";

export const load:Load = async({ params }) => {
  const userid = params.userid;

  let { data, error, status } = await supabase
  .from('bs_clock')
  .select('military_time')
  .eq('id', userid)
  .single();

  if (error && status !== 406) { throw error; }

  if (data) {
    return data;
  }
}
