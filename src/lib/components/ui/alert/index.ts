import { tv, type VariantProps } from 'tailwind-variants';

import Root from './alert.svelte';
import Description from './alert-description.svelte';
import Title from './alert-title.svelte';

export const alertVariants = tv({
	base: 'relative w-full rounded-lg border p-4 [&>svg]:absolute [&>svg]:text-foreground [&>svg]:left-4 [&>svg]:top-4 [&>svg+div]:translate-y-[-3px] [&:has(svg)]:pl-11',
	variants: {
		variant: {
			info: 'bg-cyan-600 text-white [&>svg]:text-cyan-600 border-cyan-700',
			success: 'bg-emerald-600 text-white [&>svg]:text-emerald-600 border-emerald-700',
			error: 'bg-rose-600 text-white [&>svg]:text-rose-600 border-rose-700',
			warning: 'bg-amber-500 text-white [&>svg]:text-amber-500 border-amber-600',
		},
	},
	defaultVariants: {
		variant: 'info',
	},
});

export type Variant = VariantProps<typeof alertVariants>['variant'];
export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export {
	Root,
	Description,
	Title,
	//
	Root as Alert,
	Description as AlertDescription,
	Title as AlertTitle,
};
