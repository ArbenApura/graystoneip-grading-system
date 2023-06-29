<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED STATES
	import { isSMDown } from '$stores/mediaStates';
	// IMPORTED LIB-COMPONENTS
	import {
		FloatingLabelInput,
		Button,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell,
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import AdminAdderModal from './components/AdminAdderModal.svelte';
	import AdminEditorModal from './components/AdminEditorModal.svelte';
	import Table from '$components/modules/Table.svelte';

	// STATES
	let admins: Account[] = [
		{
			id: '2',
			firstName: 'John',
			lastName: 'Doe',
			middleName: 'Duck',
			gender: 'male',
			birthDate: 946684800000, // January 1, 2000
			address: '456 Elm Street',
			contactNo: '9876543210',
			accountType: 'admin',
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
			accountType: 'admin',
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
			accountType: 'admin',
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
			accountType: 'admin',
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
			accountType: 'admin',
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
			accountType: 'admin',
			email: 'sarah.wilson@example.com',
			password: 'password789',
			dateCreated: Date.now(),
		},
	];
	let filteredItems: Account[];
	let startingItem = 0;
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
		{
			icon: 'ti ti-shield-lock',
			label: 'Admin Controls',
			href: '/app/admin-controls',
		},
	]}
/>

{#if modals.adder}
	<AdminAdderModal handleClose={closeAdderModal} />
{/if}
{#if target}
	{#if modals.editor}
		<AdminEditorModal account={target} handleClose={closeEditorModal} />
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
	<Table items={admins} bind:filteredItems bind:startingItem>
		<svelte:fragment slot="table-head">
			<TableHeadCell class="rounded-l-md">#</TableHeadCell>
			<TableHeadCell>Last Name</TableHeadCell>
			<TableHeadCell>First Name</TableHeadCell>
			<TableHeadCell>Middle Name</TableHeadCell>
			<TableHeadCell>Gender</TableHeadCell>
			<TableHeadCell>Contact No.</TableHeadCell>
			<TableHeadCell>Email</TableHeadCell>
			<TableHeadCell class="rounded-r-md">Tools</TableHeadCell>
		</svelte:fragment>
		<svelte:fragment slot="table-body">
			{#if filteredItems && filteredItems.length}
				{#each filteredItems as item, i}
					<TableBodyRow>
						<TableBodyCell>{startingItem + 1 + i}</TableBodyCell>
						<TableBodyCell>{item.lastName}</TableBodyCell>
						<TableBodyCell>{item.firstName}</TableBodyCell>
						<TableBodyCell>{item.middleName}</TableBodyCell>
						<TableBodyCell class="capitalize">{item.gender}</TableBodyCell>
						<TableBodyCell>{item.contactNo}</TableBodyCell>
						<TableBodyCell>{item.email}</TableBodyCell>
						<TableBodyCell class="flex gap-2">
							<Button
								class="w-[25px] h-[25px] flex-center"
								color="green"
								on:click={() => openEditorModal(item)}
							>
								<i class="ti ti-pencil text-sm" />
							</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			{/if}
		</svelte:fragment>
	</Table>
</div>

<style lang="scss">
	:global(.search > div) {
		flex-grow: 1;
	}
</style>
