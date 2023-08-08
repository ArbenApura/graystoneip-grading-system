<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED TYPES
	import type { Account } from '$types/credentials';
	import type { BreadcrumbItem } from '$components/layouts/Header';
	// IMPORTED UTILS
	import { formatDate } from '$utils/helpers';
	// IMPORTED LIB-COMPONENTS
	import { Button, FloatingLabelInput, Fileupload, Select, Label } from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import Header from '$components/layouts/Header';
	import VerificationModal from '$components/modules/VerificationModal.svelte';
	import NotificationModal from '$components/modules/NotificationModal.svelte';

	// BREADCRUMBS STATES
	const breadcrumbItems: BreadcrumbItem[] = [
		{ icon: 'ph-bold ph-user', label: 'Account', href: '/app/account' },
	];

	// TEMPORARY STATES
	const account: Account = {
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
		createdAt: Date.now(),
	};

	// STATES
	let files: FileList,
		firstName = account.firstName,
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
	let selectedImage: string | ArrayBuffer | null = null;
	let modals = {
		confirmation: false,
	};

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
	const handleSave = async () => {
		try {
			if (
				[
					files,
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

<Header {breadcrumbItems} />

{#if modals.confirmation}
	<VerificationModal
		{...{ handleProceed: handleSave, handleClose: () => (modals.confirmation = false) }}
	/>
{/if}

{#if error}
	<NotificationModal message={error} handleClose={() => (error = '')} />
{/if}

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
		</div>
		<hr />
		<div class="flex items-center justify-end gap-4">
			<Button size="sm" color="alternative" on:click={handleReset}>Reset</Button>
			<Button size="sm" on:click={() => (modals.confirmation = true)}>Save</Button>
		</div>
	</form>
</div>
