<script lang="ts">
	import { twitterUser } from '$lib/stores/twitterSessionStore'
  import Ellipsis from '$lib/components/icons/Ellipsis.svelte';
  import TwitterLogo from '$lib/components/icons/TwitterLogo.svelte';
</script>

<header>
  <div class="top">
    <a href={`https://twitter.com/${$twitterUser.username}`} target="_blank" rel="noopener noreferrer"><TwitterLogo width="24px" height="24px" /></a>  
    <button type="button"><Ellipsis width="20px" height="20px"/></button>
  </div>
  <div class="profile-wrapper">
    <img src="{$twitterUser.profile_image_url}" alt="{$twitterUser.name} profile image" loading="lazy">
    <div class="name-wrapper">
      <h3>{$twitterUser.name}</h3>
      <span>@{$twitterUser.username}</span>
    </div>
  </div>

</header>

<style lang="scss">
	@import '../../../styles/vars.scss';

  header {
    color: #fff;
    background-color: #243447;
    width: 100%;
    padding-bottom: 24px;
  }

  button {
    background-color: transparent;
    border: 0;
    color: currentColor;
    cursor: pointer;
  }

  .top {
    padding-bottom: 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    a {
      display: block;
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
    img {
      border-radius: 100%;
    }
  }

  .name-wrapper {
    display: flex;
    flex-direction: column;
    padding-left: 16px;

    h3 {
      padding-bottom: 0;
      color: #fff;
    }
  }
</style>