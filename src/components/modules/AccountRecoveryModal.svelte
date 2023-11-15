<script lang="ts">
	// IMPORTED TYPES
	import type { ModalItem } from '$stores/modalStates';
	// IMPORTED UTILS
	import { createErrorModal, createInfoModal, removeModal } from '$stores/modalStates';
	import { generateId } from '$utils/helpers';
	import { insertRecoveryRequest, selectAccountByEmailOrId } from '$utils/supabase';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, Badge, FloatingLabelInput, Spinner } from 'flowbite-svelte';

	// PROPS
	export let modal: ModalItem;

	// STATES
	let source = '';
	let isLoading = false;

	// UTILS
	const handleClose = () => removeModal(modal.id);
	const handleSubmit = async () => {
		isLoading = true;
		try {
			if (!source) throw new Error('The form is incomplete!');
			if (!(await selectAccountByEmailOrId(source)))
				throw new Error('Account does not exist!');
			const id = generateId();
			const created_at = Date.now();
			await insertRecoveryRequest({ id, source, created_at });
			createInfoModal({
				message:
					'Thank you for submitting your account recovery request. Kindly await our source response for further instructions. We appreciate your patience.',
			});
			handleClose();
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
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
				<i class="ph-bold ph-arrow-counter-clockwise text-[18px]" />
			</Badge>
			<p class="text-lg text-black flex-grow">Recover Account</p>
			<button class="w-[34px] flex-center" disabled={isLoading} on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form on:submit|preventDefault={handleSubmit}>
		<FloatingLabelInput
			bind:value={source}
			style="outlined"
			type="text"
			label="Email / Student ID"
			required
		/>
	</form>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button color="red" disabled={isLoading} on:click={handleClose}>Cancel</Button>
			<Button color="primary" disabled={isLoading} on:click={handleSubmit}>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" /> Loading
				{:else}
					Submit
				{/if}
			</Button>
		</div>
	</svelte:fragment>
</Modal>
