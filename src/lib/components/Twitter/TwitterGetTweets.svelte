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
			console.error(error);
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
			console.error(error);
		}
	};
</script>

<h3>Get Tweets</h3>
{#each tweets as {text, id, public_metrics}, i}
	<div class="tweet">
		<button on:click={() => deleteTweet(id, i)}>&times;</button>
		<div>
			<span>twitter tweet: {text}</span>
		</div>
		<div>
			<span>retweets: {public_metrics.retweet_count}</span>
			<span>likes: {public_metrics.like_count}</span>
			<span>replies: {public_metrics.reply_count}</span>
		</div>
		<div>
			<small>{id}</small>
		</div>
	</div>
{/each}
<button on:click={getTweets} disabled={disabled}>refresh</button>

<style lang="scss">
  h3 {
    padding-bottom: 0;
  }

	.tweet {
		border: 2px solid paleturquoise;
		padding: 16px;
	}

	button {
		&[disabled] {
			opacity: .5;
		}
	}
</style>