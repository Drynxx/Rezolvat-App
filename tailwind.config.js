/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#05080E',
          900: '#080C14',
          850: '#0B0F19',
          800: '#111624',
          750: '#181F33'
        },
        emerald: {
          glow: '#10B981',
          accent: '#34D399'
        },
        cyan: {
          glow: '#06B6D4',
          accent: '#38BDF8'
        },
        indigo: {
          brand: '#6366F1',
          brandHover: '#4F46E5'
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Outfit', 'Inter', '-apple-system', 'sans-serif']
      },
      borderRadius: {
        '2.5xl': '20px',
        '3xl': '24px',
        '4xl': '32px'
      },
      boxShadow: {
        'glass-glow': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'emerald-glow': '0 0 25px -4px rgba(16, 185, 129, 0.4)',
        'cyan-glow': '0 0 25px -4px rgba(6, 182, 212, 0.4)',
        'indigo-glow': '0 0 25px -4px rgba(99, 102, 241, 0.5)',
        'dock-floating': '0 20px 40px -10px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)'
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
