import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

import type {Database} from '@/lib/database.types'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({cookies: () => cookieStore})

    const {data} = await supabase.auth.signInWithOAuth(
        {
            provider: 'spotify',
            options: {
                redirectTo: `${requestUrl.origin}/auth/callback`,
                scopes: "user-read-recently-played" +
                    " user-read-playback-state" +
                    " user-top-read" +
                    " user-modify-playback-state" +
                    " user-read-currently-playing" +
                    " user-follow-read playlist-read-private" +
                    " user-read-email" +
                    " user-read-private" +
                    " user-library-read" +
                    " playlist-read-collaborative"
            }
        }
    )

    const redirectURL = data.url!;

    return NextResponse.redirect(redirectURL)

}