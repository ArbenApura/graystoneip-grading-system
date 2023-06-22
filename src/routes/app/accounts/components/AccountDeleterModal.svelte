<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, Badge } from 'flowbite-svelte';

	// PROPS
	export let account: Account, handleClose: () => void;

	// UTILS
	const handleSubmit = () => {};
</script>

<Modal open={true} permanent={true} class="w-full" size="sm">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-alert-circle text-[18px]" /></Badge>
			<p class="text-lg text-black flex-grow">Confirmation</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<div class="p-2">
		<p class="text-base text-black">Are you sure you want to delete this account?</p>
	</div>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button on:click={handleClose} color="red">Cancel</Button>
			<Button on:click={handleSubmit} color="green">Proceed</Button>
		</div>
	</svelte:fragment>
</Modal>
