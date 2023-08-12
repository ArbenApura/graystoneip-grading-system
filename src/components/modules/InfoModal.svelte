<script lang="ts">
	// IMPORTED TYPES
	import type { ModalItem } from '$stores/modalStates';
	// IMPORTED LIB-UTILS
	import { onMount } from 'svelte';
	// IMPORTED UTILS
	import { removeModal } from '$stores/modalStates';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, Badge } from 'flowbite-svelte';

	// PROPS
	export let modal: ModalItem;

	// UTILS
	const handleClose = () => removeModal(modal.id);

	// LIFECYCLES
	onMount(() => document.getElementById(`close-btn-${modal.id}`)?.focus());
</script>

<Modal
	open={true}
	permanent={true}
	backdropClass="fixed bg-gray-900 bg-opacity-50 dark:bg-opacity-80 z-[50]"
	size="sm"
>
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-alert-circle text-[18px]" /></Badge>
			<p class="text-lg text-black flex-grow">
				{modal.title || 'Notification'}
			</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<div class="p-2 min-h-[48px] flex items-center">
		<p class="text-base text-black">{modal.message}</p>
	</div>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button id="close-btn-{modal.id}" on:click={handleClose}>Close</Button>
		</div>
	</svelte:fragment>
</Modal>
