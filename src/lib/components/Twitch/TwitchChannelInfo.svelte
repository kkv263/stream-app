<script lang="ts">
  import { onMount } from "svelte";
  import TwitchHeader from "$lib/components/Twitch/TwitchHeader.svelte";
  import Button from "$lib/components/_global/Button.svelte";
  import CheckCircle from "$lib/components/icons/CheckCircle.svelte";
  import { twitchUser } from "$lib/stores/twitchSessionStore";

  let disabled = false;
  let username:string;
  let displayname:string;
  let delay:number;
  let game:string = '';
  let streamTitle:string = '';
  let isEdit:boolean = false;
  let loading:boolean = false;
  let updated:boolean = false;
  let currentGame = '';
  let currentTitle = '';

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
      game = currentGame = data.data[0].game_name;
      streamTitle = currentTitle = data.data[0].title;
    }
    catch (error) {
      console.error(error);
    }
  }

  const modifyChannelInfo = async() => {
    const body = {
      ...(streamTitle) && { title: streamTitle },
      ...(game) && { game_id: game }
    };

    console.log(body);

    if (Object.keys(body).length === 0) { return; }
    loading = true;
    try {
      fetch('/api/v1/twitch/modifychannelinfo', {
        method: 'POST',
        body: JSON.stringify(body)
      })
    }
    catch (error) {
      console.error(error);
    }
    setTimeout(() => loading = false, 1000)

  }

  const toggleEdit = () => {
    if (isEdit) {
      if (currentGame !== game || currentTitle !== streamTitle) { 
        modifyChannelInfo();
        updated = true;
        setTimeout(() => updated = false, 5000)
        currentGame = game;
        currentTitle = streamTitle;
      }
    }
    isEdit = !isEdit
  }
</script>
  <!-- TODO: for delay use broadcaster type from store to get if partner or not -->
  <!-- TODO: make fields non editable until edit button clicked. Then update all at once -->
  <section>
    <TwitchHeader />
    <div class="channel-info">
      <div class="header">
        <h3>Channel Information</h3>
        <div hidden={!updated}>Updated <CheckCircle width="16px" height="16px"/></div>
      </div>
      <div class="input-wrapper">
        <label for="twitch_game">Game</label>
        <input id="twitch_game" hidden={!isEdit} bind:value={game}/>
        <div hidden={isEdit}>{game}</div>
      </div>
      <div class="input-wrapper">
        <label for="twitch_title">Stream Title</label>
        <input id="twitch_title" hidden={!isEdit} bind:value={streamTitle}/>
        <div hidden={isEdit}>{streamTitle}</div>
      </div>
      <!-- TODO: Implementation for Partner -->
      {#if $twitchUser.broadcaster_type === 'partner'}
      <div class="input-wrapper">
        <label for="twitch_delay">Delay</label>
        <div id="twitch_delay" hidden={isEdit}>{delay}</div>
      </div>
      {/if}
      <Button type="button" color="primary" on:click={toggleEdit} disabled={loading}>{!isEdit && !loading ? 'Edit' : (!loading ? 'Update' : 'Updating')}</Button>
    </div>

  </section>
  
  <style lang="scss">
    @import '../../../styles/vars.scss';
    section {
      width: 100%;
      max-width: 375px;
    }

    .channel-info {
      padding: 16px;
      background-color: $off-black;
      color: #fff;
    }

    .header {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      padding-bottom: 24px;
      h3 {
        padding-right: 8px;
      }
      div {
        color: $blue;
        border: 1px solid $blue;
        padding: 4px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: $transition;

        &[hidden] {
          opacity: 0;
          visibility: hidden;
        }
      }
    }

    h3 {
      color: #fff;
      padding: 0;
    }
  
    .input-wrapper {
      display: flex;
      flex-direction: column;
      &:not(:last-child) {
        padding-bottom: 24px;
      }
      
      div {
        padding: 4px 0;
        height: 22px;
      }

      label {
        padding-bottom: 8px;
        font-family: 'Roboto Condensed', sans-serif;
        font-weight: bold;
      }

      input {
        background-color: #4C4C6B;
        border-radius: 4px;
        border: 1px solid $twitch-purple;
        color: #fff;
        padding: 4px 8px;
        height: 20px;
      }
    }
  </style>