import cookie from 'cookie';

export const load = async(event:any) => {
  return {
    ...(event.locals.platform === 'twitter') && {twitteruser: event.locals[`${event.locals.platform}user`]},
    ...(event.locals.platform === 'twitch') && {twitchuser: event.locals[`${event.locals.platform}user`]},
  }
}