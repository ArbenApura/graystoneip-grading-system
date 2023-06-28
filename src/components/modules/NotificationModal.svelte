<script lang="ts">
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, Badge } from 'flowbite-svelte';

	// PROPS
	export let message: string,
		title: String = 'Notification',
		handleClose: () => void;
</script>

<Modal
	open={true}
	permanent={true}
	class="w-full z-50"
	backdropClass="fixed bg-gray-900 bg-opacity-50 dark:bg-opacity-80 z-50"
	size="sm"
>
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-alert-circle text-[18px]" /></Badge>
			<p class="text-lg text-black flex-grow">{title}</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<div class="p-2">
		<p class="text-base text-black">{message}</p>
	</div>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button on:click={handleClose}>Close</Button>
		</div>
	</svelte:fragment>
</Modal>
