<script lang="ts">
  import { getContext, onDestroy, onMount } from 'svelte';
  import { convertMsToTime } from '$lib/_includes/generalHelpers';
  import type OBSWebSocket from 'obs-websocket-js';

  let obs:OBSWebSocket = getContext('obs');
  let streaming:boolean = false;
  let recording:boolean = false;
  let recordingPaused:boolean = false;
  let stopping:boolean = false;
  let recordTime:number = 0;
  let streamingTime:number = 0;
  
  // TODO: types?
  let recordInterval:any = null
  let streamInterval:any = null

  onMount(async () => {
    const obsStatus = await loadStatus();
    recording = obsStatus.recordStatus.outputActive;
    recordingPaused = obsStatus.recordStatus.outputPaused;
    streaming = obsStatus.streamStatus.outputActive;
    recordTime = obsStatus.recordStatus.outputDuration;
    streamingTime = obsStatus.streamStatus.outputDuration;

    const startRecordTimer = () => {
      setTimeout(() => {
        recordTime += 1000 - (recordTime % 1000); 
      }, 1000 - (recordTime % 1000))

      recordInterval = setInterval(() => {
        recordTime += 1000;
      }, 1000);
    }

    const startStreamTimer = () => {
      setTimeout(() => {
        streamingTime += 1000 - (streamingTime % 1000); 
      }, 1000 - (streamingTime % 1000))

      streamInterval = setInterval(() => {
        streamingTime += 1000;
      }, 1000);
    }

    obs.on('RecordStateChanged', (e) => {
      switch(e.outputState) {
        case 'OBS_WEBSOCKET_OUTPUT_STARTED' :
          recording = true;
          startRecordTimer();
          break;
        case 'OBS_WEBSOCKET_OUTPUT_PAUSED' :
          recordingPaused = true;
          clearInterval(recordInterval)
          break;
        case 'OBS_WEBSOCKET_OUTPUT_RESUMED' :
          startRecordTimer();
          recordingPaused = false;
          break;
        case 'OBS_WEBSOCKET_OUTPUT_STOPPING' :
          stopping = true;
          break;
        case 'OBS_WEBSOCKET_OUTPUT_STOPPED' :
          recording = false;
          recordingPaused = false;
          stopping = false;
          clearInterval(recordInterval)
          recordInterval = null
          recordTime = 0;
          break;
        }
    });

    obs.on('StreamStateChanged', (e) => {
      streaming = e.outputActive
      if (e.outputActive) {
        startStreamTimer();
      }
      else {
        clearInterval(streamInterval)
        streamInterval = null
        streamingTime = 0;
      }
    });
	});

  onDestroy(() => {
    obs.off('RecordStateChanged', () => {});
    obs.off('StreamStateChanged', () => {});
	});

  const loadStatus = async() => {
    const recordStatus= await obs.call('GetRecordStatus');
    const streamStatus = await obs.call('GetStreamStatus');
    return { 
      recordStatus,
      streamStatus
    };
  }

  const OBSStream = async() => {
    await obs.call('ToggleStream');
    streaming = !streaming;
  }

  const OBSRecord = async() => {
    await obs.call('ToggleRecord');
    recording = !recording;
  }

  const OBSRecordPause = async() => {
    await obs.call('ToggleRecordPause');
    recordingPaused = !recordingPaused;
  }
</script>

<div>
  <h2>obs control</h2>
  <div class="wrapper">
    {convertMsToTime(streamingTime)}
    <button type="button" on:click={OBSStream}>{streaming ? 'Stop streaming' : 'stream'}</button>
    {convertMsToTime(recordTime)}
    <button type="button" on:click={OBSRecord}>{recording ? 'Stop recording' : 'Record'}</button>
  </div>
  {#if recording} 
    <button type="button" on:click={OBSRecordPause}>{!recordingPaused ? 'pause recording' : 'unpause recording'}</button>
  {/if}
</div>

<style lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;
  }
</style>