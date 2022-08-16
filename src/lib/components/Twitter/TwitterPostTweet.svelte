<script lang="ts">
	let tweet:string;
  
	const  handleClick = async() => {
		try {
			const data = await fetch('/api/v1/twitter/tweet', {
				method: 'POST',
				body: JSON.stringify({
					text: tweet
				})
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
			alert('success');
		}
		catch (error) {
			console.log(error);
		}
	}
</script>

<h3>Post Tweet</h3>
<textarea type="text" bind:value={tweet} />
<button on:click={handleClick}>Post tweet</button>

<style lang="scss">
  h3 {
    padding-bottom: 0;
  }
</style>