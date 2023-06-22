<script lang="ts">
	// IMPORTED COMPONENTS
	import Topbar from '$components/layouts/Topbar.svelte';
	import Sidebar from '$components/layouts/Sidebar.svelte';
	import Footer from '$components/layouts/Footer.svelte';
	// IMPORTED STATES
	import { isOpen } from '$stores/sidebarStates';
	import { isSMUp } from '$stores/mediaStates';

	// REACTIVE STATES
	$: pl = (() => {
		if ($isSMUp) {
			return $isOpen ? 300 : 60;
		} else return 0;
	})();
</script>

<div class={`pt-[60px] pl-[${pl}px]`}>
	<Topbar />
	<Sidebar />
	<div class="w-full">
		<slot />
		<div class="p-4 pt-0"><Footer /></div>
	</div>
</div>
