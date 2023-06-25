<script lang="ts">
	// IMPORTED LIB-UTILS
	import { onDestroy } from 'svelte';
	import { createPopper } from '@popperjs/core';

	// PROPS
	export let parentEl: HTMLElement, isOpen: boolean, setIsOpen: (isOpen: boolean) => void;

	// REFS
	let childEl: HTMLDivElement;

	// REACTIVE STATES
	$: items = [
		{
			type: 'link',
			label: 'Profile',
			icon: 'ti-user-circle',
			href: '/app/account',
		},
		{
			type: 'button',
			label: 'Logout',
			icon: 'ti-key-off',
			handleClick: () => {},
		},
	];
	let popperInstance: ReturnType<typeof createPopper>;

	// REACTIVE STATEMENTS
	$: (() => {
		if (!parentEl || !childEl) return;
		if (popperInstance) popperInstance.destroy();
		popperInstance = createPopper(parentEl, childEl, { placement: 'top-start' });
	})();

	// LIFECYCLES
	onDestroy(() => {
		if (popperInstance) popperInstance.destroy();
	});
</script>

{#if isOpen}
	<button class="fixed top-0 left-0 w-full h-full z-30" on:click={() => setIsOpen(false)} />
	<div class="py-0 w-full max-w-[300px] z-30" bind:this={childEl}>
		<div class="bg-white p-2 rounded-sm shadow-md">
			<div class="bg-gray-200 shadow-sm rounded-sm flex flex-col overflow-hidden">
				{#each items as item}
					{#if item.type == 'button'}
						<button
							class="hover:bg-gray-300 border-gray-100 px-3 py-2 flex-grow text-left border-b flex-start-center last:border-none"
							on:click={item.handleClick}
						>
							<p
								class="flex-grow text-sm text-ellipsis overflow-hidden whitespace-nowrap"
							>
								{item.label}
							</p>
							{#if item.icon}
								<i class={`ti ${item.icon}`} />
							{/if}
						</button>
					{:else if item.type == 'link'}
						<a
							class="hover:bg-gray-300 border-gray-100 px-3 py-2 flex-grow text-left border-b flex-start-center"
							href={item.href}
						>
							<p
								class="flex-grow text-sm text-ellipsis overflow-hidden whitespace-nowrap"
							>
								{item.label}
							</p>
							{#if item.icon}
								<i class={`ti ${item.icon}`} />
							{/if}
						</a>
					{/if}
				{/each}
			</div>
		</div>
	</div>
{/if}
