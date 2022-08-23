<script lang="ts">
	import { onMount } from "svelte";
	import { twitterUser } from '$lib/stores/twitterSessionStore'

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

			console.log(data);

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

<div class="recent-tweets__container">
	<header>
		<h2>Recent tweets</h2>
		<button on:click={getTweets} disabled={disabled}>refresh</button>
	</header>
	<ul class="recent-tweets">
		{#each tweets as {text, id, public_metrics, created_at}, i}
			<li class="recent-tweets__tweet">
				<button class="tweet-delete" on:click={() => deleteTweet(id, i)}>&times;</button>
				<a class="recent-tweets__link" href={`https://twitter.com/${$twitterUser?.username}/status/${id}`}>
					<div class="recent-tweets__tweet-header">
						<span class="recent-tweets__tweet-name">{$twitterUser?.name}</span>
						<span class="recent-tweets__tweet-user">@{$twitterUser?.username}</span>
						<span class="recent-tweets__tweet-time">{created_at}</span>
					</div>
					<div class="recent-tweets__text">{text}</div>
					<div class="recent-tweets__metrics">
						<span>retweets: {public_metrics.retweet_count}</span>
						<span>likes: {public_metrics.like_count}</span>
						<span>replies: {public_metrics.reply_count}</span>
					</div>
					<div>
					</div>
				</a>

			</li>
		{/each}
		</ul>

</div>

<style lang="scss">
	@import '../../../styles/vars.scss';
  h2 {
    padding-bottom: 0;
		color: #fff;
  }

	.recent-tweets__container {
		background-color: $off-black;
		padding: 16px 0px;
	}

	.recent-tweets {
		padding-left: 0;
		list-style: none;
	}

	.recent-tweets__link {
		padding: 16px 24px 8px;
		display: block;
		text-decoration: none;

		&:hover,
		&:active,
		&:focus {
			text-decoration: none;
			background-color: lighten($off-black, 10%);
			box-shadow: none;
		}
	}

	.recent-tweets__tweet {
		position: relative;
		color: #fff;
		min-width: 320px;

		&-header {
			padding-top: 16px;
			padding-bottom: 4px;
			color: #fff;
		}

		&-name {
			font-weight: 600;
		}

		&-user {
			color: $off-white;
			opacity: .75;
		}

		&-time {
			color: $off-white;
			opacity: .75;
		}
	}

	.recent-tweets__text {
		padding-bottom: 16px;
		color: #fff;
	}

	.recent-tweets__metrics {
		color: #fff;
		padding-bottom: 8px;
		border-bottom: 1px solid #ccc;
	}

	.tweet-delete {
		position: absolute;
		top: 0;
		right: 0;
		border: 0;
		background-color: transparent;
		color: #fff;
		cursor: pointer;
	}

	button {
		&[disabled] {
			opacity: .5;
		}
	}
</style>