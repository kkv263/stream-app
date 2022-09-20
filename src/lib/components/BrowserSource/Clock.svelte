<script lang="ts">
  import { supabase } from "$lib/_includes/supabaseClient";
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import Block from '$lib/components/Grid/Block.svelte'
  import Copy from '$lib/components/icons/Copy.svelte';

  const user = supabase.auth.user();
  let url:string;
  
  onMount(async () => {
    try{
        let { error, status } = await supabase
          .from('bs_clock')
          .select('id')
          .eq('id', user?.id)
          .single();

        if (error && status !== 406) { throw error; }

        // If there's no row, create a row.
        if (status === 406) {
          const { error } = await supabase
          .from('bs_clock')
          .insert({ 
            id: user?.id
          }, { returning: "minimal" });
          if (error) { throw error; }
        }
      } catch (error) {
        console.error(error);
      }
    });
    
    const handleCopy = () => {
      navigator.clipboard.writeText(url)
      // TODO: modal or notification of success copied.
      // .then(() => {
      //     /* clipboard successfully set */
      //   }, () => {
      //     /* clipboard write failed */
      //   });
    };
    url = `${$page?.url.host}/browser-source/clock/${user?.id}`;
</script>

<Block type="bs" on:dragtoggle sizeX={4} sizeY={2} on:deleteblock on:lockblock>
  <div class="clock">
    <div class="title">Copy this url into OBS as a browser source</div>
    <div class="bs-link__wrapper">
      <div class="bs-link">{url}</div>
      <div class="icon-wrapper" on:click={handleCopy}>
        <Copy width="20px" height="20px"/>
      </div>
    </div>
  </div>
</Block>


<style lang="scss">
  @import '../../../styles/vars.scss';
  .clock {
    background-color: $off-black;
    color: #fff;
    overflow: hidden;
    padding: 8px 16px;
    height: 100%;
  }

  .title {
    color: #fff;
    padding: 0 0 12px;
    margin: 0;
    font-size: 14px;
    font-weight: bold;
  }

  .bs-link__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 8px;
  }

  .bs-link {
    display: flex;
    white-space: nowrap;
    overflow: auto;
    background-color: $off-white;
    color: $text-color;
    padding: 4px 8px;
    border-radius: 8px;
    font-size: 14px;
    &::-webkit-scrollbar {
      display: none;
      scrollbar-width: none;
    }
  }

  .icon-wrapper {
    display: inline-flex;
    padding-left: 16px;
    cursor: pointer;
  }
</style>