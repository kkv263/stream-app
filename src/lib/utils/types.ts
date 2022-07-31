// OAuth Verifiers store
export interface OAuthVerifiers {
  state: string,
  code_verifier: string
}

// Redirect Parameters for OAuth
export interface RedirectOptions {
  client_id: string,
  redirect_uri: string,
  scope: string,
  state: string,
  code_challenge: string,
  challenge_method: string,
  code_verifier: string,
}

// Callback Parameters for OAuth
export interface CallBackOptions {
  client_id: string,
  redirect_uri: string,
  grant_type: string,
  code_verifier: string, 
  state: string,
  code: string
}

export interface LogoutOptions {
  client_id: string,
  token: string,
  token_type_hint: string
}