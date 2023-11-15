<script lang="ts">
	// IMPORTED TYPES
	import type { CriteriaGradeData, CriteriaItemData } from '$types/curriculum';
	// IMPORTED UTILS
	import { generateId } from '$utils/helpers';
	import { createErrorModal } from '$stores/modalStates';
	import { updateCriteriaGrade } from '$utils/supabase';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, FloatingLabelInput, Badge, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	// PROPS
	export let criteria_item: CriteriaItemData,
		criteria_grade: CriteriaGradeData,
		handleClose: () => void,
		handleSearch: () => Promise<void>;

	// STATES
	let score = criteria_grade.score.toString();
	let isLoading = false;
	let inputId = generateId();

	// UTILS
	const handleReset = () => {
		score = '';
	};
	const handleSave = async () => {
		isLoading = true;
		try {
			if (score === '') throw new Error('The form is incomplete!');
			const { id, criteria_item_id, course_student_id, created_at } = criteria_grade;
			await updateCriteriaGrade({
				id,
				course_class_id: criteria_item.criteria.course_class.id,
				criteria_item_id,
				course_student_id,
				score: parseInt(score),
				created_at,
			});
			await handleSearch();
			handleClose();
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleChange = (val: string) => {
		let v = parseInt(val);
		if (v < 0) v = 0;
		else if (v > criteria_grade.criteria_item.total) v = criteria_grade.criteria_item.total;
		score = v.toString();
	};

	// LIFECYCLES
	onMount(() => document.getElementById(inputId)?.focus());
</script>

<Modal open={true} permanent={true} class="w-full" size="sm">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-plus text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Edit Score</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form class="flex flex-col gap-4" on:submit|preventDefault={handleSave}>
		<FloatingLabelInput
			id={inputId}
			style="outlined"
			type="number"
			label="Score"
			required
			bind:value={score}
			on:change={(e) =>
				// @ts-ignore
				handleChange(e.currentTarget?.value || '')}
		/>
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
			<Button size="sm" color="primary" disabled={isLoading} on:click={handleSave}>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />Loading
				{:else}
					Save
				{/if}
			</Button>
		</div>
	</svelte:fragment>
</Modal>
