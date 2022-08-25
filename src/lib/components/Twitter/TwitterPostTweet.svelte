<script lang="ts">
	import { onMount } from 'svelte';
	import { createPicker } from 'picmo';
	import { clickOutside } from '$lib/_includes/generalHelpers';
	import Smile from "$lib/components/icons/Smile.svelte";
	import TwitterHeader from "$lib/components/Twitter/TwitterHeader.svelte";
	import Button from "$lib/components/_global/Button.svelte";

	let tweet:string = '';
  let rootElement:any;
	let emojihidden:boolean = true

	onMount(() => {
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

<section class="post-tweets__container">
	<TwitterHeader />
	<div>
		<textarea type="text" bind:value={tweet} placeholder="What's happening?"/>
		<div class="buttons">
			<button class="emoji-btn" on:click={pickEmoji}><Smile width="20px" height="20px"/></button>
			<div use:clickOutside={clickOutsideEmoji} bind:this={rootElement} class="emoji" hidden={emojihidden}></div>
		</div>
		<Button type="button" color="primary" full on:click={handleClick}>Tweet</Button>
	</div>

</section>


<style lang="scss">
		@import '../../../styles/vars.scss';
	.post-tweets__container {
		background-color: #243447;
		// Temporary
		max-width: 375px;
		padding: 16px 16px 32px;

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
		height: 120px;
		min-width: 375px;
		width: 100%;
		background-color: transparent;
		color: #fff;
		resize: none;
		border: 0;
		border-bottom: 1px solid rgba(#fff, .5);

		&::placeholder {
			color: #fff;
			opacity: .75;
		}
	}
</style>