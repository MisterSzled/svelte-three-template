/** @type {import('tailwindcss').Config} */
export default {
        content: ['./src/**/*.{html,js,svelte,ts}'],
        theme: {
                extend: {
                        colors: {
                                'vampire': '#0d0208',
                                'darkgreen': '#003b00',
                                'islamic': '#008f11',
                                'malachite': '#00ff41',
                        },
                        boxShadow: {
                                glow: "0px 0px 10px 5px rgba(0,255,64,0.9);"
                        },

                }
        },
        plugins: []
};