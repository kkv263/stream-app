<script lang="ts">
  import { onMount } from "svelte";

  let streams:any[] = [];

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

    try {
      const data = await fetch('/api/v1/twitch/getuserinfo', {
        method: 'POST',
        body: JSON.stringify({
          user_ids: follows
        })
      }).then(res => res.json());

      if (!data) { return; }
      console.log(data)
      streams = data;
    }
    catch (error) {
      console.error(error);
    }
  }

  onMount(async () => {
    
  });
  
  </script>
  <h3>Start raid</h3>
  <button on:click={getUserFollows}>Get user follow</button>
  {#each streams as {display_name, profile_image_url, type}}
    <div>
      {display_name}, {type}
      <img src="{profile_image_url}" alt="">
    </div>
  {/each}
  
  <style lang="scss">
    img {
      width: 64px;
      height: 64px;
      border-radius: 100%;
      object-fit: cover;
    }
  </style>