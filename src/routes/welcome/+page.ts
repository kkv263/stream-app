import type { Load } from "@sveltejs/kit";

export const load:Load = async({session}) => {
  return {
  ...(session.twitchuser) && {twitchUser: session.twitchuser},
};
}
