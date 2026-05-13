/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
        extend: {
                borderRadius: {
                        lg: 'var(--radius)',
                        md: 'calc(var(--radius) - 2px)',
                        sm: 'calc(var(--radius) - 4px)'
                },
                colors: {
                        background: 'hsl(var(--background))',
                        foreground: 'hsl(var(--foreground))',
                        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
                        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
                        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
                        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
                        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
                        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
                        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
                        border: 'hsl(var(--border))',
                        input: 'hsl(var(--input))',
                        ring: 'hsl(var(--ring))',
                        // === MUK BUDDY DTC PALETTE (LIGHT MODE) ===
                        cream: {
                                DEFAULT: '#FFF4D6',   // main warm cream bg
                                50:  '#FFFDF6',
                                100: '#FFF9E8',
                                200: '#FFF4D6',
                                300: '#FDEAB4',
                                400: '#F9DD8D',
                                500: '#F0C95E',
                        },
                        ink: {
                                DEFAULT: '#1A0625',   // deep purple-black for text/borders
                                50:  '#EFEAF3',
                                100: '#D5CADF',
                                500: '#5A4A72',
                                700: '#2A0A3F',
                                900: '#1A0625',
                        },
                        slime: {
                                DEFAULT: '#39FF14',
                                50:  '#E8FFE0',
                                100: '#CFFFC2',
                                200: '#A3FF85',
                                300: '#72FF4F',
                                400: '#39FF14',
                                500: '#2BE600',
                                600: '#21B300',
                                700: '#178000',
                        },
                        muk: {
                                DEFAULT: '#7A6FE0',   // brand purple
                                50:  '#F1EFFB',
                                100: '#E3DFF7',
                                200: '#C6BFEF',
                                300: '#A99FE7',
                                400: '#8C7FDF',
                                500: '#7A6FE0',
                                600: '#5A4EC7',
                                700: '#433A99',
                                800: '#2C266B',
                                900: '#15123D',
                        },
                        bubblegum: '#FFB3D9',   // playful accent pink
                        bleed: {
                                DEFAULT: '#FF1F2D',   // bright alarm red for live bleed counter
                                400: '#FF4855',
                                500: '#FF1F2D',
                                600: '#E60018',
                        },
                        chart: {
                                '1': 'hsl(var(--chart-1))',
                                '2': 'hsl(var(--chart-2))',
                                '3': 'hsl(var(--chart-3))',
                                '4': 'hsl(var(--chart-4))',
                                '5': 'hsl(var(--chart-5))'
                        }
                },
                keyframes: {
                        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
                        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
                        'wobble': { '0%, 100%': { transform: 'rotate(-2deg)' }, '50%': { transform: 'rotate(2deg)' } },
                        'peek': { '0%, 100%': { transform: 'translateY(6px) rotate(-3deg)' }, '50%': { transform: 'translateY(-6px) rotate(3deg)' } },
                        'bounce-slow': { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-14px)' } },
                        'spin-slow': { '0%': { transform: 'rotate(0)' }, '100%': { transform: 'rotate(360deg)' } }
                },
                animation: {
                        'accordion-down': 'accordion-down 0.2s ease-out',
                        'accordion-up': 'accordion-up 0.2s ease-out',
                        'wobble': 'wobble 4s ease-in-out infinite',
                        'peek': 'peek 5s ease-in-out infinite',
                        'bounce-slow': 'bounce-slow 3.2s ease-in-out infinite',
                        'spin-slow': 'spin-slow 16s linear infinite'
                }
        }
  },
  plugins: [require("tailwindcss-animate")],
};
