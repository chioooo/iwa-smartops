/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                background: "#ffffff",
                foreground: "#111111",

                primary: "var(--primary)",
                "primary-dark": "var(--primary-dark)",
                "accent-orange": "var(--accent-orange)",
                "accent-gold": "var(--accent-gold)",
                "accent-yellow": "var(--accent-yellow)",
            },
        },
    },
    plugins: [],
};
