<script lang="ts">
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	import { navigating } from '$app/stores';
	import { beforeNavigate } from '$app/navigation';
	import NProgress from 'nprogress';
	// IMPORTED UTILS
	import { initializeStores, isInitialized } from '$stores/index';
	import { account, isLogined } from '$stores/authStates';
	import { updateMedia, windowWidth } from '$stores/mediaStates';
	// IMPORTED COMPONENTS
	import ModalContainer from '$components/layouts/ModalContainer.svelte';

	// REACTIVE STATEMENTS
	$: {
		// NPROGRESS
		if ($navigating) NProgress.start();
		else NProgress.done();
		updateMedia();
	}

	// UTILS
	const handleResize = () => windowWidth.set(window.innerWidth);

	// LIFECYCLES
	onMount(async () => {
		await initializeStores();
		setTimeout(() => {
			updateMedia();
			const loaderEl = document.querySelector('#loader');
			if (loaderEl) loaderEl.remove();
		}, 1000);
	});
	beforeNavigate(({ cancel, to }) => {
		if (!to || !to.route || !to.route.id) return;
		const routeId = to.route.id;
		const conditions: boolean[] = [
			$isLogined && routeId === '/',
			!$isLogined && !!routeId.match('/app/'),
			$account.account_type !== 'admin' &&
				!!to.route.id.match(/\/app\/(curriculum|master-list|admin-controls)\//g),
		];
		if (conditions.some((v) => v)) cancel();
	});
</script>

<svelte:window on:resize={handleResize} />

<div class="container mx-auto min-h-screen min-w-[300px] overflow-auto">
	{#if $isInitialized}
		<slot />
	{/if}
</div>

<ModalContainer />
