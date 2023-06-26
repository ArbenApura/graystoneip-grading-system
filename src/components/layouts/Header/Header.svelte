<script lang="ts">
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	// PROPS
	export let breadcrumbItems: BreadcrumbItem[];

	// STATES
	let dateTime: string;

	// UTILS
	const synchronizeDateTime = () => {
		const date = new Date();
		const hour = date.getHours();
		const minute = date.getMinutes();
		const period = hour >= 12 ? 'PM' : 'AM';
		const hour12 = hour % 12 === 0 ? 12 : hour % 12;
		const time = `${hour12}:${minute.toString().padStart(2, '0')}${period}`;
		const day = date.getDate();
		const month = date.toLocaleString('en-US', { month: 'long' });
		const year = date.getFullYear();
		const formattedDate = `${time} | ${day}, ${month} ${year}`;
		dateTime = formattedDate;
	};

	// LIFECYCLE
	onMount(() => {
		synchronizeDateTime();
		const ONE_MINUTE = 1000 * 60;
		let interval = setInterval(synchronizeDateTime, ONE_MINUTE);
		return () => clearInterval(interval);
	});
</script>

<div class="p-4">
	<div class="header flex items-center justify-between gap-4 overflow-x-auto">
		<div>
			{#if breadcrumbItems.length === 1}
				{@const item = breadcrumbItems[0]}
				<div class="flex items-center gap-2 text-lg">
					<i class={item.icon} />
					<p>{item.label}</p>
				</div>
			{:else}
				<div class="flex items-center gap-2">
					{#each breadcrumbItems as item, i}
						<a
							class="flex items-center gap-2 {i === 0
								? 'text-lg'
								: 'text-xs'} {item.href === $page.route.id && 'text-blue-600'}"
							href={item.href}
						>
							{#if i === 0}
								<i class={item.icon} />
							{/if}
							<p>{item.label}</p>
						</a>
						{#if i + 1 !== breadcrumbItems.length}
							<i class="ti ti-chevron-right text-xs text-gray-400" />
						{/if}
					{/each}
				</div>
			{/if}
		</div>
		<p class="text-xs">{dateTime}</p>
	</div>
</div>

<style lang="scss">
	* {
		@apply whitespace-nowrap;
	}
	.header {
		&::-webkit-scrollbar-thumb {
			background-color: theme('colors.gray.300');
		}
		&::-webkit-scrollbar-thumb:hover {
			background-color: theme('colors.gray.400');
		}
	}
</style>
