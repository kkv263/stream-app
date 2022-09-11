<script lang="ts">
	import { discordUser } from '$lib/stores/discordSessionStore'
  import CogMenu from '$lib/components/Grid/CogMenu.svelte';
  import DiscordLogo from '$lib/components/icons/DiscordLogo.svelte';
</script>

<header>
  <div class="top">
    <a href="https://discord.com/" target="_blank" rel="noopener noreferrer"><DiscordLogo width="24px" height="24px"/></a>  

    {#if Object.keys($discordUser).length > 0}
      <div class="profile-wrapper">
        <img src="https://cdn.discordapp.com/avatars/{$discordUser.id}/{$discordUser.avatar}.png" alt="{$discordUser.username} profile image" loading="lazy">
        <div class="name-wrapper">
          <h3>{$discordUser.username}#{$discordUser.discriminator}</h3>
        </div>
      </div>
    {/if}

    <CogMenu on:deleteblock on:lockblock/>
  </div>
</header>

<style lang="scss">
	@import '../../../styles/vars.scss';

  header {
    color: #fff;
    padding: 4px 16px;
    background-color: #7289DA;
    min-height: 32px;
    display: flex;
    align-items: center;
  }

  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    a {
      display: inline-flex;
      align-items: center;
      text-decoration: none;
      color: #fff;

      &:hover,
      &:focus {
        text-decoration: none;
        opacity: .5;
        box-shadow: none;
      }
    }
  }

  .profile-wrapper {
    display: flex;
    align-items: center;
    padding: 0 16px;
    img {
      border-radius: 100%;
      max-width: 32px;
    }
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 8px;

    h3 {
      padding-bottom: 0;
      color: #fff;
      font-size: 14px;
    }
  }
</style>