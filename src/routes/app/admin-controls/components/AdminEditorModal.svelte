<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED UTILS
	import { formatDate } from '$utils/helpers';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, FloatingLabelInput, Badge, Label, Select } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import NotificationModal from '$components/modules/NotificationModal.svelte';

	// PROPS
	export let account: Account, handleClose: () => void;

	// STATES
	let firstName = account.firstName,
		lastName = account.lastName,
		middleName = account.middleName,
		gender = account.gender,
		birthDate = formatDate(new Date(account.birthDate)),
		contactNo = account.contactNo,
		address = account.address,
		email = account.email,
		password = account.password,
		repassword = account.password;
	let error: string;

	// UTILS
	const handleReset = () => {
		firstName = account.firstName;
		lastName = account.lastName;
		middleName = account.middleName;
		gender = account.gender;
		birthDate = formatDate(new Date(account.birthDate));
		contactNo = account.contactNo;
		address = account.address;
		email = account.email;
		password = account.password;
		repassword = account.password;
	};
	const handleProceed = () => {
		try {
			if (
				[
					firstName,
					lastName,
					middleName,
					gender,
					birthDate,
					contactNo,
					address,
					email,
					password,
					repassword,
				].some((v) => !v)
			)
				throw new Error('Form is incomplete!');
			if (password !== repassword) throw new Error('Password does not match!');
		} catch (err: any) {
			error = err.message;
		}
	};
</script>

<Modal open={true} permanent={true} class="w-full" size="md">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-edit text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Edit Admin</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form class="flex flex-col gap-4" on:submit|preventDefault={handleProceed}>
		<Label>Basic Info</Label>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
			<FloatingLabelInput
				bind:value={lastName}
				style="outlined"
				type="text"
				label="Last Name"
				required
			/>
			<FloatingLabelInput
				bind:value={firstName}
				style="outlined"
				type="text"
				label="First Name"
				required
			/>
			<FloatingLabelInput
				bind:value={middleName}
				style="outlined"
				type="text"
				label="Middle Name"
				required
			/>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<Select
				bind:value={gender}
				placeholder="Select Gender"
				items={[
					{ name: 'Male', value: 'male' },
					{ name: 'Female', value: 'female' },
				]}
			/>
			<FloatingLabelInput
				bind:value={birthDate}
				style="outlined"
				type="date"
				label="Birth Date"
				required
			/>
		</div>

		<Label>Contact Info</Label>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FloatingLabelInput
				bind:value={contactNo}
				style="outlined"
				type="text"
				label="Contact No."
				required
			/>
			<FloatingLabelInput
				bind:value={address}
				style="outlined"
				type="text"
				label="Address"
				required
			/>
		</div>

		<Label>Access Info</Label>
		<FloatingLabelInput
			bind:value={email}
			style="outlined"
			type="email"
			label="Email"
			disabled
		/>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FloatingLabelInput
				bind:value={password}
				style="outlined"
				type="password"
				label="Password"
				required
			/>
			<FloatingLabelInput
				bind:value={repassword}
				style="outlined"
				type="password"
				label="Repeat Password"
				required
			/>
		</div>
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
