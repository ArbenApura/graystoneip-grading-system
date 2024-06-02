// TYPES
export type SortType = 'none' | 'asc' | 'desc';
export type SortItem = {
	name: string;
	label: string;
	type: SortType;
};
export type FilterItem = {
	label: string;
	match: string;
	active: boolean;
};
export type FilterGroup = {
	label: string;
	name: string;
	items: FilterItem[];
};
export type Column = {
	name: string;
	label: string;
	visible: boolean;
};
export type ColumnItem = {
	name: string;
	label: string;
	value: string;
};
export type RowTool = {
	label: string;
	icon: string;
	handleClick?: () => void;
	href?: string;
};
export type RowItem = {
	columnItems: ColumnItem[];
	tools: RowTool[];
	href?: string;
};
export type TableTool = {
	icon: string;
	handleClick: () => void;
};
