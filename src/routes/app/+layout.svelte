<script lang="ts">
	// IMPORTED COMPONENTS
	import Topbar from '$components/layouts/Topbar.svelte';
	import Sidebar from '$components/layouts/Sidebar';
	import Footer from '$components/layouts/Footer.svelte';
	// IMPORTED STATES
	import { isOpen } from '$stores/sidebarStates';
	import { isSMUp } from '$stores/mediaStates';
</script>

<div
	class="layout pt-[60px]"
	data-is-minimized={!$isOpen && $isSMUp}
	data-is-maximized={$isOpen && $isSMUp}
>
	<Topbar />
	<Sidebar />
	<div class="w-full">
		<slot />
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
