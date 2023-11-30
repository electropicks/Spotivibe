import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

import type {Database} from '@/lib/database.types'
import {getPlaylistTracks, processSongs} from "@/app/actions/actions";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const requestParams = requestUrl.searchParams;
    const playlistId = requestParams.get("playlist_id");

    console.log("Processing playlist songs");
    const tracks = await getPlaylistTracks(playlistId ?? "");
    await processSongs(tracks);

    console.log("Done processing playlist songs");
    return new NextResponse("Success", {status: 200});
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
