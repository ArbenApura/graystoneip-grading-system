<script lang="ts">
	// IMPORTED TYPES
	import type { FilterGroup } from './types';
	// IMPORTED LIB-COMPONENTS
	import { Button, DropdownMenu } from '$lib';

	// PROPS
	export let filterGroups: FilterGroup[];
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button class="shadow-md" variant="outline" size="icon">
			<i class="ph-bold ph-sliders text-xl" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="min-w-[200px]">
		<DropdownMenu.Group>
			<DropdownMenu.Label class="text-center">Filter</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{#each filterGroups as filterGroup}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<i class="ph-bold ph-dots-three mr-3" />
						{filterGroup.label}
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#each filterGroup.items as item}
							<DropdownMenu.CheckboxItem bind:checked={item.active}>
								{item.label}
							</DropdownMenu.CheckboxItem>
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
