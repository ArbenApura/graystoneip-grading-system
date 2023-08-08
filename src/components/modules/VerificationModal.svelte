<script lang="ts">
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, Badge, FloatingLabelInput } from 'flowbite-svelte';

	// PROPS
	export let handleClose: () => void, handleProceed: () => void | Promise<void>;

	// STATES
	let password = '';

	// UTILS
	const handleVerification = () => handleProceed();
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
			<Badge class="aspect-plus p-2"
				><i class="ph-bold ph-shield-warning text-[18px]" /></Badge
			>
			<p class="text-lg text-black flex-grow">Verify your identity!</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form on:submit|preventDefault={handleProceed}>
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
			<Button color="red" on:click={handleClose}>Cancel</Button>
			<Button color="green" on:click={handleVerification}>Verify</Button>
		</div>
	</svelte:fragment>
</Modal>
