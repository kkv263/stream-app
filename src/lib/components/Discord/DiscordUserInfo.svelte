<script lang="ts">
  import { onMount } from "svelte";
  import { discordUser } from "$lib/stores/discordSessionStore";
  import Block from "$lib/components/Grid/Block.svelte";
  import AuthorizeDiscord from "$lib/components/Discord/AuthorizeDiscord.svelte";


  onMount(async () => {
    if (Object.keys($discordUser).length < 1) { return;}
  });

  const getGuildsInfo = async() => {
    try {
      const data = await fetch('/api/v1/discord/getuserguilds', {
        method: 'GET'
      }).then(res => res.json());

      if (!data) { return; }
      console.log(data);

    }
    catch (error) {
      console.error(error);
    }
  }

</script>
  <!-- TODO: for delay use broadcaster type from store to get if partner or not -->
  <!-- TODO: make fields non editable until edit button clicked. Then update all at once -->
  <Block type="discord" on:dragtoggle on:deleteblock on:lockblock>
    <div class="channel">
      {#if Object.keys($discordUser).length > 0}
        <div class="header">
          logged in
          <button on:click={getGuildsInfo}>guilds</button>
        </div>
      {:else}
        <AuthorizeDiscord />
      {/if}
    </div>

  </Block>
  
  <style lang="scss">
    @import '../../../styles/vars.scss';

    .channel {
      background-color: $off-black;
      height: 100%;
    }
  </style>