<script lang="ts">
	import { onMount } from "svelte";
	import { twitterUser } from '$lib/stores/twitterSessionStore'
	import Refresh from "$lib/components/icons/Refresh.svelte";
  import Heart from "$lib/components/icons/Heart.svelte";
	import Retweet from "$lib/components/icons/Retweet.svelte";
	import ArrowOutBox from "$lib/components/icons/ArrowOutBox.svelte";
	import Chat from "$lib/components/icons/Chat.svelte";
	import { timeSince } from '$lib/_includes/generalHelpers'
	import Block from "$lib/components/Grid/Block.svelte";
	import AuthorizeTwitter from '$lib/components/Twitter/AuthorizeTwitter.svelte'

	//TODO: Update type
  let tweets:any = [];
	let disabled = false;
	let medias:any[] = [];
	let polls:any[] = []

  onMount(async () => {
		if (Object.keys($twitterUser).length < 1) { return; }
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
			medias = data?.includes?.media;
			polls = data?.includes?.polls;
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

	const formatText = (text:string, entities:any) => {
		let formatText = text;
		formatText = formatText.replace(/https?:\/\/t.co\/[a-zA-Z0-9\-\.]*/, '');

		if (!entities) {
			return formatText;
		} 

		if (entities.mentions) {
			entities?.mentions.forEach((mention:any) => {
				formatText = formatText.replaceAll(`@${mention.username}`, `<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/${mention.username}">@${mention.username}</a>`)
			})
		}

		if (entities.hashtags) {
			entities?.hashtags.forEach((hash:any) => {
				formatText = formatText.replaceAll(`#${hash.tag}`, `<a target="_blank" rel="noopener noreferrer" href="https://twitter.com/hashtag/${hash.tag}">#${hash.tag}</a>`)
			});
		}

		if (entities.urls) {
			entities?.urls.forEach((url:any) => {
				formatText += url?.unwound_url ? `<a target="_blank" rel="noopener noreferrer" href="${url?.unwound_url}">${url?.unwound_url}</a>` : ''
			});
		}

		return formatText
	};

	const getMedia = (mediaKey:string, entities:any) => {
		const index = medias.map((media) => { return media.media_key; }).indexOf(mediaKey);
		const media = medias[index];

		if (media.type === 'photo') {
			return `<img data-type="photo" src="${media.url}" alt="" loading="lazy"/>`
		}

		return `<a target="_blank" data-hover="View ${media.type === 'video' ? 'video' : 'GIF'} on Twitter" rel="noopener noreferrer" href="${entities.urls?.[0]?.expanded_url}">
			<img data-type="${media.type}" src="${media.preview_image_url}" alt="" loading="lazy"/>
		</a>`;
	};

	const getPolls = (pollId:string) => {
		const index = polls.map((poll) => { return poll.id; }).indexOf(pollId);
		const poll = polls[index];	

		return poll
	}
</script>


<Block on:dragtoggle type="twitter">
	<div class="recent-tweets__container">
		{#if Object.keys($twitterUser).length > 0}
			<div class="header">
				<h2>Recent tweets</h2>
				<button class="recent-tweets__refresh" on:click={getTweets} disabled={disabled}>
					<Refresh width="16px" height="16px"/>
				</button>
			</div>
			<ul class="recent-tweets">
				{#each tweets as {text, id, public_metrics, created_at, attachments, entities, referenced_tweets}, i}
					<li class="tweet">
						<button class="delete" on:click={() => deleteTweet(id, i)}>&times;</button>
						<div class="tweet-header">
							<span class="name">{$twitterUser?.name}</span>
							<span class="user">@{$twitterUser?.username}</span>
							<span class="time">&middot; {convertTime(created_at)}</span>
						</div>
						<div class="text">
							{@html formatText(text, entities)}
							{#if referenced_tweets?.[0].type === 'quoted'}
								&mdash; <a target="_blank" rel="noopener noreferrer" href={`https://twitter.com/${$twitterUser?.username}/status/${id}`}>View Quote Retweet</a>
							{/if}
						</div>
						{#if attachments?.media_keys}
							<div class="img-grid">
								{#each attachments?.media_keys as mediaKey, i}
									<div class="img-wrapper">
										<!-- TODO: Refactor this to not use function if possible -->
										{@html getMedia(mediaKey, entities)}
									</div>
								{/each}
							</div>
						{:else if attachments?.poll_ids}
							<div class="poll-wrapper">
								<!-- TODO: Refactor this to not use function if possible -->
								{#each getPolls(attachments?.poll_ids[0]).options as {label, votes}, i}
									<div>{label}</div> 
									<div>{votes} votes</div>
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
		{:else}
			<AuthorizeTwitter />
		{/if}
	</div>
</Block>

<style lang="scss">
	@import '../../../styles/vars.scss';
  h2 {
    padding-bottom: 0;
		color: #fff;
  }

	div {
		font-size: 14px;
	}

	a {
		display: inline-block;
		text-decoration: none;
		color: $twitter-blue;
		font-size: 14px;
		&:hover,
		&:focus {
			text-decoration: none;
			color: lighten($twitter-blue, 10%);
			box-shadow: none;
		}
	}

	.recent-tweets__container {
		background-color: #243447;
		padding: 16px;
		max-height: 172px;
		overflow: auto;
	}

	.header {
		display: flex;
		align-items: center;
		padding: 0;
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
		&:focus {
			text-decoration: none;
			opacity: .5;
			box-shadow: none;
		}
	}

	.tweet {
		position: relative;
		color: #fff;
		border-bottom: 1px solid #ccc;

		&:last-child {
			border-bottom: 0;
		}
	}

	.tweet-header {
		padding-top: 16px;
		padding-bottom: 4px;
		color: #fff;
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

		:global {
			a {
				display: inline-block;
				text-decoration: none;
				color: $twitter-blue;
				font-size: 14px;
				&:hover,
				&:focus {
					text-decoration: none;
					color: lighten($twitter-blue, 10%);
					box-shadow: none;
				}
			}
		}
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

		&:global {
			img {
				width: 100%;
				border-radius: 4px;
				height: 100%;
				object-fit: cover;
			}

			a {
				text-decoration: none;
				cursor: pointer;
				position: relative;
				width: 100%;
				height: 100%;
				display: block;
				border-radius: 4px;
				max-height: 208px;


				&:after {
					border-radius: 4px;
					transition: $transition;
					opacity: 0;
					visibility: hidden;
					content: attr(data-hover);
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
		}

	}

	.poll-wrapper {
		display: grid;
		grid-template-columns: min-content auto;
		border: 1px solid #fff;
		padding-bottom: 0;
		border-radius: 4px;
		margin-bottom: 12px;
		div {
			border: 1px solid #fff;
  		grid-gap: 1px;
			padding: 4px 8px;
		}
	}

	.metrics {
		color: #fff;
		padding-bottom: 8px;
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