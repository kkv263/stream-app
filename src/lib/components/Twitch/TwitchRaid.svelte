<script lang="ts">
  import { onMount } from "svelte";
  import { convertMsToTime } from "$lib/_includes/generalHelpers";
  import { twitchUser } from "$lib/stores/twitchSessionStore";
  import UserOutline from "$lib/components/icons/UserOutline.svelte";
  import Button from "$lib/components/_global/Button.svelte";
  import Block from "$lib/components/Grid/Block.svelte";
  import Question from "$lib/components/icons/Question.svelte";
  import AuthorizeTwitch from "$lib/components/Twitch/AuthorizeTwitch.svelte";

  let streams:any[];
  let randomIndex:number;
  let gameId:string;
  let lang:string;

  onMount(async () => {
    if (Object.keys($twitchUser).length < 1) { return;}
    getChannelInfo();
    getUserInfo();
  });

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

  const getChannelInfo = async() => {
    try {
      const data = await fetch('/api/v1/twitch/getchannelinfo', {
        method: 'GET'
      }).then(res => res.json());

      if (!data) { return; }
      const [channelInfo] = data.data;
      lang = channelInfo.broadcaster_language;
      gameId = channelInfo.game_id;
    }
    catch (error) {
      console.error(error);
    }
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
      streams = await getRandom(true) ?? streams;
      randomIndex = Math.floor(Math.random() * (streams.length === 1 ? 1 : streams.length - 1));
      startStreamTimer(randomIndex)
    }

    catch (error) {
      console.error(error);
    }
  }

  const changeImage = async(i:number) => {
    if (i === streams.length - 1) {
      streams[i] = await getRandom(false);
    }
    clearInterval(streams[randomIndex].interval);
    startStreamTimer(i)
    randomIndex = i;
  }

  const getRandom = async(init:boolean=false) => {
    try {
      const data = await fetch('/api/v1/twitch/getrandomstream', {
        method: 'POST',
        body: JSON.stringify({
          game_id: gameId,
          lang: lang
        })
      }).then(res => res.json());

      if (!data) { return; }
      if (init) {
        streams.push(data);
        return streams;
      }

      return data;
    }
    catch (error) {
      console.error(error);
    }

  }

</script>

<!-- TODO disable raid when not streaming. -->
<!-- TODO scroll on left side -->
<Block type="twitch" on:dragtoggle on:deleteblock>
  <div class="twitch-raid__wrapper">
    {#if Object.keys($twitchUser).length > 0}
      <div class="streamers">
        {#if streams}
          {#each streams as {display_name, profile_image_url}, i}
              <div class="img-wrapper" data-active={randomIndex === i} on:click={() => changeImage(i)}>
                {#if streams.length - 1 != i} 
                  <img class="profile" src="{profile_image_url}" alt="{display_name + " profile image"}" loading="lazy">
                {:else}
                  <Question width="54px" height="54px"/>
                {/if}
              </div>
          {/each}
        {/if}
      </div>
      <div class="stream">
        <h3 class="headline">Raid a streamer</h3>
        {#if streams?.[randomIndex]}
          <div class="top">
            <h2>{streams[randomIndex]?.user_name}</h2>
            <div>{streams[randomIndex]?.game_name}</div>
          </div>
          <!-- <a href={`https://twitch.tv/${streams[randomIndex]?.user_login}`} target="_blank" rel="noopener noreferrer">
            <img class="thumbnail" src="{streams[randomIndex]?.thumbnail_url.replace('{width}', '1900').replace('{height}', '1080')}" alt="">
          </a> -->
          <div class="bottom">
            <div>
              <h3><UserOutline width="16px" height="16px"/>{streams[randomIndex]?.viewer_count}</h3>
              <div>{convertMsToTime(streams[randomIndex]?.duration_ms)}</div>
            </div>
            <Button type="button" color="primary">Start Raid</Button>
          </div>
        {/if}
      </div>
    {:else}
      <AuthorizeTwitch />
    {/if}
  </div>

</Block>
    
  <style lang="scss">
    @import '../../../styles/vars.scss';
    .twitch-raid__wrapper {
      justify-content: center;
      padding: 16px;
      background-color: $off-black;
      color: #fff;
      display: flex;
      max-height: 172px;
    }

    h3 {
      color: #fff;
      padding-bottom: 0;
    }

    .headline {
      padding-bottom: 24px;
    }

    img.profile {
      width: 40px;
      height: 40px;
      border-radius: 100%;
      object-fit: cover;
    }

    img.thumbnail {
      width: 100%; 
      border-radius: 4px;
      object-fit: cover;
    } 

    .streamers {
      display: flex;
      flex-direction: column;
      padding-right: 16px; 
      border-right: 1px solid rgba(#fff, .75);
      overflow-y: auto;
      overflow-x: hidden;
    }

    a {
      text-decoration: none;
      cursor: pointer;
      position: relative;
      display: block;
      border-radius: 4px;
      margin-bottom: 16px;

				&:after {
					border-radius: 4px;
					transition: $transition;
					opacity: 0;
					visibility: hidden;
					content: 'Visit Live Stream';
					position: absolute;
					top: 0;
					left: 0;
					background-color: #000;
					width: 100%;
					height: 100%;
					z-index: 1;
					color: #fff;
					display: flex;
					align-items: center;
					text-align: center;
					justify-content: center;
					font-weight: bold;
				}

				&:hover,
				&:focus {
					box-shadow: none;
					text-decoration: none;
					&:after {
						visibility: visible;
						opacity: .75;
					}
				}	
    }

    .img-wrapper {
      display: flex;
      align-items: center;
      margin-bottom: 24px;
      cursor: pointer;
      transition: $transition;
      border-radius: 100%;
      border: 3px solid transparent;
      position: relative;
      width: 40px;
      &[data-active="true"] {
        &::after{
          content: '';
          position: absolute;
          display: block;
          width: 0;
          z-index: 1;
          border-style: solid;
          border-color: transparent #fff;
          border-width: 8px 8px 8px 0;
          top: 50%;
          left: calc(100% + 12px);
          margin-top: -8px;
        }
      }

      &:hover,
      &:focus {
        opacity: .5;
      }
    }

    .stream {
      padding-left: 16px;
      min-height: 262px;
      width: 100%;

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