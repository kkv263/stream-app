import type { Load } from "@sveltejs/kit";

// TODO: session no longer exists.
export const load:Load = async({parent}) => {
  const { twitchuser, twitteruser } = await parent();
}
