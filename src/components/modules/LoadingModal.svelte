<script lang="ts">
	// IMPORTED TYPES
	import type { ModalItem } from '$stores/modalStates';
	// IMPORTED LIB-COMPONENTS
	import { Modal, Badge } from 'flowbite-svelte';

	// PROPS
	export let modal: ModalItem;
</script>

<Modal
	open={true}
	permanent={true}
	backdropClass="fixed bg-gray-900 bg-opacity-50 dark:bg-opacity-80 z-[50]"
	size="sm"
>
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2">
				<i class="ph-bold ph-spinner-gap text-[18px] animate-spin" />
			</Badge>
			<p class="text-lg text-black flex-grow">
				{modal.title || 'Please wait...'}
			</p>
		</div>
	</svelte:fragment>
	<div class="p-2 min-h-[48px] flex items-center">
		<p class="text-base text-black">{modal.message}</p>
	</div>
</Modal>
