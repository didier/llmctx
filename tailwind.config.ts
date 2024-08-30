import { fontFamily } from 'tailwindcss/defaultTheme'
import type { Config } from 'tailwindcss'

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['var(--font-sans)', ...fontFamily.sans]
			},
			fontSize: {
				xs: [
					'0.6875rem',
					{
						lineHeight: 'calc(2px + 2ex + 2px)',
						letterSpacing: '0.005em',
						fontWeight: '500'
					}
				],
				sm: [
					'0.75rem',
					{
						lineHeight: 'calc(2px + 2ex + 2px)',
						letterSpacing: '0em',
						fontWeight: '500'
					}
				],
				base: [
					'1rem',
					{
						lineHeight: 'calc(2px + 2ex + 2px)',
						letterSpacing: '-0.011em',
						fontWeight: '500'
					}
				],
				lg: [
					'1.3125rem',
					{
						lineHeight: 'calc(2px + 2ex + 2px)',
						letterSpacing: '-0.018em',
						fontWeight: '500'
					}
				],
				xl: [
					'1.6875rem',
					{
						lineHeight: 'calc(2px + 2ex + 2px)',
						letterSpacing: '-0.021em',
						fontWeight: '500'
					}
				],
				'2xl': [
					'2.1875rem',
					{
						lineHeight: 'calc(2px + 2ex + 2px)',
						letterSpacing: '-0.022em',
						fontWeight: '700'
					}
				],
				'3xl': [
					'2.875rem',
					{
						lineHeight: 'calc(2px + 2ex + 2px)',
						letterSpacing: '-0.022em',
						fontWeight: '700'
					}
				]
			}
		}
	}
}

export default config
