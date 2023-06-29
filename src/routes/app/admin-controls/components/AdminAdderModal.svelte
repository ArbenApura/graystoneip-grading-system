<script lang="ts">
	// IMPORTED ASSETS
	import NoImagePNG from '$assets/images/no-image.png';
	// IMPORTED LIB-COMPONENTS
	import {
		Button,
		Modal,
		FloatingLabelInput,
		Fileupload,
		Badge,
		Select,
		Label,
	} from 'flowbite-svelte';
	// IMPORTED COMPONENTS
	import NotificationModal from '$components/modules/NotificationModal.svelte';

	// PROPS
	export let handleClose: () => void;

	// STATES
	let files: FileList,
		firstName: string,
		lastName: string,
		middleName: string,
		gender: string,
		birthDate: string,
		contactNo: string,
		address: string,
		email: string,
		password: string,
		repassword: string;
	let error: string;
	let selectedImage: string | ArrayBuffer | null = null;

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
		firstName = '';
		lastName = '';
		middleName = '';
		gender = '';
		birthDate = '';
		contactNo = '';
		address = '';
		email = '';
		password = '';
		repassword = '';
	};
	const handleProceed = () => {
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

<Modal open={true} permanent={true} class="w-full" size="lg">
	<svelte:fragment slot="header">
		<div class="w-full flex items-center gap-4">
			<Badge class="aspect-plus p-2"><i class="ti ti-plus text-[18px]" /></Badge>
			<p class="text-xl text-black flex-grow">Add Admin</p>
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
