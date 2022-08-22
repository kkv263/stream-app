import type { Load } from "@sveltejs/kit";

// TODO: session no longer exists. Move layout.server.ts stuff in here?
export const load:Load = async({ parent }) => {
  // const { twitchuser, twitteruser } = await parent();
}
