<script lang="ts">
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED STATES
	import { isOpen } from '$stores/sidebarStates';
	import { isSMUp, isSMDown } from '$stores/mediaStates';

	// STATES
	const items = [
		{ label: 'Accounts', icon: 'ti-users', location: '/app/accounts' },
		{ label: 'Criterias', icon: 'ti-table-alias', location: '/app/criterias' }
	];

	// REACTIVE STATES
	$: width = (() => {
		if ($isSMUp) {
			return $isOpen ? 300 : 60;
		} else {
			return $isOpen ? 300 : 0;
		}
	})();

	// UTILS
	const handleClick = () => $isSMDown && isOpen.set(false);
</script>

{#if !(!$isOpen && $isSMDown)}
	<div
		class={`fixed top-[60px] left-0 bg-white shadow-md max-w-[${width}px] w-full h-full overflow-hidden z-20`}
	>
		{#each items as item}
			<a
				class={`min-w-[300px] flex items-center gap-4 cursor-pointer ${
					$page.route.id?.match(item.location) ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'
				}`}
				href={item.location}
				on:click={handleClick}
			>
				<div class="w-[60px] h-[60px] flex-center">
					<i class={`ti ${item.icon} text-xl`} />
				</div>
				<p>{item.label}</p>
			</a>
		{/each}
	</div>
{/if}
