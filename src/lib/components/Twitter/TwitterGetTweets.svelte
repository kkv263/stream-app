<script lang="ts">
import { onMount } from "svelte";
	//TODO: Update type
  let tweets:any = [];
	let disabled = false;

  onMount(async () => {
		getTweets();
	});

	const getTweets = async() => {
		try {
			const data = await fetch('/api/v1/twitter/gettweets', {
				method: 'GET'
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
      tweets = data.data;
			disabled = true;
			setTimeout(() => {
				disabled = false;
			},1000);

		}
		catch (error) {
			console.log(error);
		}
	}

	const deleteTweet = async(id:string, index:number) => {
		try {
			const data = await fetch('/api/v1/twitter/deletetweet', {
				method: 'POST',
				body: JSON.stringify({ id: id })
			}).then(res => res.json());

			if (data.errors) {
				console.log(data.errors);
				return;
			}

			if (data.status === 403) {
				// Create a modal for error
        alert('twitter error')
        return;
			}

			// Successful delete
			if (data.data.deleted) {
				tweets.splice(index, 1);
    		tweets = tweets;
			}
		}
		catch (error) {
			console.log(error);
		}
	};
</script>

<h3>Get Tweets</h3>
{#each tweets as {text, id}, i}
	<div>
		<span>twitter tweet: {text}</span>
		<small>{id}</small>
		<button on:click={() => deleteTweet(id, i)}>&times;</button>
	</div>
{/each}
<button on:click={getTweets} disabled={disabled}>refresh</button>

<style lang="scss">
  h3 {
    padding-bottom: 0;
  }

	div {
		border: 2px solid paleturquoise;
		padding: 16px;
	}

	button {
		&[disabled] {
			opacity: .5;
		}
	}
</style>