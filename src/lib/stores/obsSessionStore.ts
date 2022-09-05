import { writable } from 'svelte/store'
import { supabase } from "$lib/_includes/supabaseClient";
import { validateWebsocketUrl } from "$lib/_includes/generalHelpers";
import OBSWebSocket, { EventSubscription } from 'obs-websocket-js';

const obs:OBSWebSocket = new OBSWebSocket();
export const obsSession = writable({localhost: '', password:'', obs: obs});
export const obsConnected = writable(false);

//TODO: add automatic reconnect to supabase
//TODO Dispatch error on errors
export const checkExistingSession = async() => {
  try {
    const user = supabase.auth.user();
    let { data, error, status } = await supabase
      .from('obs')
      .select('websocket_url, password')
      .eq('id', user?.id)
      .single();

    if (error && status !== 406) { throw error; }

    if (data) {
      const localhost = data.websocket_url ?? '';
      const password = data.password ?? '';

      if (localhost !== '' && password !== '') {
        obsSession.set({localhost: localhost, password:password, obs:obs});
        return true;
      }
    }

    // If there's no row, create a row.
    if (status === 406) {
      const { error } = await supabase
      .from('obs')
      .insert({ id: user?.id }, { returning: "minimal" });
      if (error) { throw error; }
    }
    return false;
  } catch (error) {
    console.error(error);
  }
};

export const obsConnect = async(localhost:string, password:string) => {
  try {
    // Localhost: 127.0.0.1:4455
    const { url, match } = validateWebsocketUrl(localhost.trim());
    if (localhost === '') {
      alert('localhost required')
      return;
    }
    if (!match) { 
      alert('local host format not valid');
      return; 
    }

    const user = supabase.auth.user();
    // TODO Change event subscript down the line to the ones we only need.
    const { obsWebSocketVersion, negotiatedRpcVersion } = await obs.connect(url, password, {
      eventSubscriptions: EventSubscription.All | EventSubscription.InputVolumeMeters,
    });
    console.log(`Connected to server ${obsWebSocketVersion} (using RPC ${negotiatedRpcVersion})`)

    let { error } = await supabase.from('obs').upsert({
      id: user?.id,
      websocket_url: url,
      password: password 
    }, { returning: "minimal" });
    obsSession.set({localhost: localhost, password:password, obs:obs});
    obsConnected.set(true);
  } catch (error: any) {
    console.error('Failed to connect', error.code, error.message);
    alert(error.message || 'Failed to connect, make sure OBS websocket server is active.');
  }
}

export const obsDisconnect = async() => {
  try {
    await obs.disconnect();
    const user = supabase.auth.user();
    let { error } = await supabase.from('obs').upsert({
        id: user?.id,
        websocket_url: null,
        password: null 
      }, { returning: "minimal" });
    alert('disconnected from obs');
    obsSession.set({localhost: '', password:'', obs:obs});
    obsConnected.set(false);
  } catch (error: any) {
    console.error(error)
  }
}