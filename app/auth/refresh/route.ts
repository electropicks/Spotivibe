import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

import type {Database} from '@/lib/database.types'

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({cookies: () => cookieStore})

    const {data} = await supabase.auth.refreshSession();
    console.log("Refreshing session...", data);

    return NextResponse.redirect(requestUrl);
}