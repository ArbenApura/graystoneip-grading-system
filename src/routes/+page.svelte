<script lang="ts">
	// IMPORTED ASSETS
	import LogoPNG from '$assets/images/logo.png';
	// IMPORTED LIB-COMPONENTS
	import { FloatingLabelInput, Button, Badge } from 'flowbite-svelte';
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
			<form class="bg-white rounded-md shadow-md p-4 flex flex-col w-full h-fit">
				<div class="flex flex-col gap-4">
					<div class="flex gap-2 items-center">
						<Badge class="aspect-square p-2"><i class="ti ti-key text-[18px]" /></Badge>
						<p class="text-lg">Login Panel</p>
					</div>
					<FloatingLabelInput style="outlined" type="email" label="Email" />
					<FloatingLabelInput style="outlined" type="password" label="Password" />
				</div>
				<span class="mt-2 mb-4 text-right">
					<a class="text-xs text-link" href="/">Forgot password?</a>
				</span>
				<a href="/app/dashboard"><Button class="w-full">Login</Button></a>
			</form>
		</div>
	</div>
</div>
