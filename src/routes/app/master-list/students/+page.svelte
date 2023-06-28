<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED STATES
	import { isSMDown } from '$stores/mediaStates';
	// IMPORTED LIB-COMPONENTS
	import { FloatingLabelInput, Button } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import StudentAdderModal from './components/StudentAdderModal.svelte';
	import StudentEditorModal from './components/StudentEditorModal.svelte';
	import StudentTable from './components/StudentTable.svelte';

	// STATES
	let students: Account[] = [
		{
			id: '2',
			firstName: 'John',
			lastName: 'Doe',
			middleName: 'Duck',
			gender: 'male',
			birthDate: 946684800000, // January 1, 2000
			address: '456 Elm Street',
			contactNo: '9876543210',
			accountType: 'student',
			email: 'john.doe@example.com',
			password: 'qwerty123',
			dateCreated: Date.now(),
		},
		{
			id: '3',
			firstName: 'Jane',
			lastName: 'Smith',
			middleName: 'Lee',
			gender: 'female',
			birthDate: 978307200000, // January 1, 2001
			address: '789 Oak Avenue',
			contactNo: '5551234567',
			accountType: 'student',
			email: 'jane.smith@example.com',
			password: 'abcd1234',
			dateCreated: Date.now(),
		},
		{
			id: '4',
			firstName: 'David',
			lastName: 'Johnson',
			middleName: 'Robert',
			gender: 'male',
			birthDate: 961113600000, // March 1, 2000
			address: '321 Pine Road',
			contactNo: '8889876543',
			accountType: 'student',
			email: 'david.johnson@example.com',
			password: 'password456',
			dateCreated: Date.now(),
		},
		{
			id: '5',
			firstName: 'Emily',
			lastName: 'Davis',
			middleName: 'Ann',
			gender: 'female',
			birthDate: 972518400000, // October 1, 2000
			address: '567 Cedar Lane',
			contactNo: '2223334444',
			accountType: 'student',
			email: 'emily.davis@example.com',
			password: 'pass1234',
			dateCreated: Date.now(),
		},
		{
			id: '6',
			firstName: 'Michael',
			lastName: 'Brown',
			middleName: 'Thomas',
			gender: 'male',
			birthDate: 954892800000, // April 1, 2000
			address: '789 Elmwood Avenue',
			contactNo: '9998887777',
			accountType: 'student',
			email: 'michael.brown@example.com',
			password: 'abcd1234',
			dateCreated: Date.now(),
		},
		{
			id: '7',
			firstName: 'Sarah',
			lastName: 'Wilson',
			middleName: 'Jane',
			gender: 'female',
			birthDate: 968304000000, // November 1, 2000
			address: '987 Oakwood Drive',
			contactNo: '1112223333',
			accountType: 'student',
			email: 'sarah.wilson@example.com',
			password: 'password789',
			dateCreated: Date.now(),
		},
	];
	let modals = { adder: false, editor: false };
	let target: Account | null = null;

	// UTILS
	const openAdderModal = () => (modals.adder = true);
	const closeAdderModal = () => (modals.adder = false);
	const openEditorModal = (account: Account) => {
		modals.editor = true;
		target = account;
	};
	const closeEditorModal = () => (modals.editor = false);
</script>

<Header
	breadcrumbItems={[
		{ icon: 'ph-bold ph-user-list', label: 'Master List', href: '' },
		{ label: 'Students', href: '/app/master-list/students' },
	]}
/>

{#if modals.adder}
	<StudentAdderModal handleClose={closeAdderModal} />
{/if}
{#if target}
	{#if modals.editor}
		<StudentEditorModal account={target} handleClose={closeEditorModal} />
	{/if}
{/if}

<div class="p-4 pt-0 flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<div class="search w-full md:w-[50%] bg-white rounded-md shadow-md p-2 flex gap-2">
			<FloatingLabelInput style="outlined" type="text" label="Search..." />
			<Button class="w-[48px] h-[48px]"><i class="ti ti-search text-xl" /></Button>
		</div>
		<Button
			class={`w-[48px] h-[48px] shadow-md ${
				$isSMDown && 'fixed bottom-[16px] right-[16px] z-20'
			}`}
			pill={true}
			on:click={openAdderModal}
		>
			<i class="ti ti-plus text-xl" />
		</Button>
	</div>
	<StudentTable {...{ students, openEditorModal }} />
</div>

<style lang="scss">
	:global(.search > div) {
		flex-grow: 1;
	}
</style>
