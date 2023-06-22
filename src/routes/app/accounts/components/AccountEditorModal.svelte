<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, FloatingLabelInput, Badge, Label, Select } from 'flowbite-svelte';
	

	// PROPS
	export let account: Account, handleClose: () => void;

	// STATES
	let firstName = account.firstName,
		lastName = account.lastName,
		contactNo = account.contactNo,
		email = account.email,
		accountType = account.accountType,
		username = account.username,
		password = account.password;
	let accountTypes = [
		{ value: 'dean', name: 'Dean' },
		{ value: 'teacher', name: 'Teacher' }
	];

	// UTILS
	const handleSubmit = () => {};
	const handleReset = () => {
		firstName = account.firstName;
		lastName = account.lastName;
		contactNo = account.contactNo;
		email = account.email;
		accountType = account.accountType;
		username = account.username;
		password = account.password;
	};
</script>

<Modal open={true} permanent={true} class="w-full" size="md">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-edit text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Edit Account</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form class="flex flex-col gap-4" on:submit|preventDefault={handleSubmit}>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FloatingLabelInput
				bind:value={firstName}
				style="outlined"
				type="text"
				label="First Name"
				required
			/>
			<FloatingLabelInput
				bind:value={lastName}
				style="outlined"
				type="text"
				label="Last Name"
				required
			/>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FloatingLabelInput
				bind:value={contactNo}
				style="outlined"
				type="text"
				label="Contact No."
				required
			/>
			<FloatingLabelInput bind:value={email} style="outlined" type="text" label="E-mail" required />
		</div>
		<Label>
			Account Type
			<Select class="mt-2" items={accountTypes} bind:value={accountType} />
		</Label>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<FloatingLabelInput
				bind:value={username}
				style="outlined"
				type="text"
				label="Username"
				required
			/>
			<FloatingLabelInput
				bind:value={password}
				style="outlined"
				type="password"
				label="Password"
				required
			/>
		</div>
		<button type="submit" hidden />
	</form>
	<svelte:fragment slot="footer">
		<div class="w-full flex items-center justify-end gap-4">
			<Button on:click={handleReset} color="alternative">Reset</Button>
			<Button on:click={handleClose} color="red">Cancel</Button>
			<Button on:click={handleSubmit} color="green">Submit</Button>
		</div>
	</svelte:fragment>
</Modal>
