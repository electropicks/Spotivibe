import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

import type {Database} from '@/lib/database.types'
import {addSongVibesToTable, getSongVibes} from "@/app/actions/actions";

export async function GET(request: Request) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    // Fetch all songs
    const { data: allSongs, error: allSongsError } = await supabase
        .from('song_feature')
        .select(`* , song: song (name, artist, spotify_id, album)`);

    // Fetch all songs from song_vibe
    const { data: cachedSongs, error: cachedSongsError } = await supabase
        .from('song_vibe')
        .select(`*, song: song (name, artist, spotify_id, album)`);

    if (allSongsError || cachedSongsError) {
        console.error("Error fetching songs:", allSongsError || cachedSongsError);
        return new NextResponse(JSON.stringify({ error: (allSongsError || cachedSongsError)!.message }), { status: 500 });
    }

    console.log(allSongs.length, "songs in song_feature");
    // console.log(allSongs[0]);
    console.log(cachedSongs.length, "songs in song_vibe");
    // console.log(cachedSongs[0]);
    // Flatten the structure of each song object
    const flattenedSongs = allSongs.map(song => {
        return {
        ...song, // spread all properties of the song object
        name: song.song.name, // add the name from the nested song object
        artists: song.song.artist ? [{ name: song.song.artist }] : [], // ensure artists is an array
        album: { name: song.song.album} ?? {name: "N/A"},
        id: song.song.spotify_id,
    };});
    console.log(flattenedSongs.length, "flattened songs in song_feature");
    const flattenedCachedSongs = cachedSongs.map(song => ({
        ...song, // spread all properties of the song object
        name: song.song.name, // add the name from the nested song object
        artists: song.song.artist ? [{ name: song.song.artist }] : [], // ensure artists is an array
        album: { name: song.song.album} ?? {name: "N/A"},
        id: song.song.spotify_id,
    }));
    console.log(flattenedCachedSongs.length, "flattened songs in song_vibe");

    // Filter songs that are not in song_vibe
    const missingSongs = flattenedSongs.filter(song => !flattenedCachedSongs.some(cachedSong => cachedSong.spotify_id === song.spotify_id)) as VibedTrack[];
    console.log(missingSongs.length, "songs missing from song_vibe");

    const songVibes = await getSongVibes(missingSongs.slice(0,15)) as SongVibes[];

    // Insert missing songs into song_vibe
    await addSongVibesToTable(songVibes);

    // Return the missing songs with a status of 200
    return new NextResponse(missingSongs.length.toString(), { status: 200 });
}

