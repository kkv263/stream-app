<script lang="ts">
  import { onMount } from "svelte";
    let disabled = false;
    let username:string;
    let displayname:string;
    let delay:number;
    let game:string;
    let streamTitle:string;
  
    onMount(async () => {
      getChannelInfo();
    });
  
    const getChannelInfo = async() => {
      try {
        const data = await fetch('/api/v1/twitch/getchannelinfo', {
          method: 'GET'
        }).then(res => res.json());

        if (!data) { return; }

        username = data.data[0].broadcaster_login;
        displayname = data.data[0].broadcaster_name;
        delay = data.data[0].delay;
        game = data.data[0].game_name;
        streamTitle = data.data[0].title;
      }
      catch (error) {
        console.error(error);
      }
    }
  </script>
  
  <h3>Get Twitch Channel info</h3>
  <button on:click={getChannelInfo} disabled={disabled}>Get Channel Info</button>
  <div>user:{username}</div>
  <div>displayname:{displayname}</div>
  <div>delay:{delay} s</div>
  <div>game:{game}</div>
  <div>streamTitle:{streamTitle}</div>
  
  <style lang="scss">
    h3 {
      padding-bottom: 0;
    }
  
    button {
      &[disabled] {
        opacity: .5;
      }
    }
  </style>