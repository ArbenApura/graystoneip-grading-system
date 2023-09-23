<script lang="ts">
	// IMPORTED TYPES
	import type { Column } from './types';
	// IMPORTED LIB-UTILS
	import { DropdownMenu, Button } from '$lib';

	// PROPS
	export let columns: Column[];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button class="shadow-md flex-center gap-2" variant="outline" size="icon">
			<i class="ph-bold ph-table text-xl" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-[200px]">
		<DropdownMenu.Group>
			<DropdownMenu.Label class="text-center">Columns</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{#each columns as column}
				<DropdownMenu.CheckboxItem bind:checked={column.visible}>
					{column.label}
				</DropdownMenu.CheckboxItem>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
