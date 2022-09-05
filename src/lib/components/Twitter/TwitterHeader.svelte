<script lang="ts">
	import { twitterUser } from '$lib/stores/twitterSessionStore'
  import TwitterLogo from '$lib/components/icons/TwitterLogo.svelte';
  import CogMenu from '$lib/components/Grid/CogMenu.svelte';
</script>

<div class="bar">
  <div class="top">
    <a href={`https://twitter.com/${$twitterUser.username}`} target="_blank" rel="noopener noreferrer"><TwitterLogo width="24px" height="24px" /></a>  

    {#if Object.keys($twitterUser).length > 0}
      <div class="profile-wrapper">
        <img src="{$twitterUser.profile_image_url}" alt="{$twitterUser.name} profile image" loading="lazy">
        <div class="name-wrapper">
          <h3>{$twitterUser.name}</h3>
          <span>@{$twitterUser.username}</span>
        </div>
      </div>
    {/if}
    <CogMenu />
  </div>
</div>

<style lang="scss">
	@import '../../../styles/vars.scss';

  .bar {
    color: #fff;
    padding: 4px 16px;
    background-color: #1DA1F2;
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

    span {
      font-size: 12px;
    }
  }
</style>