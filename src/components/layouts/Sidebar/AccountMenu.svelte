<script lang="ts">
	// IMPORTED LIB-UTILS
	import { onDestroy } from 'svelte';
	import { createPopper } from '@popperjs/core';

	// PROPS
	export let parentEl: HTMLElement,
		isOpen: boolean,
		setIsOpen: (isOpen: boolean) => void,
		handleClick: () => void;

	// REFS
	let childEl: HTMLDivElement;

	// STATES
	let popperInstance: ReturnType<typeof createPopper>;

	// REACTIVE STATEMENTS
	$: (() => {
		if (!parentEl || !childEl) return;
		if (popperInstance) popperInstance.destroy();
		popperInstance = createPopper(parentEl, childEl, { placement: 'top-start' });
	})();

	// UTILS
	const handleMenuClick = () => {
		handleClick();
		setIsOpen(false);
	};

	// LIFECYCLES
	onDestroy(() => {
		if (popperInstance) popperInstance.destroy();
	});
</script>

{#if isOpen}
	<button class="fixed top-0 left-0 w-full h-full z-40" on:click={() => setIsOpen(false)} />
	<div
		class="bg-white rounded-md shadow-md py-0 w-full max-w-[300px] z-40 overflow-hidden"
		bind:this={childEl}
	>
		<a
			class="w-full flex items-center gap-4 cursor-pointer hover:bg-gray-100"
			href="/app/account"
			on:click={handleMenuClick}
		>
			<div class="w-[60px] h-[60px] flex-center">
				<i class="ph-bold ph-user text-xl" />
			</div>
			<p>Manage Account</p>
		</a>
		<a
			class="w-full flex items-center gap-4 cursor-pointer hover:bg-gray-100"
			href="/"
			on:click={handleMenuClick}
		>
			<div class="w-[60px] h-[60px] flex-center">
				<i class="ti ti-logout text-xl" />
			</div>
			<p>Logout</p>
		</a>
	</div>
{/if}
