<script lang="ts">
	// IMPORTED TYPES
	import type { SortItem } from './types';
	// IMPORTED LIB-UTILS
	import { DropdownMenu, Button } from '$lib';

	// PROPS
	export let sortItems: SortItem[];

	// UTILS
	const handleReset = () =>
		(sortItems = sortItems.map((sortItem) => {
			sortItem.type = 'none';
			return sortItem;
		}));
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		<Button class="shadow-md flex-center gap-2" variant="outline" size="icon">
			<i class="ph-bold ph-funnel text-xl" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label class="text-center">Sort</DropdownMenu.Label>
			<DropdownMenu.Separator />
			{#each sortItems as sortItem}
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<i class="ph-bold ph-dots-three mr-3" />
						{sortItem.label}
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<DropdownMenu.RadioGroup bind:value={sortItem.type}>
							<DropdownMenu.RadioItem value="none" on:click={handleReset}>
								None
							</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="asc" on:click={handleReset}>
								Ascending
							</DropdownMenu.RadioItem>
							<DropdownMenu.RadioItem value="desc" on:click={handleReset}>
								Descending
							</DropdownMenu.RadioItem>
						</DropdownMenu.RadioGroup>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
