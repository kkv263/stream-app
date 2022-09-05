<script lang="ts">
	import { twitchUser } from '$lib/stores/twitchSessionStore'
  import CogMenu from '$lib/components/Grid/CogMenu.svelte';
  import TwitchLogo from '$lib/components/icons/TwitchLogo.svelte';
</script>

<header>
  <div class="top">
    <a href={`https://twitch.tv/${$twitchUser.login}`} target="_blank" rel="noopener noreferrer"><TwitchLogo width="24px" height="24px" /></a>  

    {#if Object.keys($twitchUser).length > 0}
      <div class="profile-wrapper">
        <img src="{$twitchUser.profile_image_url}" alt="{$twitchUser.login} profile image" loading="lazy">
        <div class="name-wrapper">
          <h3>{$twitchUser.display_name}</h3>
        </div>
      </div>
    {/if}

    <CogMenu />
  </div>
</header>

<style lang="scss">
	@import '../../../styles/vars.scss';

  header {
    color: #fff;
    padding: 4px 16px;
    background-color: #6441A5;
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