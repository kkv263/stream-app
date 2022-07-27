import cryptoRandomString from 'crypto-random-string';
import crypto from 'crypto';

export async function GET() {
  const randomState = cryptoRandomString({length: 10, type: 'distinguishable'});
  const hash = crypto.createHash('sha256').update(randomState).digest('base64');
  return { 
    body: {
      message:hash
    } 
  };    
}
