import {CssVarsProvider} from '@mui/joy/styles'
import customTheme from "@/lib/theme";

export const metadata = {
    title: 'Spotivibe',
    description: 'The home for your music personality',
}

export const dynamic = 'force-dynamic'
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body>
        <main>
            <CssVarsProvider theme={customTheme}>
                {children}
            </CssVarsProvider>
        </main>
        </body>
        </html>
    )
}
