<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED STATES
	import { isSMDown } from '$stores/mediaStates';
	// IMPORTED LIB-COMPONENTS
	import {
		FloatingLabelInput,
		Button,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import AccountAdderModal from './components/AccountAdderModal.svelte';
	import AccountEditorModal from './components/AccountEditorModal.svelte';
	import AccountDeleterModal from './components/AccountDeleterModal.svelte';

	// STATES
	let accounts: Account[] = [
		{
			id: '456',
			lastName: 'Smith',
			firstName: 'John',
			contactNo: '09876543210',
			email: 'john.smith@example.com',
			accountType: 'teacher',
			username: 'johnsmith',
			password: 'smith123',
			dateCreated: Date.now()
		},
		{
			id: '789',
			lastName: 'Garcia',
			firstName: 'Maria',
			contactNo: '091122334455',
			email: 'maria.garcia@example.com',
			accountType: 'teacher',
			username: 'mariag',
			password: 'password123',
			dateCreated: Date.now()
		},
		{
			id: '987',
			lastName: 'Lee',
			firstName: 'Ji-hyun',
			contactNo: '09998887776',
			email: 'jihyun.lee@example.com',
			accountType: 'dean',
			username: 'jihyunlee',
			password: 'lee456',
			dateCreated: Date.now()
		},
		{
			id: '654',
			lastName: 'Kim',
			firstName: 'Sung-min',
			contactNo: '09776665544',
			email: 'sungmin.kim@example.com',
			accountType: 'teacher',
			username: 'sungmink',
			password: 'kim789',
			dateCreated: Date.now()
		},
		{
			id: '321',
			lastName: 'Lopez',
			firstName: 'Carlos',
			contactNo: '09223334455',
			email: 'carlos.lopez@example.com',
			accountType: 'teacher',
			username: 'carlosl',
			password: 'lopez123',
			dateCreated: Date.now()
		},
		{
			id: '135',
			lastName: 'Nguyen',
			firstName: 'Linh',
			contactNo: '09665554433',
			email: 'linh.nguyen@example.com',
			accountType: 'teacher',
			username: 'linhng',
			password: 'nguyen456',
			dateCreated: Date.now()
		},
		{
			id: '753',
			lastName: 'Wang',
			firstName: 'Yun',
			contactNo: '09117776655',
			email: 'yun.wang@example.com',
			accountType: 'teacher',
			username: 'yunwang',
			password: 'wang789',
			dateCreated: Date.now()
		},
		{
			id: '852',
			lastName: 'Sato',
			firstName: 'Akiko',
			contactNo: '09099887766',
			email: 'akiko.sato@example.com',
			accountType: 'teacher',
			username: 'akikos',
			password: 'sato123',
			dateCreated: Date.now()
		},
		{
			id: '951',
			lastName: 'Martinez',
			firstName: 'Alejandro',
			contactNo: '09224445566',
			email: 'alejandro.martinez@example.com',
			accountType: 'teacher',
			username: 'alejandrom',
			password: 'martinez123',
			dateCreated: Date.now()
		},
		{
			id: '159',
			lastName: 'Kawasaki',
			firstName: 'Hiroshi',
			contactNo: '09087776655',
			email: 'hiroshi.kawasaki@example.com',
			accountType: 'teacher',
			username: 'hiroshik',
			password: 'kawasaki456',
			dateCreated: Date.now()
		}
	];

	let modals = { adder: false, editor: false, deleter: false };
	let target: Account | null = null;

	// UTILS
	const openAdderModal = () => (modals.adder = true);
	const closeAdderModal = () => (modals.adder = false);
	const openEditorModal = (account: Account) => {
		modals.editor = true;
		target = account;
	};
	const closeEditorModal = () => (modals.editor = false);
	const openDeleterModal = (account: Account) => {
		modals.deleter = true;
		target = account;
	};
	const closeDeleterModal = () => (modals.deleter = false);
</script>

{#if modals.adder}
	<AccountAdderModal handleClose={closeAdderModal} />
{/if}
{#if target}
	{#if modals.editor}
		<AccountEditorModal account={target} handleClose={closeEditorModal} />
	{/if}
	{#if modals.deleter}
		<AccountDeleterModal account={target} handleClose={closeDeleterModal} />
	{/if}
{/if}

<div class="p-4 flex flex-col gap-4">
	<div class="flex items-center justify-between">
		<div class="search w-full md:w-[50%] bg-white rounded-md shadow-md p-2 flex gap-2">
			<FloatingLabelInput style="outlined" type="text" label="Search..." />
			<Button class="w-[48px] h-[48px]"><i class="ti ti-search text-xl" /></Button>
		</div>
		<Button
			class={`w-[48px] h-[48px] shadow-md ${$isSMDown && 'fixed bottom-[16px] right-[16px] z-20'}`}
			pill={true}
			on:click={openAdderModal}
		>
			<i class="ti ti-plus text-xl" />
		</Button>
	</div>

	<div class="bg-white p-4 rounded-md shadow-md">
		<Table>
			<TableHead>
				<TableHeadCell>Last Name</TableHeadCell>
				<TableHeadCell>First Name</TableHeadCell>
				<TableHeadCell>Contact No.</TableHeadCell>
				<TableHeadCell>E-mail</TableHeadCell>
				<TableHeadCell>Account Type</TableHeadCell>
				<TableHeadCell>Tools</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each accounts as account}
					<TableBodyRow>
						<TableBodyCell>{account.lastName}</TableBodyCell>
						<TableBodyCell>{account.firstName}</TableBodyCell>
						<TableBodyCell>{account.contactNo}</TableBodyCell>
						<TableBodyCell>{account.email}</TableBodyCell>
						<TableBodyCell>{account.accountType}</TableBodyCell>
						<TableBodyCell class="flex gap-2">
							<Button
								class="w-[25px] h-[25px] flex-center"
								color="green"
								on:click={() => openEditorModal(account)}
							>
								<i class="ti ti-pencil text-sm" />
							</Button>
							<Button
								class="w-[25px] h-[25px] flex-center"
								color="red"
								on:click={() => openDeleterModal(account)}
							>
								<i class="ti ti-trash text-sm" />
							</Button>
						</TableBodyCell>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>
	</div>
</div>

<style lang="scss">
	:global(.search > div) {
		flex-grow: 1;
	}
</style>
