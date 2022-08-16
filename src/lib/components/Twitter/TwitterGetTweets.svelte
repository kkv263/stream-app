<script lang="ts">

	//TODO: Update type
  let tweets:any = [];
  
	const  handleClick = async() => {
		try {
			const data = await fetch('/api/v1/twitter/gettweets', {
				method: 'GET',
			}).then(res => res.json());

			if (data.errors) {
				console.log(data.errors);
				return;
			}

			if (data.status === 403) {
				// Create a modal for error
				console.log(data.detail);
        alert('twitter error')
        return;
			}

			// Update with data
			console.log(data);
			alert('success');
      tweets = data.data;
      console.log(tweets);
		}
		catch (error) {
			console.log(error);
		}
	}
</script>

<h3>Get Tweets Tweet</h3>
{#each tweets as {text}, i}
  <span>twitter tweet: {text}</span>
  <small></small>
{/each}
<button on:click={handleClick}>Get tweets</button>

<style lang="scss">
  h3 {
    padding-bottom: 0;
  }
</style>