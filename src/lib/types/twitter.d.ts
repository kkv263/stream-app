export interface TweetPostOptions {
  text?:string
  reply_settings?:string
}

export interface TweetProfileUpdateOptions {
  name?:string
  description?:string
}

export interface TwitterUser {
  id: string,
  name: string,
  username: string
}