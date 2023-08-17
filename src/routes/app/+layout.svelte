<script lang="ts">
	// IMPORTED ASSETS
	import ErrorPNG from '$assets/storysets/Feeling angry-cuate.png';
	// IMPORTED LIB-COMPONENTS
	import { Alert } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Topbar from '$components/layouts/Topbar.svelte';
	import Sidebar from '$components/layouts/Sidebar';
	import Footer from '$components/layouts/Footer.svelte';
	// IMPORTED STATES
	import { isOpen } from '$stores/sidebarStates';
	import { isSMUp } from '$stores/mediaStates';
	import { isLogined } from '$stores/authStates';
</script>

<div
	class="layout pt-[60px]"
	data-is-minimized={!$isOpen && $isSMUp}
	data-is-maximized={$isOpen && $isSMUp}
>
	<Topbar />
	<Sidebar />
	<div class="w-full">
		{#if $isLogined}
			<slot />
		{:else}
			<div class="p-4">
				<div
					class="p-8 bg-white shadow-md rounded-md flex flex-col justify-center items-center gap-4"
				>
					<img class="max-w-[300px]" src={ErrorPNG} alt="" />
					<Alert color="red">Please login to see this page!</Alert>
				</div>
			</div>
		{/if}
		<div class="p-4 pt-0"><Footer /></div>
	</div>
</div>

<style lang="scss">
	.layout {
		&[data-is-minimized='true'] {
			padding-left: 60px;
		}
		&[data-is-maximized='true'] {
			padding-left: 300px;
		}
	}
</style>
