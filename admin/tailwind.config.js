/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef3e6',
                    100: '#fde7cd',
                    200: '#fbcf9b',
                    300: '#f9b769',
                    400: '#f79f37',
                    500: '#f58705',
                    600: '#c46c04',
                    700: '#935103',
                    800: '#623602',
                    900: '#311b01',
                },
            },
        },
    },
    plugins: [],
}

