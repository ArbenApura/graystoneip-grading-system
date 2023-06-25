<script lang="ts">
	// IMPORTED TYPES
	import type { Item } from '.';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED UTILS
	import { isMD } from '$stores/mediaStates';
	// IMPORTED COMPONENTS
	import Tooltip from '$components/modules/Tooltip.svelte';

	// PROPS
	export let item: Item, handleClick: () => void;

	// REFS
	let parentEl: HTMLDivElement;

	// MENU STATES
	let isTooltipOpen = false;
	const setIsTooltipOpen = (isOpen: boolean) => (isTooltipOpen = isOpen);
</script>

<!-- {#if $isMD} -->
<Tooltip
	{...{
		parentEl,
		label: item.label,
		isOpen: isTooltipOpen,
		setIsOpen: setIsTooltipOpen,
		placement: 'right',
	}}
/>
<!-- {/if} -->

{#if item.contents.length}
	<div class="min-w-[300px] flex flex-col">
		<button
			class="flex items-center gap-4 cursor-pointer {item.isOpen
				? 'bg-slate-100'
				: 'hover:bg-slate-100'}"
			on:click={() => (item.isOpen = !item.isOpen)}
		>
			<div class="w-[60px] h-[60px] flex-center">
				<i class="{item.icon} text-xl" />
			</div>
			<p class="flex-grow">{item.label}</p>
			<div class="w-[60px] h-[60px] flex-center">
				<i class="ti ti-chevron-{item.isOpen ? 'up' : 'down'} text-xl" />
			</div>
		</button>
		{#if item.isOpen}
			{#each item.contents as content}
				<a
					class="min-w-[300px] flex items-center gap-4 cursor-pointer {$page.route.id?.match(
						content.location,
					)
						? 'bg-blue-600 text-white'
						: 'bg-gray-200 hover:bg-gray-300'}"
					href={content.location}
					on:click={handleClick}
				>
					<div class="w-[60px] h-[60px] flex-center">
						<i class="{content.icon} text-xl" />
					</div>
					<p>{content.label}</p>
				</a>
			{/each}
		{/if}
	</div>
{:else}
	<a
		class="min-w-[300px] flex items-center gap-4 cursor-pointer {$page.route.id?.match(
			item.location,
		)
			? 'bg-blue-600 text-white'
			: 'hover:bg-gray-100'}"
		href={item.location}
		on:click={handleClick}
		on:mouseenter={() => setIsTooltipOpen(true)}
		on:mouseleave={() => setIsTooltipOpen(false)}
	>
		<div bind:this={parentEl} class="w-[60px] h-[60px] flex-center">
			<i class="{item.icon} text-xl" />
		</div>
		<p>{item.label}</p>
	</a>
{/if}
