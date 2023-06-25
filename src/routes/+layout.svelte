<script lang="ts">
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import NProgress from 'nprogress';
	// IMPORTED UTILS
	import { initializeStores } from '$stores/index';
	// IMPORTED STATES
	import { windowWidth } from '$stores/mediaStates';

	// REACTIVE STATEMENTS
	$: {
		// NPROGRESS
		if ($navigating) NProgress.start();
		else NProgress.done();
	}

	// UTILS
	const handleResize = () => windowWidth.set(window.innerWidth);

	// LIFECYCLES
	onMount(() => {
		initializeStores();
		// REMOVE LOADER
		const loaderEl = document.querySelector('#loader');
		if (loaderEl) loaderEl.remove();
	});
</script>

<svelte:window on:resize={handleResize} />

<div class="container mx-auto min-h-screen">
	<slot />
</div>
