<script lang="ts">
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED UTILS
	import { createConfirmationModal, createErrorModal } from '$stores/modalStates';
	import { validateEmail } from '$utils/helpers';
	import { updateAccount } from '$utils/supabase';
	// IMPORTED LIB-COMPONENTS
	import {
		Button,
		Modal,
		FloatingLabelInput,
		Badge,
		Label,
		Select,
		Spinner,
	} from 'flowbite-svelte';

	// PROPS
	export let account: Account, handleClose: () => void, handleRefresh: () => Promise<void>;

	// STATES
	let id = account.id,
		first_name = account.first_name,
		last_name = account.last_name,
		middle_name = account.middle_name,
		gender = account.gender,
		contact_number = account.contact_number,
		email = account.email,
		password = account.password,
		repassword = account.password;
	let isLoading = false;

	// REACTIVE STATES
	$: full_name = first_name + ' ' + middle_name + ' ' + last_name;

	// UTILS
	const handleReset = () => {
		id = account.id;
		first_name = account.first_name;
		last_name = account.last_name;
		middle_name = account.middle_name;
		gender = account.gender;
		contact_number = account.contact_number;
		email = account.email;
		password = account.password;
		repassword = account.password;
	};
	const handleSave = async () => {
		isLoading = true;
		try {
			await updateAccount(account.id, {
				id,
				last_name,
				first_name,
				middle_name,
				full_name,
				gender,
				contact_number,
				account_type: account.account_type,
				avatar: account.avatar,
				email,
				password,
				created_at: account.created_at,
			});
			await handleRefresh();
			handleClose();
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleProceed = async () => {
		try {
			if (
				[
					last_name,
					first_name,
					middle_name,
					gender,
					contact_number,
					email,
					password,
					repassword,
				].some((v) => !v)
			)
				throw new Error('The form is incomplete!');
			if (password !== repassword) throw new Error('The provided password does not match!');
			if (!validateEmail(email)) throw new Error('The provided email is invalid!');
			createConfirmationModal({
				message: 'Are you sure you want to save the changes?',
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
			<Badge class="aspect-plus p-2"><i class="ti ti-edit text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Edit Instructor</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form class="grid grid-cols-1 gap-4" on:submit|preventDefault={handleProceed}>
		<div class="flex flex-col gap-4">
			<Label>Basic Info</Label>
			<FloatingLabelInput
				bind:value={id}
				style="outlined"
				type="text"
				label="ID No."
				required
			/>
			<div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<FloatingLabelInput
					bind:value={last_name}
					style="outlined"
					type="text"
					label="Last Name"
					required
				/>
				<FloatingLabelInput
					bind:value={first_name}
					style="outlined"
					type="text"
					label="First Name"
					required
				/>
				<FloatingLabelInput
					bind:value={middle_name}
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
					bind:value={contact_number}
					style="outlined"
					type="text"
					label="Contact No."
					required
				/>
			</div>

			<Label>Access Info</Label>
			<FloatingLabelInput
				bind:value={email}
				style="outlined"
				type="email"
				label="Email"
				required
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
			<Button size="sm" color="primary" disabled={isLoading} on:click={handleProceed}>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />Loading
				{:else}
					Save
				{/if}
			</Button>
		</div>
	</svelte:fragment>
</Modal>
