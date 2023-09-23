import Root from './button.svelte';
import { tv, type VariantProps } from 'tailwind-variants';

export const buttonVariants = tv({
	base: 'inline-flex items-center justify-center rounded-md text-sm font-semibold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	variants: {
		variant: {
			default: 'bg-primary text-primary-foreground hover:bg-primary/90',
			destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
			outline:
				'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
			secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
			ghost: 'hover:bg-accent hover:text-accent-foreground',
			link: 'underline-offset-4 hover:underline',
			info: 'border border-cyan-700 bg-cyan-500 text-cyan-800 hover:bg-cyan-600',
			success:
				'border border-emerald-700 bg-emerald-500 text-emerald-800 hover:bg-emerald-600',
			error: 'border border-rose-700 bg-rose-500 text-rose-800 hover:bg-rose-600',
			warning: 'border border-amber-600 bg-amber-400 text-amber-600 hover:bg-amber-500',
		},
		size: {
			default: 'h-10 px-4 py-2',
			sm: 'h-9 rounded-md px-3',
			lg: 'h-11 rounded-md px-8',
			icon: 'h-10 w-10',
		},
	},
	defaultVariants: {
		variant: 'default',
		size: 'default',
	},
});

export type Variant = VariantProps<typeof buttonVariants>['variant'];
export type Size = VariantProps<typeof buttonVariants>['size'];

export {
	Root,
	//
	Root as Button,
};
