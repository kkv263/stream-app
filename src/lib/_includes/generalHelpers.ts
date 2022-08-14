import crypto from 'crypto';

export const base64URLEncode = (str:Buffer) => {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

export const sha256 = (buffer:any) => {
  return crypto.createHash('sha256').update(buffer).digest();
};

export const validateWebsocketUrl = (url:string) => {
  const urlFormatted = !url.includes('wss') && !url.includes('ws') ? `ws://${url}` : url;
  const websockRegex = new RegExp(/^(wss?:\/\/)([0-9]{1,3}(?:\.[0-9]{1,3}){3}|[a-zA-Z]+):([0-9]{1,5})$/);
  return { url: urlFormatted, match: websockRegex.test(urlFormatted) };
};
