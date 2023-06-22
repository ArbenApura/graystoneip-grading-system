<script lang="ts">
	// IMPORTED LIB-COMPONENTS
	import { Button, Modal, FloatingLabelInput, Badge, Select, Label } from 'flowbite-svelte';

	// PROPS
	export let handleClose: () => void;

	// STATES
	let firstName: string,
		lastName: string,
		contactNo: string,
		email: string,
		username: string,
		password: string,
		accountType: string;
	let accountTypes = [
		{ value: 'dean', name: 'Dean' },
		{ value: 'teacher', name: 'Teacher' }
	];

	// UTILS
	const handleSubmit = () => {};
	const handleReset = () => {
		firstName = '';
		lastName = '';
		contactNo = '';
		email = '';
		username = '';
		password = '';
	};
</script>

<Modal open={true} permanent={true} class="w-full" size="md">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-plus text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Add Account</p>
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
			<FloatingLabelInput style="outlined" type="text" label="E-mail" required bind:value={email} />
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
