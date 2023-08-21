<script lang="ts">
	// IMPORTED TYPES
	import type { ModalItem } from '$stores/modalStates';
	// IMPORTED STATES
	import { account } from '$stores/authStates';
	// IMPORTED UTILS
	import { createErrorModal, removeModal } from '$stores/modalStates';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, Badge, FloatingLabelInput, Spinner } from 'flowbite-svelte';

	// PROPS
	export let modal: ModalItem;

	// STATES
	let password = '';
	let isLoading = false;

	// UTILS
	const handleClose = () => removeModal(modal.id);
	const handleVerification = async () => {
		isLoading = true;
		if (password === $account.password && modal.handleProceed) {
			await modal.handleProceed();
			handleClose();
		} else createErrorModal({ message: 'Verification failed!' });
		isLoading = false;
	};
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
			<Badge class="aspect-plus p-2">
				<i class="ph-bold ph-shield-warning text-[18px]" />
			</Badge>
			<p class="text-lg text-black flex-grow">Verify your identity!</p>
			<button class="w-[34px] flex-center" disabled={isLoading} on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form on:submit|preventDefault={handleVerification}>
		<FloatingLabelInput
			bind:value={password}
			style="outlined"
			type="password"
			label="Password"
			required
		/>
	</form>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button color="red" disabled={isLoading} on:click={handleClose}>Cancel</Button>
			<Button color="green" disabled={isLoading} on:click={handleVerification}>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" /> Loading
				{:else}
					Verify
				{/if}
			</Button>
		</div>
	</svelte:fragment>
</Modal>
