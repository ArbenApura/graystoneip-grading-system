<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED STATES
	import { account, login } from '$stores/authStates';
	// IMPORTED UTILS
	import { formatDate, validateEmail } from '$utils/helpers';
	import {
		createConfirmationModal,
		createErrorModal,
		createSuccessModal,
		createVerificationModal,
	} from '$stores/modalStates';
	import { deleteAvatar, updateAccount, uploadAvatar } from '$utils/supabase';
	// IMPORTED LIB-COMPONENTS
	import {
		Button,
		FloatingLabelInput,
		Fileupload,
		Select,
		Label,
		Spinner,
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';

	// BREADCRUMBS STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ph-bold ph-user', label: 'Account', href: '/app/account' },
	];

	// STATES
	let files: FileList,
		first_name = $account.first_name,
		last_name = $account.last_name,
		middle_name = $account.middle_name,
		gender = $account.gender,
		contact_number = $account.contact_number,
		email = $account.email,
		password = $account.password,
		repassword = $account.password;
	let selectedImage: string | ArrayBuffer | null = $account.avatar || NoImagePNG;
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
		first_name = $account.first_name;
		last_name = $account.last_name;
		middle_name = $account.middle_name;
		gender = $account.gender;
		contact_number = $account.contact_number;
		email = $account.email;
		password = $account.password;
		repassword = $account.password;
	};
	const handleSave = async () => {
		isLoading = true;
		try {
			let avatar = $account.avatar;
			if (files && files.length) {
				await deleteAvatar(avatar);
				avatar = await uploadAvatar(files[0]);
			}
			await updateAccount($account.id, {
				id: $account.id,
				last_name,
				first_name,
				middle_name,
				full_name,
				gender,
				contact_number,
				account_type: $account.account_type,
				avatar,
				email,
				password,
				created_at: $account.created_at,
			});
			await login(email, password);
			createSuccessModal({ message: 'Your account was edited successfully!' });
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
	const handleSubmit = async () => {
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
			if (email === $account.email && password === $account.password)
				createConfirmationModal({
					message: 'Are you sure you want to save the changes?',
					handleProceed: handleSave,
				});
			else createVerificationModal({ handleProceed: handleSave });
		} catch (error: any) {
			createErrorModal({ message: error.message });
			isLoading = false;
		}
	};
</script>

<Header {breadcrumbItems} />

<div class="p-4 pt-0">
	<form
		class="bg-white rounded-md shadow-md p-4 flex flex-col gap-4"
		on:submit|preventDefault={handleSave}
	>
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
					required
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
						bind:value={contact_number}
						style="outlined"
						type="text"
						label="Contact No."
						required
					/>
				</div>

				<Label>Access Info</Label>
				<div
					class="grid grid-cols-1 gap-4 {$account.account_type === 'student' &&
						'sm:grid-cols-2'}"
				>
					{#if $account.account_type === 'student'}
						<FloatingLabelInput
							style="outlined"
							label="Student ID"
							required
							disabled
							bind:value={$account.id}
						/>
					{/if}
					<FloatingLabelInput
						bind:value={email}
						style="outlined"
						type="email"
						label="Email"
						required
					/>
				</div>
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
		</div>
		<hr />
		<div class="flex items-center justify-end gap-4">
			<Button size="sm" color="alternative" on:click={handleReset}>Reset</Button>
			<Button size="sm" disabled={isLoading} on:click={handleSubmit}>
				{#if isLoading}
					<Spinner class="mr-3" size="4" color="white" />Saving
				{:else}
					Save
				{/if}
			</Button>
		</div>
	</form>
</div>
