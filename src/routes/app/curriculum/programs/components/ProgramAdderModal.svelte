<script lang="ts">
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, FloatingLabelInput, Badge } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import NotificationModal from '$components/modules/NotificationModal.svelte';

	// PROPS
	export let handleClose: () => void;

	// STATES
	let code: string, description: string;
	let error: string;

	// UTILS
	const handleReset = () => {
		code = '';
		description = '';
	};
	const handleProceed = () => {
		try {
			if ([code, description].some((v) => !v)) throw new Error('Form is incomplete!');
		} catch (err: any) {
			error = err.message;
		}
	};
</script>

<Modal open={true} permanent={true} class="w-full" size="md">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-plus text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Add Program</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form class="grid grid-cols-1 sm:grid-cols-2 gap-4" on:submit|preventDefault={handleProceed}>
		<FloatingLabelInput bind:value={code} style="outlined" type="text" label="Code" />
		<FloatingLabelInput
			bind:value={description}
			style="outlined"
			type="text"
			label="Description"
			required
		/>
		<button type="submit" hidden />
	</form>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button size="sm" color="alternative" on:click={handleReset}>Reset</Button>
			<Button size="sm" color="red" on:click={handleClose}>Cancel</Button>
			<Button size="sm" color="green" on:click={handleProceed}>Proceed</Button>
		</div>
	</svelte:fragment>
</Modal>

{#if error}
	<NotificationModal message={error} handleClose={() => (error = '')} />
{/if}
