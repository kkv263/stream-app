// OAuth Verifiers store
export interface OAuthVerifiers {
  state: string,
  code_verifier: string
}

// Redirect Parameters for OAuth
export interface RedirectOptions {
  client_id?: string,
  redirect_uri?: string,
  scope?: string,
  state: string,
  code_challenge?: string,
  code_challenge_method?: string,
  code_verifier?: string,
  response_type: string,
}

// Callback Parameters for OAuth
export interface CallBackOptions {
  client_id?: string,
  client_secret?: string,
  redirect_uri?: string,
  grant_type: string,
  code_verifier?: string, 
  state: string,
  code: string
}

// Logout Params for OAuth
export interface LogoutOptions {
  client_id?: string,
  token: string,
  token_type_hint?: string
}

export interface RefreshTokenOptions {
  client_id?: string,
  client_secret?: string,
  refresh_token: string,
  grant_type: 'refresh_token'
}

export interface Token {
  access_token: string,
  refresh_token: string
}

// Auth
export type AuthError = {
  regex: RegExp,
  error: string
}