<script lang="ts">
	import Section from "$lib/components/layout/Section.svelte";

	// TODO: Handle 403 Error: no duplicate messages.
	const  handleClick = async() => {
		try {
			const data = await fetch('/api/v1/twitter/tweet', {
				method: 'POST',
				body: JSON.stringify({
					text: 'testing'
				})
			}).then(res => res.json());
			console.log(data);
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
		<input type="text">
		<button on:click={handleClick}>Click me</button>
  {:else}
		<h2>You are not logged in</h2>
    <a href='login/twitter' rel="external">authorize tweeter</a>
  {/if}
</Section>
