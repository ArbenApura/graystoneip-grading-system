<script>
	// IMPORTED ASSETS
	import LogoPNG from '$assets/images/logo.png';
</script>

<div class="bg-white rounded-md shadow-md p-6 flex flex-col gap-4">
	<div class="flex items-center flex-col lg:flex-row gap-4 lg:gap-0">
		<div class="flex items-center gap-4 flex-grow">
			<img class="w-[50px]" src={LogoPNG} alt="" />
			<p>Graystone Institute of the Philippines</p>
		</div>
		<div
			class="w-full text-center text-xs text-gray-500 grid grid-rows-2 grid-cols-2 sm:flex sm:gap-4 sm:w-fit"
		>
			<a href="/app/resources/privacy-policy">Privacy Policy</a>
			<a href="/app/resources/terms-and-conditions">Terms & Conditions</a>
		</div>
	</div>
	<hr />
	<p class="text-center text-xs text-gray-500">
		© 2023 Graystone Institute of the Philippines | All Rights Reserved.
	</p>
</div>

<style lang="scss">
	a {
		@apply hover:underline;
	}
</style>
