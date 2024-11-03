/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
        "body": "#f1f5f9",
        "main": "#5d60ef",
        "main-hover": "#5d5fefcb",
        "main-purple": "#d5d6ff",
        "main-purple-hover": "#c7c8ff",
        "main-orange": "#F9791F",
        "main-yellow": "#FEF9E4",
        "main-yellow-hover": "#faecb8",
        "main-red": "#DA2850",
        "main-red-hover": "#d34053b9",
        "main-pink": "#FEE4E9",
        "main-pink-hover": "#ffcbd5",
        "main-gray-border": "#dadde7",
        "main-gray-border2": "#E8EBF4",
        "main-gray-text": "#5a5d66",
        "main-gray-text2": "#6E717B",
        "main-heading-text": "#464646",
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      boxShadow: {
        "default-black": "0 0 40px #00000030",
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

