<script lang="ts">
	// IMPORTED COMPONENTS
	import SummarySection from './SummarySection.svelte';
	import NewInstructorSection from './NewInstructorSection.svelte';
	import NewEntriesSection from './NewEntriesSection.svelte';
</script>

<div class="flex flex-col gap-4 p-4 pt-0">
	<SummarySection />
	<div class="grid grid-cols-1 xl:grid-cols-6 gap-4">
		<div class="col-span-1 xl:col-span-4 items-stretch">
			<NewInstructorSection />
		</div>
		<div class="col-span-1 xl:col-span-2 flex items-stretch">
			<NewEntriesSection />
		</div>
	</div>
</div>
