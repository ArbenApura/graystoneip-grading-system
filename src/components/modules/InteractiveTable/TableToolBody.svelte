<script lang="ts">
	// IMPORTED TYPES
	import type { RowItem } from './types';
	// IMPORTED LIB-COMPONENTS
	import { Table, DropdownMenu, Button } from '$lib';

	// PROPS
	export let rowItem: RowItem, loading: boolean;
</script>

{#if rowItem.tools.length}
	<Table.Cell class="flex-center">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger disabled={loading}>
				<Button variant="outline" size="icon" disabled={loading}>
					<i class="ph-bold ph-dots-three text-base" />
				</Button>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.Label class="text-center">Tools</DropdownMenu.Label>
					<DropdownMenu.Separator />
					{#each rowItem.tools as tool}
						<a href={tool.href}>
							<DropdownMenu.Item
								on:click={() => tool.handleClick && tool.handleClick()}
							>
								<i class="{tool.icon} mr-2" />
								{tool.label}
							</DropdownMenu.Item>
						</a>
					{/each}
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Table.Cell>
{:else}
	<Table.Cell />
{/if}
