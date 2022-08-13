<script lang="ts">
	import Section from "$lib/components/layout/Section.svelte";

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
			}

			// Update with data
			console.log(data);
			alert('success');
		}
		catch (error) {
			console.log(error);
		}
	}
	export let twtUser:string;
</script>

<Section>
	<h1>Hello world!</h1>
  {#if twtUser}
    <h2>Welcome {twtUser}</h2>
    <a href='logout/twitter'>logout tweeter</a>
		<input type="text"  bind:value={tweet}>
		<button on:click={handleClick}>Click me</button>
  {:else}
		<h2>You are not logged in</h2>
    <a href='login/twitter' rel="external">authorize tweeter</a>
  {/if}
</Section>
