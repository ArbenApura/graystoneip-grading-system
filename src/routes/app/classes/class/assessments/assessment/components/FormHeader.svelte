<script lang="ts">
	// IMPORTED LIB-COMPONENTS
	import { Input, Textarea, Select, Label } from 'flowbite-svelte';

	// PROPS
	export let title: string, description: string, status: string;

	// CONSTANTS
	const STATUS_OPTIONS = [
		{ value: 'open', name: 'Open' },
		{ value: 'close', name: 'Close' },
	];
</script>

<div class="bg-white rounded-md shadow-md p-6 flex flex-col gap-4">
	<div class="flex flex-col gap-2">
		<Label for="title">Title</Label>
		<Input
			id="title"
			placeholder="Title..."
			color={!title ? 'red' : 'base'}
			bind:value={title}
		/>
		{#if !title}
			<small class="text-red-600">Title is required!</small>
		{/if}
	</div>
	<div class="flex flex-col gap-2">
		<Label for="description">Description</Label>
		<Textarea id="description" placeholder="Description..." rows="4" bind:value={description} />
	</div>
	<div class="flex flex-col gap-2">
		<Label for="status">Status</Label>
		<Select id="status" items={STATUS_OPTIONS} bind:value={status} />
	</div>
</div>
