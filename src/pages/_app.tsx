import {SessionProvider} from "next-auth/react"

import type {AppProps} from "next/app"
import type {Session} from "next-auth"
import Head from "next/head"
import {CssVarsProvider} from "@mui/joy/styles"
import Sheet from "@mui/joy/Sheet"

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({
                                Component,
                                pageProps: {session, ...pageProps},
                            }: AppProps<{ session: Session }>) {
    return (
        <>
            <Head>
                <title>Spotivibe</title>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <meta name="viewport" content="initial-scale=1, width=device-width"/>
            </Head>
            <CssVarsProvider>
                <SessionProvider session={session}>
                    <Component {...pageProps} />
                </SessionProvider>
            </CssVarsProvider>
        </>
    )
}