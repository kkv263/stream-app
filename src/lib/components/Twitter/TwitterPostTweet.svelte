<script lang="ts">
	import { onMount } from 'svelte';
	import { createPicker } from 'picmo';
	import { clickOutside } from '$lib/_includes/generalHelpers';
	import { twitterUser } from '$lib/stores/twitterSessionStore'
	import Smile from "$lib/components/icons/Smile.svelte";
	import Button from "$lib/components/_global/Button.svelte";
	import Block from "$lib/components/Grid/Block.svelte";
	import AuthorizeTwitter from '$lib/components/Twitter/AuthorizeTwitter.svelte'

	let tweet:string = '';
  let rootElement:any;
	let emojihidden:boolean = true

	onMount(() => {
		if (Object.keys($twitterUser).length < 1) { return; }

		const emojiPicker = createPicker({ 
			autoFocus: 'auto',
			rootElement,
			visibleRows: 5,
			className: 'emoji-element',
			emojiSize: '1.5em'
		});
		emojiPicker.addEventListener('emoji:select', selection => {
			tweet += selection.emoji;
			emojihidden = true;
		});
	});

	// TODO: Dispatch event with to add to get tweets
	const handleClick = async() => {
		try {
			// TODO Doesn't return text and id -- do we really need it though?
			const data = await fetch('/api/v1/twitter/tweet', {
				method: 'POST',
				body: JSON.stringify({
					text: tweet
				})
			})

			// Add modal to confirm;
			alert('success');
		}
		catch (error) {
			console.error(error);
		}
	}

	const pickEmoji = () => emojihidden = false;
	const clickOutsideEmoji = () => emojihidden = true;
</script>

<Block type="twitter" on:dragtoggle>
	<div class="post-tweets__container">
		{#if Object.keys($twitterUser).length > 0}
			<textarea type="text" bind:value={tweet} placeholder="Post a tweet!"/>
			<div class="buttons">
				<button class="emoji-btn" on:click={pickEmoji}><Smile width="20px" height="20px"/></button>
				<div use:clickOutside={clickOutsideEmoji} bind:this={rootElement} class="emoji" hidden={emojihidden}></div>
			</div>
			<div class="btn-wrapper">
				<Button type="button" color="primary" full on:click={handleClick}>Tweet</Button>
			</div>
		{:else}
			<AuthorizeTwitter />
		{/if}
	</div>
</Block>


<style lang="scss">
		@import '../../../styles/vars.scss';
	.post-tweets__container {
		background-color: #243447;
		padding: 16px;
		flex: 1 0 auto;
		display: flex;
		flex-direction: column;

		:global {
			.emoji-element {
				max-width: 100%;
				.categoryButtons .categoryTab  {
					button.categoryButton {
						width: 1.25em;
					}
					svg {
						width: 1.25em;
					}
				}
			}
		}
	}

	.buttons {
		position: relative;
		padding-top: 4px;
		padding-bottom: 16px;
	}

	.emoji {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 1;
	}

	.emoji-btn {
		background: transparent;
		color: #fff;
		border: 0;
		cursor: pointer;
		transition: $transition;
		padding: 0;

		&:hover,
		&:focus {
			opacity: .75;
		}
	}

	textarea {
		width: 100%;
		background-color: transparent;
		color: #fff;
		resize: none;
		border: 0;
		border-bottom: 1px solid rgba(#fff, .5);
		flex: 1 0 auto;

		&::placeholder {
			color: #fff;
			opacity: .75;
		}
	}
</style>