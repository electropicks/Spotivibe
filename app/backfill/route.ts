import {createRouteHandlerClient} from '@supabase/auth-helpers-nextjs'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

import type {Database} from '@/lib/database.types'
import {addSongVibesToTable, getSongVibes} from "@/app/actions/actions";

export async function GET() {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });

    // Fetch all songs
    const { data: allSongs, error: allSongsError } = await supabase
        .from('song_features')
        .select(`* , song: song (name, artist, spotify_id)`);

    // Fetch all songs from song_vibes
    const { data: cachedSongs, error: cachedSongsError } = await supabase
        .from('song_vibes')
        .select(`*, song: song (name, artist, spotify_id)`);

    if (allSongsError || cachedSongsError) {
        console.error("Error fetching songs:", allSongsError || cachedSongsError);
        return new NextResponse(JSON.stringify({ error: (allSongsError || cachedSongsError)!.message }), { status: 500 });
    }

    console.log(allSongs.length, "songs in song_features");
    console.log(allSongs[0]);
    console.log(cachedSongs.length, "songs in song_vibes");
    console.log(cachedSongs[0]);
    // Flatten the structure of each song object
    const flattenedSongs = allSongs.map(song => ({
        ...song, // spread all properties of the song object
        name: song.song.name, // add the name from the nested song object
        artists: song.song.artist ? [{ name: song.song.artist }] : [], // ensure artists is an array
        album: { name: song.song.album_name },
        id: song.song.spotify_id,
    }));
    const flattenedCachedSongs = cachedSongs.map(song => ({
        ...song, // spread all properties of the song object
        name: song.song.name, // add the name from the nested song object
        artists: song.song.artist ? [{ name: song.song.artist }] : [], // ensure artists is an array
        album: { name: song.song.album_name },
        id: song.song.spotify_id,
    }));

    // Filter songs that are not in song_vibes
    const missingSongs = flattenedSongs.filter(song => !flattenedCachedSongs.some(cachedSong => cachedSong.spotify_id === song.spotify_id)) as VibedTrack[];
    console.log(missingSongs.length, "songs missing from song_vibes");
    console.log(missingSongs[0]);

    const songVibes = await getSongVibes(missingSongs.slice(0,40)) as SongVibes[];

    // Insert missing songs into song_vibes
    await addSongVibesToTable(songVibes);

    // Return the missing songs with a status of 200
    return new NextResponse(missingSongs.length.toString(), { status: 200 });
}

