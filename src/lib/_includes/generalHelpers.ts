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

const padTo2Digits = (num:number) => num.toString().padStart(2, '0')

export const convertMsToTime = (milliseconds:number) => {
  let seconds = Math.floor(milliseconds / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);

  seconds = seconds % 60;
  minutes = minutes % 60;

  return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;
}

export const timeSince = (date:number) => {
  const seconds = Math.floor(((<any>new Date()) - date) / 1000);

  // Don't need this now, but maybe in the future.
  // let interval = seconds / 31536000;
  // if (interval > 1) {return Math.floor(interval) + " years";}
  // interval = seconds / 2592000;
  // if (interval > 1) {return Math.floor(interval) + " months";}
  // interval = seconds / 86400;
  // if (interval > 1) {return Math.floor(interval) + " days";}

  let interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + 'h';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + 'm';
  }
  return Math.floor(seconds) + 's';
  }


export const clickOutside = (
  node: HTMLElement,
  handler: () => void
): { destroy: () => void } => {
  const onClick = (event: MouseEvent) =>
    node &&
    !node.contains(event.target as HTMLElement) &&
    !event.defaultPrevented &&
    handler();

  document.addEventListener('click', onClick, true);

  return {
    destroy() {
      document.removeEventListener('click', onClick, true);
    },
  };
}