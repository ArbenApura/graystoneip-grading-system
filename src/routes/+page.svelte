<script lang="ts">
	// IMPORTED ASSETS
	import LogoPNG from '$assets/images/logo.png';
	// IMPORTED LIB-UTILS
	import { goto } from '$app/navigation';
	// IMPORTED UTILS
	import { createErrorModal, createRecoveryModal, createSuccessModal } from '$stores/modalStates';
	import { validateEmail } from '$utils/helpers';
	// IMPORTED LIB-COMPONENTS
	import { FloatingLabelInput, Button, Badge, Spinner } from 'flowbite-svelte';
	import { login } from '$stores/authStates';

	// STATES
	let email: string, password: string;
	let isLoading = false;

	// UTILS
	const handleLogin = async () => {
		isLoading = true;
		try {
			if (!email || !password) throw new Error('The form is incomplete!');
			if (!validateEmail(email)) throw new Error('The provided email is invalid!');
			await login(email, password);
			setTimeout(() => createSuccessModal({ message: 'Logined successfully!' }));
		} catch (error: any) {
			createErrorModal({ message: error.message });
		}
		isLoading = false;
	};
</script>

<div class="min-h-screen lg:flex items-center justify-center p-4">
	<div class="grid grid-cols-1 lg:grid-cols-5 gap-8">
		<div class="lg:col-span-3 flex sm:justify-center items-center gap-4 p-0 sm:p-4">
			<img
				class="w-[50px] sm:w-[80px] md:w-[120px] lg:w-[250px] rounded-full shadow-md"
				src={LogoPNG}
				alt=""
			/>
			<p class="text-base sm:text-2xl xl:text-4xl">Graystone Institute of the Philippines</p>
		</div>
		<div class="min-h-[calc(100vh-177px)] sm:min-h-fit lg:col-span-2 flex-center">
			<form
				class="bg-white rounded-md shadow-md p-4 flex flex-col w-full h-fit"
				on:submit|preventDefault={handleLogin}
			>
				<div class="flex flex-col gap-4">
					<div class="flex gap-2 items-center">
						<Badge class="aspect-square p-2"><i class="ti ti-key text-[18px]" /></Badge>
						<p class="text-lg">Login Panel</p>
					</div>
					<FloatingLabelInput
						style="outlined"
						type="email"
						label="Email"
						bind:value={email}
					/>
					<FloatingLabelInput
						style="outlined"
						type="password"
						label="Password"
						bind:value={password}
					/>
				</div>
				<span class="mt-2 mb-4 text-right">
					<button class="text-xs text-link" type="button" on:click={createRecoveryModal}>
						Forgot password?
					</button>
				</span>
				<Button class="w-full" type="submit" disabled={isLoading}>
					{#if isLoading}
						<Spinner class="mr-3" size="4" color="white" />Loading ...
					{:else}
						Login
					{/if}
				</Button>
			</form>
		</div>
	</div>
</div>
