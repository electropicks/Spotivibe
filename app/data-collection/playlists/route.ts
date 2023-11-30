import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

import type {Database} from '@/lib/database.types'
import {getPlaylistTracks, processNewSongs} from "@/app/actions/actions";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url);
    const requestParams = requestUrl.searchParams;
    const playlistId = requestParams.get("playlist_id");

    const tracks = await getPlaylistTracks(playlistId ?? "");
    await processNewSongs(tracks);
    // let index = 10;
    // let leftover = await processNewSongs(tracks.slice(index - 10, index));
    //
    // for (; index < tracks.length || leftover.length > 0; index += 10) {
    //     console.log("Processing songs from index " + (index - 10) + " to " + index);
    //     leftover = await processNewSongs(tracks.slice(index - 10, index));
    //
    //     // Wait for 1 second before processing the next batch
    //     await delay(500);
    // }

    console.log("Done processing playlist songs");
    return new NextResponse("Success", {status: 200});
}

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
