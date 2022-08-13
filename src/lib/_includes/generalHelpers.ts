import crypto from 'crypto';

export const base64URLEncode = (str:Buffer) => {
  return str.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export const sha256 = (buffer:any) => {
  return crypto.createHash('sha256').update(buffer).digest();
}
