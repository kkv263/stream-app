import cryptoRandomString from 'crypto-random-string';

const endpoint = 'https://twitter.com/i/oauth2/authorize'

interface RedirectOptions {
  client_id: string,
  redirect_uri: string,
  scope: string,
  state: string,
  code_challenge: string,
  challenge_method: string,
}

const params: RedirectOptions = {
  'client_id': import.meta.env.VITE_TWITTER_OAUTH_CLIENT_ID as string,
  'redirect_uri' :'http://127.0.0.1:5173/v1/callback',
  'scope': "tweet.read%20users.read%20tweet.write%20offline.access",
  'state': cryptoRandomString({length: 15, type: 'distinguishable'}),
  'code_challenge': 'challenge',
  'challenge_method': 'plain'
}

// Ask for OAuth token from twitter.
export const GET = async () => {
  return {
    status: 302,
    headers: {
      location: `${endpoint}?response_type=code&client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&scope=${params.scope}&state=${params.state}&code_challenge=${params.code_challenge}&code_challenge_method=${params.challenge_method}`
    }
  }
};