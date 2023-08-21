<script lang="ts">
	// IMPORTED TYPES
	import type { CriteriaData } from '$types/curriculum';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createErrorModal,
		createSuccessModal,
	} from '$stores/modalStates';
	import { generateId } from '$utils/helpers';
	import { insertCriteriaItem } from '$utils/supabase';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, FloatingLabelInput, Badge, Spinner } from 'flowbite-svelte';

	// PROPS
	export let criteria: CriteriaData,
		handleMainClose: () => void,
		handleClose: () => void,
		handleSearch: () => Promise<void>;

	// STATES
	let name: string, total: string;
	let isLoading = false;

	// UTILS
	const handleReset = () => {
		name = '';
		total = '';
	};
	const handleSave = async () => {
		isLoading = true;
		try {
			const id = generateId();
			const created_at = Date.now();
			await insertCriteriaItem({
				id,
				criteria_id: criteria.id,
				name,
				total: parseInt(total),
				created_at,
			});
			await handleSearch();
			handleClose();
			handleMainClose();
			createSuccessModal({ message: 'Criteria item was created successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleProceed = async () => {
		try {
			if ([name, total].some((v) => !v)) throw new Error('The form is incomplete!');
			createConfirmationModal({
				message: 'Are you sure you want to proceed?',
				handleProceed: handleSave,
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
			isLoading = false;
		}
	};
</script>

<Modal open={true} permanent={true} class="w-full" size="md">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-plus text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Add Criteria Item</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form class="flex flex-col gap-4" on:submit|preventDefault={handleProceed}>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FloatingLabelInput
				bind:value={name}
				style="outlined"
				type="text"
				label="Name"
				required
			/>
			<FloatingLabelInput
				bind:value={total}
				style="outlined"
				type="number"
				label="Total"
				required
			/>
		</div>
		<button type="submit" hidden />
	</form>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button size="sm" color="alternative" disabled={isLoading} on:click={handleReset}>
				Reset
			</Button>
			<Button size="sm" color="red" disabled={isLoading} on:click={handleClose}>
				Cancel
			</Button>
			<Button size="sm" color="green" disabled={isLoading} on:click={handleProceed}>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />Loading
				{:else}
					Proceed
				{/if}
			</Button>
		</div>
	</svelte:fragment>
</Modal>
