<script lang="ts">
	// IMPORTED TYPES
	import type { Account, StudentRecordData } from '$types/master-list';
	import type { Course, Program } from '$types/curriculum';
	// IMPORTED LIB-UTILS
	import { page } from '$app/stores';
	// IMPORTED UTILS
	import {
		createErrorModal,
		createSuccessModal,
		createConfirmationModal,
	} from '$stores/modalStates';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, Input, Badge, Select, Label, Spinner } from 'flowbite-svelte';
	import { updateStudentRecord } from '$utils/supabase';
	import { account } from '$stores/authStates';

	// PROPS
	export let studentRecord: StudentRecordData,
		handleClose: () => void,
		handleRefresh: () => Promise<void>;

	// STATES
	let program_id = studentRecord.program_id,
		year = studentRecord.year,
		section = studentRecord.section,
		semester = studentRecord.semester,
		school_year = studentRecord.school_year;
	let isLoading = false;
	let programItems = ($page.data.programs || []).map((program: Program) => ({
		name: program.code + ' - ' + program.description,
		value: program.id,
	}));
	let courseItems = ($page.data.courses || []).map((course: Course) => ({
		name: course.code + ' - ' + course.description,
		value: course.id,
	}));

	// REACTIVE STATES
	$: program = $page.data.programs
		? (($page.data.programs || []).filter(
				(program: Program) => program.id === program_id,
		  )[0] as Program)
		: null;

	// UTILS
	const handleReset = () => {
		program_id = studentRecord.program_id;
		year = studentRecord.year;
		section = studentRecord.section;
		semester = studentRecord.semester;
		school_year = studentRecord.school_year;
	};
	const handleSave = async () => {
		isLoading = true;
		try {
			const search_key = `${studentRecord.account.full_name} ${program?.code} ${school_year}`;
			await updateStudentRecord({
				id: studentRecord.id,
				account_id: studentRecord.account.id,
				program_id,
				year,
				section,
				semester,
				school_year,
				search_key,
				created_at: studentRecord.created_at,
			});
			await handleRefresh();
			handleClose();
			createSuccessModal({ message: 'Student was enrolled successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleProceed = async () => {
		try {
			if ([program_id, year, section, semester, school_year, program].some((v) => !v))
				throw new Error('The form is incomplete!');
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
			<Badge class="aspect-plus p-2"><i class="ph-bold ph-student text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Edit Student Record</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form class="flex flex-col gap-4" on:submit|preventDefault={handleProceed}>
		<div>
			<Label class="mb-2">Student ID</Label>
			<Input
				type="text"
				placeholder="Input Student No."
				value={studentRecord.account.id}
				required
				disabled
			/>
		</div>
		<div>
			<Label class="mb-2">Program</Label>
			<Select
				placeholder="Select Program"
				items={programItems}
				required
				bind:value={program_id}
			/>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<Label class="mb-2">Year</Label>
				<Select
					placeholder="Select Year"
					required
					items={[
						{ name: '1st', value: '1st' },
						{ name: '2nd', value: '2nd' },
						{ name: '3rd', value: '3rd' },
						{ name: '4th', value: '4th' },
					]}
					bind:value={year}
				/>
			</div>
			<div>
				<Label class="mb-2">Section</Label>
				<Input type="text" placeholder="Input Section" required bind:value={section} />
			</div>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<div>
				<Label class="mb-2">Semester</Label>
				<Select
					placeholder="Select Semester"
					required
					items={[
						{ name: '1st', value: '1st' },
						{ name: '2nd', value: '2nd' },
					]}
					bind:value={semester}
				/>
			</div>
			<div>
				<Label class="mb-2">School Year</Label>
				<Select
					placeholder="Select School Year"
					required
					items={[
						{ name: '2023-2024', value: '2023-2024' },
						{ name: '2024-2025', value: '2024-2025' },
						{ name: '2025-2026', value: '2025-2026' },
						{ name: '2026-2027', value: '2026-2027' },
						{ name: '2027-2028', value: '2027-2028' },
						{ name: '2028-2029', value: '2028-2029' },
						{ name: '2029-2030', value: '2029-2030' },
					]}
					bind:value={school_year}
				/>
			</div>
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
