'use client'
import { extendTheme } from '@mui/joy/styles';


declare module '@mui/joy/styles' {
    interface PaletteBackgroundOverrides {
        level1: false;
    }
    interface PaletteCommonOverrides {
        black: false;
    }
}


const theme = extendTheme({
    "colorSchemes": {
        "light": {
            "palette": {
                "primary": {
                    "50": "#f0fdf4",
                    "100": "#dcfce7",
                    "200": "#bbf7d0",
                    "300": "#86efac",
                    "400": "#4ade80",
                    "500": "#22c55e",
                    "600": "#16a34a",
                    "700": "#15803d",
                    "800": "#166534",
                    "900": "#14532d"
                },
                "neutral": {
                    "50": "#eceff1",
                    "100": "#cfd8dc",
                    "200": "#b0bec5",
                    "300": "#90a4ae",
                    "400": "#78909c",
                    "500": "#607d8b",
                    "600": "#546e7a",
                    "700": "#455a64",
                    "800": "#37474f",
                    "900": "#263238"
                },
                "common": {
                    "black": undefined
                },
                "background": {
                    "level1": undefined
                },
                "danger": {
                    "50": "#ffebee",
                    "100": "#ffcdd2",
                    "200": "#ef9a9a",
                    "300": "#e57373",
                    "400": "#ef5350",
                    "500": "#f44336",
                    "600": "#e53935",
                    "700": "#d32f2f",
                    "800": "#c62828",
                    "900": "#b71c1c"
                },
                "success": {
                    "50": "#eff6ff",
                    "100": "#dbeafe",
                    "200": "#bfdbfe",
                    "300": "#93c5fd",
                    "400": "#60a5fa",
                    "500": "#3b82f6",
                    "600": "#2563eb",
                    "700": "#1d4ed8",
                    "800": "#1e40af",
                    "900": "#1e3a8a"
                },
                "warning": {
                    "50": "#fefce8",
                    "100": "#fef9c3",
                    "200": "#fef08a",
                    "300": "#fde047",
                    "400": "#facc15",
                    "500": "#eab308",
                    "600": "#ca8a04",
                    "700": "#a16207",
                    "800": "#854d0e",
                    "900": "#713f12"
                }
            }
        },
        "dark": {
            "palette": {}
        }
    }
})

export default theme;