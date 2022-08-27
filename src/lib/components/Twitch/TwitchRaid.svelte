<script lang="ts">
  import { onMount } from "svelte";
  import { convertMsToTime } from "$lib/_includes/generalHelpers";
  import UserOutline from "$lib/components/icons/UserOutline.svelte";
  import TwitchHeader from "./TwitchHeader.svelte";
  import Button from "$lib/components/_global/Button.svelte";
  import Question from "$lib/components/icons/Question.svelte";

  let streams:any[];
  let randomIndex:number;

  const getUserFollows = async() => {
    const follows:any[] = []
    try {
      const data = await fetch('/api/v1/twitch/getuserfollows', {
        method: 'GET'
      }).then(res => res.json());

      if (!data) { return; }
      data.data.forEach((follow:any) => {
        follows.push(follow.to_id);
      });
    }
    catch (error) {
      console.error(error);
    }

    return follows;
  }

  const startStreamTimer = (randomIndex:number) => {
    const stream = streams[randomIndex]
    stream.duration_ms = new Date().getTime() - new Date(stream.started_at).getTime();
    stream.interval = setInterval(() => {
      stream.duration_ms += 1000;
      if (stream.type != 'live') {
        clearInterval(stream.interval);
      }
      streams = streams;
    }, 1000);
  }

  const getUserInfo = async() => {
    try {
      const data = await fetch('/api/v1/twitch/getuserinfo', {
        method: 'POST',
        body: JSON.stringify({
          user_ids: await getUserFollows()
        })
      }).then(res => res.json());

      if (!data) { return; }
      streams = data.filter((stream:any) => { return stream.type === 'live'; });
      randomIndex = Math.floor(Math.random() * streams.length);
      startStreamTimer(randomIndex)

    }
    catch (error) {
      console.error(error);
    }
  }

  const changeImage = (i:number) => {
    clearInterval(streams[randomIndex].interval);
    startStreamTimer(i)
    randomIndex = i;
  }

  const getRandom = async() => {
    //TODO: do later with a store to minimize calls.
  }

  onMount(async () => {
    getUserInfo();
  });
</script>

<section>
  <TwitchHeader />
  <div class="twitch-raid__wrapper">
    {#if streams}
      <div class="streamers">
        {#each streams as {display_name, profile_image_url}, i}
          <div class="img-wrapper" data-active={randomIndex === i} on:click={() => changeImage(i)}>
            <img class="profile" src="{profile_image_url}" alt="{display_name + " profile image"}" loading="lazy">
          </div>
        {/each}
        <div class="img-wrapper">
          <Question width="48px" height="48px"/>
        </div>
      </div>
      <div class="stream">
        <div class="top">
          <h2>{streams[randomIndex].display_name}</h2>
          <div>{streams[randomIndex].game_name}</div>
        </div>
        <img class="thumbnail" src="{streams[randomIndex].thumbnail_url.replace('{width}', '1900').replace('{height}', '1080')}" alt="">
        <div class="bottom">
          <div>
            <h3><UserOutline width="16px" height="16px"/>{streams[randomIndex].viewer_count}</h3>
            <div>{convertMsToTime(streams[randomIndex].duration_ms)}</div>
          </div>
          <Button type="button" color="primary">Start Raid</Button>
        </div>
      </div>
    {/if}
  </div>

</section>


    
  <style lang="scss">
    @import '../../../styles/vars.scss';
    section {
      max-width: 375px;
      background-color: $off-black;
    }
    .twitch-raid__wrapper {
      padding: 16px;
      // Temporary
      color: #fff;
      display: flex;
    }

    h3 {
      color: #fff;
      padding-bottom: 0;
    }

    img.profile {
      width: 48px;
      height: 48px;
      border-radius: 100%;
      object-fit: cover;
    }

    img.thumbnail {
      width: 100%; 
      border-radius: 4px;
      margin-bottom: 16px;
    } 

    .streamers {
      display: flex;
      flex-direction: column;
      padding-right: 16px; 
      border-right: 1px solid rgba(#fff, .75);
    }

    .img-wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      cursor: pointer;
      transition: $transition;
      border-radius: 100%;
      border: 3px solid transparent;
      &[data-active="true"] {
        border: 3px solid $pink;
      }

      &:hover,
      &:focus {
        opacity: .5;
      }
    }

    .stream {
      padding-left: 16px;

      .top {
        h2 {
          font-size: 20px;
          color: #fff;
          padding-bottom: 0;
        }
        div {
          font-size: 14px;
          color: rgba(#fff, .75);
        }
        padding-bottom: 16px;
      }

      .bottom {
        display: flex;
        align-items: center;
        justify-content: space-between;

        h3 {
          color: #EB0600;
          display: flex;
          align-items: center;
        }
        div {
          color: rgba(#fff, .75);
          font-size: 14px;
        }
      }
    }
  </style>