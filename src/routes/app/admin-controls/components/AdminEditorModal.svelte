<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { Account } from '$types/index';
	// IMPORTED UTILS
	import {
		createConfirmationModal,
		createErrorModal,
		createSuccessModal,
		createVerificationModal,
	} from '$stores/modalStates';
	import { generateId, validateEmail, formatDate } from '$utils/helpers';
	import { deleteAvatar, updateAccount, uploadAvatar } from '$utils/supabase';
	// IMPORTED LIB-COMPONENTS
	import {
		Button,
		Modal,
		FloatingLabelInput,
		Badge,
		Label,
		Select,
		Fileupload,
		Spinner,
	} from 'flowbite-svelte';

	// PROPS
	export let account: Account, handleClose: () => void, handleRefresh: () => Promise<void>;

	// STATES
	let files: FileList,
		first_name = account.first_name,
		last_name = account.last_name,
		middle_name = account.middle_name,
		gender = account.gender,
		birth_date = formatDate(new Date(account.birth_date)),
		contact_number = account.contact_number,
		address = account.address,
		email = account.email,
		password = account.password,
		repassword = account.password;
	let selectedImage: string | ArrayBuffer | null = account.avatar || NoImagePNG;
	let isLoading = false;

	// REACTIVE STATES
	$: full_name = first_name + ' ' + middle_name + ' ' + last_name;

	// UTILS
	const handleFileChange = (event: Event) => {
		const target = event.target as HTMLInputElement;
		const file = target.files && target.files[0];
		if (file && file.type.startsWith('image/')) {
			const reader = new FileReader();
			reader.onload = () => {
				selectedImage = reader.result;
			};
			reader.readAsDataURL(file);
		}
	};
	const handleReset = () => {
		first_name = account.first_name;
		last_name = account.last_name;
		middle_name = account.middle_name;
		gender = account.gender;
		birth_date = formatDate(new Date(account.birth_date));
		contact_number = account.contact_number;
		address = account.address;
		email = account.email;
		password = account.password;
		repassword = account.password;
	};
	const handleSave = async () => {
		isLoading = true;
		try {
			let avatar = account.avatar;
			if (files && files.length) {
				await deleteAvatar(avatar);
				avatar = await uploadAvatar(files[0]);
			}
			await updateAccount({
				id: account.id,
				last_name,
				first_name,
				middle_name,
				full_name,
				gender,
				birth_date: new Date(birth_date).getTime(),
				contact_number,
				address,
				account_type: account.account_type,
				avatar,
				email,
				password,
				created_at: account.created_at,
			});
			await handleRefresh();
			handleClose();
			createSuccessModal({ message: 'Admin account was edited successfully!' });
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
					birth_date,
					contact_number,
					address,
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
				handleProceed: () => createVerificationModal({ handleProceed: handleSave }),
			});
		} catch (error: any) {
			createErrorModal({ message: error.message });
			isLoading = false;
		}
	};
</script>

<Modal open={true} permanent={true} class="w-full" size="lg">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-edit text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Edit Admin</p>
			<button class="w-[34px] flex-center" on:click={handleClose}>
				<i class="ti ti-x text-xl cursor-pointer hover:text-black" />
			</button>
		</div>
	</svelte:fragment>
	<form class="grid grid-cols-1 lg:grid-cols-2 gap-4" on:submit|preventDefault={handleProceed}>
		<div class="flex flex-col justify-between gap-8">
			<Label>Avatar</Label>
			<div class="mx-auto p-1 rounded-full border-[2px] border-blue-600">
				<div
					class="bg-gray-100 w-[200px] h-[200px] rounded-full bg-cover bg-center"
					style="background-image: url({selectedImage || NoImagePNG})"
				/>
			</div>
			<Fileupload
				bind:files
				on:change={handleFileChange}
				inputClass="h-[48px] p-0 flex-center rounded-none border-b bg-transparent"
				accept="image/*"
			/>
		</div>
		<div class="flex flex-col gap-4">
			<Label>Basic Info</Label>
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
					bind:value={birth_date}
					style="outlined"
					type="date"
					label="Birth Date"
					required
				/>
			</div>

			<Label>Contact Info</Label>
			<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<FloatingLabelInput
					bind:value={contact_number}
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
