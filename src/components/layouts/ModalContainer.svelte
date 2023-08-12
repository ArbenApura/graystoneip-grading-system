<script lang="ts">
	// IMPORTED STATES
	import { modals } from '$stores/modalStates';
	// IMPORTED COMPONENTS
	import InfoModal from '$components/modules/InfoModal.svelte';
	import ErrorModal from '$components/modules/ErrorModal.svelte';
	import SuccessModal from '$components/modules/SuccessModal.svelte';
	import ConfirmationModal from '$components/modules/ConfirmationModal.svelte';
	import VerificationModal from '$components/modules/VerificationModal.svelte';
	import LoadingModal from '$components/modules/LoadingModal.svelte';
</script>

{#each $modals as modal}
	{#if modal.type === 'info'}
		<InfoModal {modal} />
	{:else if modal.type === 'error'}
		<ErrorModal {modal} />
	{:else if modal.type === 'success'}
		<SuccessModal {modal} />
	{:else if modal.type === 'confirmation'}
		<ConfirmationModal {modal} />
	{:else if modal.type === 'verification'}
		<VerificationModal {modal} />
	{:else if modal.type === 'loading'}
		<LoadingModal {modal} />
	{/if}
{/each}
