<script lang="ts">
	import { onMount } from "svelte";
	import { twitterUser } from '$lib/stores/twitterSessionStore'
	import Refresh from "$lib/components/icons/Refresh.svelte";
  import Heart from "$lib/components/icons/Heart.svelte";
	import Retweet from "$lib/components/icons/Retweet.svelte";
	import ArrowOutBox from "$lib/components/icons/ArrowOutBox.svelte";
	import Chat from "$lib/components/icons/Chat.svelte";
	import { timeSince } from '$lib/_includes/generalHelpers'

	//TODO: Update type
  let tweets:any = [];
	let disabled = false;
	let medias:any[] = [];

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
			medias = data?.includes?.media;
			console.log(medias);
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

	const convertTime = (time:string) => {
		const oneday = 60 * 60 * 24 * 1000;
		const formattedTime = new Date(time);
		const dayago = Date.now() - oneday;

		if (dayago < (formattedTime.getTime())) {
			return timeSince(formattedTime.getTime()) + ' ago'
		}
		
		return formattedTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
	};

	const getMedia = (mediaKey:string) => {
		const index = medias.map((media) => { return media.media_key; }).indexOf(mediaKey);

		return medias[index];
	}
</script>

<!-- TODO: Look into entities. -->

<div class="recent-tweets__container">
	<header>
		<h2>Recent tweets</h2>
		<button class="recent-tweets__refresh" on:click={getTweets} disabled={disabled}>
			<Refresh width="16px" height="16px"/>
		</button>
	</header>
	<ul class="recent-tweets">
		{#each tweets as {text, id, public_metrics, created_at, attachments}, i}
			<li class="tweet">
				<button class="delete" on:click={() => deleteTweet(id, i)}>&times;</button>
				
				<div class="tweet-header">
					<span class="name">{$twitterUser?.name}</span>
					<span class="user">@{$twitterUser?.username}</span>
					<span class="time">&middot; {convertTime(created_at)}</span>
				</div>
				<div class="text">{text}</div>
				{#if attachments}
					<div class="img-grid">
						{#each attachments?.media_keys as mediaKey, i}
							<div class="img-wrapper">
								<img src={getMedia(mediaKey)?.url} alt="" loading="lazy">
							</div>
						{/each}
					</div>
				{/if}
				<div class="metrics">
					<div class="icon-wrapper">
						<Retweet width="16px" height="16px"/> 
						<span>{public_metrics.retweet_count}</span>
					</div>
					<div class="icon-wrapper">
						<Heart width="16px" height="16px"/> 
						<span>{public_metrics.like_count}</span>
					</div>
					<div class="icon-wrapper">
						<Chat width="16px" height="16px"/> 
						<span>{public_metrics.reply_count}</span>
					</div>
					<div class="icon-wrapper">
						<a class="link" target="_blank" rel="noopener noreferrer" href={`https://twitter.com/${$twitterUser?.username}/status/${id}`}>
							<ArrowOutBox width="16px" height="16px"/> 
						</a>
					</div>
				</div>

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
		background-color: #243447;
		padding: 16px;
		overflow: auto;
		// Temporary
		max-width: 420px;
		max-height: 420px;
	}

	header {
		display: flex;
		align-items: center;
	}

	@keyframes spin-animation {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(-359deg);
		}
	}

	.recent-tweets__refresh {
		color: #fff;
		background-color: transparent;
		border: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 8px;
		cursor: pointer;
		transition: $transition;

		&:active,
		&:hover,
		&:focus {
			opacity: .5;
		}

		&[disabled] {
			animation: spin-animation 1s infinite linear;
			opacity: .5;
		}
	}

	.recent-tweets {
		padding-left: 0;
		margin: 0;
		list-style: none;
	}

	.link {
		display: block;
		text-decoration: none;
		color: #fff;

		&:hover,
		&:active,
		&:focus {
			text-decoration: none;
			opacity: .5;
			box-shadow: none;
		}
	}

	.tweet {
		position: relative;
		color: #fff;
		min-width: 320px;
		border-bottom: 1px solid #ccc;

		&:last-child {
			border-bottom: 0;
		}
	}

	.tweet-header {
		padding-top: 16px;
		padding-bottom: 4px;
		color: #fff;
		font-size: 14px;
	}

	.name {
		font-weight: 600;
	}

	.user {
		color: $off-white;
		opacity: .75;
	}

	.time {
		color: $off-white;
		opacity: .75;
	}

	.text {
		padding-bottom: 16px;
		color: #fff;
		font-size: 14px;
	}

	.img-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 4px;
		padding-bottom: 16px;

		.img-wrapper:last-child:nth-last-child(odd) {
			grid-column: auto / span 2;
		}

		.img-wrapper:first-child:nth-last-child(even),
		.img-wrapper:first-child:nth-last-child(even) ~ .img-wrapper {
			grid-column: auto / span 1;
		}

		.img-wrapper:only-child {
			max-height: 416px;
		}

		.img-wrapper:not(:only-child) {
			max-height: 208px;
		}
	}

	.img-wrapper {
		width: 100%;
		img {
			width: 100%;
			border-radius: 4px;
			height: 100%;
			object-fit: cover;
		}
	}

	.metrics {
		color: #fff;
		padding-bottom: 8px;
		font-size: 14px;
		display: flex;
		justify-content: space-between;
	}

	.icon-wrapper {
		display: flex;
		align-items: center;

		span {
			padding-left: 8px;
		}
	}

	.delete {
		position: absolute;
		top: 0;
		right: 0;
		border: 0;
		background-color: transparent;
		color: #fff;
		cursor: pointer;
	}
</style>