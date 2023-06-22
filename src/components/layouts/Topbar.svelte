<script lang="ts">
	// IMPORTED ASSETS
	import LogoPNG from '$assets/images/logo.png';
	// IMPORTED COMPONENTS
	import { Button } from 'flowbite-svelte';
	// IMPORTED UTILS
	import { toggleSidebar } from '$stores/sidebarStates';
	// IMPORTED STATES
	import { isSMUp } from '$stores/mediaStates';
	import { isOpen } from '$stores/sidebarStates';
</script>

<div class="bg-white shadow-md fixed top-0 left-0 w-full h-[60px] flex items-center z-30">
	<div class="box-center">
		<Button pill={true} outline={true} class="!p-2" size="xl" on:click={toggleSidebar}>
			<i class={`ti ti-${$isOpen ? 'x' : 'menu-2'}`} />
		</Button>
	</div>
	<a class="h-[60px] flex items-center gap-2 flex-grow" href="/">
		<img class=" rounded-full shadow-md w-[36px] h-[36px]" src={LogoPNG} alt="" />
		<p class="text-xs sm:text-sm">Graystone Institute of the Philippines</p>
	</a>
	{#if $isSMUp}
		<div class="h-[60px] p-4 flex items-center">
			<Button outline size="xs">Logout</Button>
		</div>
	{/if}
</div>

<style lang="scss">
	.box-center {
		@apply w-[60px] h-[60px] flex items-center justify-center;
	}
</style>
