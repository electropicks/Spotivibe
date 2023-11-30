import {CssVarsProvider} from '@mui/joy/styles';
import NavBar from '../components/NavBar';

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
        <div>
            <NavBar/>
        </div>
        <main>
            <CssVarsProvider>
                {children}
            </CssVarsProvider>
        </main>
        </body>
        </html>
    )
}
