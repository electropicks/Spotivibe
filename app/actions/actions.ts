'use server'

import {getTopArtistsResponse} from "@/lib/spotify.types";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {createServerActionClient} from "@supabase/auth-helpers-nextjs";
import OpenAI from "openai";
import {ThreadCreateParams} from "openai/resources/beta";
import {serializeTrackIds} from "@/lib/utils";

const openai = new OpenAI();

export async function getSongVibes(songTitle: string, songArtist: string) {
    const assistantId = "asst_CmJ0Jv9E7T4BIFCIz8zqf1Tr";
    // const assistant = await openai.beta.assistants.retrieve(assistantId);
    const messages: ThreadCreateParams.Message[] = [{"role": "user", "content": songTitle + " by " + songArtist}];
    let run = await openai.beta.threads.createAndRun({
        assistant_id: assistantId,
        thread: {
            messages: messages
        }
    });
    while (run.status !== "completed") {
        await new Promise(r => setTimeout(r, 1000));
        run = await openai.beta.threads.runs.retrieve(run.thread_id, run.id);
        console.log(run.status)
        if (run.status === "requires_action") {
            const tool_call = run.required_action!.submit_tool_outputs.tool_calls[0];
            await openai.beta.threads.runs.submitToolOutputs(run.thread_id, run.id, {
                tool_outputs: [
                    {
                        tool_call_id: tool_call.id,
                        output: "Songs Lyrics..."
                    }
                ]
            })

        }
    }
    const newMessages= (await openai.beta.threads.messages.list(run.thread_id)).getPaginatedItems();
    console.log(newMessages);
    console.table(newMessages);
    console.log(newMessages[0].content);
    console.log(newMessages[1].content);
}

export async function getSpotifyToken() {
    const supabase = createServerActionClient<Database>({cookies: () => cookies()});
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        redirect('/login')
    }
    const providerToken = session.provider_token;
    if (!providerToken) {
        redirect('/login')
    }
    return {providerToken};
}

export async function mergeTrackFeatures(tracks: Track[]) {
    const {providerToken} = await getSpotifyToken();
    const trackIds = serializeTrackIds(tracks);
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${providerToken}`);
    const apiURL = `https://api.spotify.com/v1/audio-features?ids=${trackIds}`;
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: headers,
    })
    if (response.status === 401) {
        redirect('/login')
    }
    if (response.status === 400) {
        console.log(response)
    }
    const featuresResponse = await response.json();
    const trackFeatures = featuresResponse.audio_features as AudioFeatures[];
    return tracks.map((track): VibedTrack => {
        const trackFeature = trackFeatures.find((feature) => feature.id === track.id);
        return {
            ...track,
            acousticness: trackFeature?.acousticness ?? 0,
            danceability: trackFeature?.danceability ?? 0,
            energy: trackFeature?.energy ?? 0,
            instrumentalness: trackFeature?.instrumentalness ?? 0,
            key: trackFeature?.key ?? 0,
            liveness: trackFeature?.liveness ?? 0,
            mode: trackFeature?.mode ?? 0,
            speechiness: trackFeature?.speechiness ?? 0,
            tempo: trackFeature?.tempo ?? 0,
            time_signature: trackFeature?.time_signature ?? 0,
            valence: trackFeature?.valence ?? 0,
            analysis_url: trackFeature?.analysis_url ?? "",
            loudness: trackFeature?.loudness ?? 0,
            track_href: trackFeature?.track_href ?? "",
        }
    });
}

export async function getUserTopTracks(limit: number, time_range: string) {
    const {providerToken} = await getSpotifyToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${providerToken}`);
    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('time_range', time_range);

    const apiURL = `https://api.spotify.com/v1/me/top/tracks?${params.toString()}`;
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: headers,
    })
    if (response.status === 401) {
        redirect('/login')
    }
    if (response.status === 400) {
        console.log(response)
    }

    const trackResponse = await response.json() as getTopTracksResponse

    return trackResponse.items as Track[];
}

export async function getUserTopArtists(limit: number, time_range: string) {
    const {providerToken} = await getSpotifyToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${providerToken}`);

    const params = new URLSearchParams();
    params.append('limit', limit.toString());
    params.append('time_range', time_range);

    const apiURL = `https://api.spotify.com/v1/me/top/artists?${params.toString()}`;
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: headers,
    })
    if (response.status === 401) {
        redirect('/login')
    }
    if (response.status === 400) {
        console.log(response)
    }

    const artistsResponse = await response.json() as getTopArtistsResponse;
    return artistsResponse.items as Artist[];
}

export async function addSongsToTable(songs: VibedTrack[]) {
    const supabase = createServerActionClient<Database>({cookies: () => cookies()});

    // Insert into song_features and retrieve inserted ids
    const { data: featuresData, error: error1 } = await supabase
        .from('song_features')
        .upsert(songs.map(song => ({
            acousticness: song.acousticness,
            danceability: song.danceability,
            energy: song.energy,
            instrumentalness: song.instrumentalness,
            key: song.key,
            liveness: song.liveness,
            speechiness: song.speechiness,
            tempo: song.tempo,
            valence: song.valence,
            duration_ms: song.duration_ms,
            loudness: song.loudness,
            major: song.mode === 1,
            time_signature: song.time_signature,
            track_href: song.track_href,
            uri: song.uri,
            popularity: song.popularity,
            spotify_id: song.id // Assuming 'id' is the Spotify ID
            // song_id is not included here as it's a foreign key to 'song' table
        })), { onConflict: 'spotify_id' })
        .select('id, spotify_id'); // select id for foreign key reference

    if (error1) {
        console.error(error1);
        return; // handle the error appropriately
    }

    // Prepare song data with song_features_id
    const songsData = songs.map(song => {
        const featureId = featuresData.find(f => f.spotify_id === song.id)?.id;
        return {
            title: song.name, // Assuming 'name' is the title of the song in VibedTrack
            artist: song.artists[0].name, // Assuming the first artist's name
            album: song.album.name, // Assuming 'album' has a 'name' property
            song_features_id: featureId,
            spotify_id: song.id // Again, assuming 'id' is the Spotify ID
        };
    });

    // Insert into song
    const { error: error2 } = await supabase
        .from('song')
        .upsert(songsData, { onConflict: 'spotify_id' });

    if (error2) {
        console.error(error2);
        // Handle error - consider rolling back song_features insertion if necessary
    }

    return featuresData; // or appropriate return value
}


