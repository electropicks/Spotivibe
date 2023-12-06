'use server'

import {getTopArtistsResponse} from "@/lib/spotify.types";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {createServerActionClient} from "@supabase/auth-helpers-nextjs";
import OpenAI from "openai";
import {serializeTrackIds} from "@/lib/utils";
import {ChatCompletionMessageParam} from "openai/resources";
import {VibedTrack} from "@/lib/vibe.types";
import {backOff} from "exponential-backoff";

const openai = new OpenAI();

export async function getAiReccSongs(happy: number, sad: number, angry: number, calm: number,
energetic: number, uplifting: number){

    // Call to spotify API to get reccomended songs
    const headers = new Headers();
    console.log("getSongs:");
    console.log(happy);
    const {providerToken} = await getSpotifyToken();
    headers.append('Authorization', `Bearer ${providerToken}`);
    console.log(`https://api.spotify.com/v1/recommendations?limit=5&target_energy=${energetic}&target_loudness=${angry}&target_valence=${uplifting}`);
    //const apiURL = `https://api.spotify.com/v1/recommendations?limit=10&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=classical%2Ccountry&seed_tracks=0c6xIDDpzE81m2q797ordA&target_acousticness=${calm}&target_energy=${energetic}&target_loudness=${angry}&target_popularity=${uplifting}&target_speechiness=${sad}&target_valence=${happy}`;
    const apiURL = `https://api.spotify.com/v1/recommendations?limit=10&seed_genres=pop%2Cdance%2Ccountry%2Calternative%2Cclassical&target_acousticness=${calm}&target_energy=${energetic}&target_loudness=${angry}&target_valence=${happy}&target_speechiness=${sad}`;
    //&target_popularity=${uplifting}`;
    //&target_acousticness=${calm}`;
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: headers,
    })
    if (response.status === 401) {
        redirect('/login')
    }
    if (response.status === 400) {
        console.log(response)
        redirect('/logout')
    }
    const featuresResponse = await response.json();
    console.log(featuresResponse);
    return featuresResponse.tracks;
}

export async function processSongs(tracks: Track[]) {
    if (!tracks || tracks.length === 0) {
        return [];
    }
    const supabase = createServerActionClient<Database>({cookies: () => cookies()});
    console.log("Processing", tracks.length, "songs")
    if (tracks.length === 0) {
        return [];
    }
    const vibedTracks = await mergeTrackFeatures(tracks);
    const [uncachedTracks, cachedTracks] = await pruneCachedSongs(vibedTracks);
    const getVibesResponse = await supabase
        .from('song_vibes')
        .select('*')
        .in('spotify_id', cachedTracks.map(track => track.id));
    const cachedVibes = (getVibesResponse.data! ?? []) as SongVibes[];
    console.log(cachedVibes.length, "cached vibes");
    const uncachedVibes = await getSongVibes(uncachedTracks);
    console.log(uncachedVibes.length, "uncached vibes")
    await addSongsToTable(uncachedTracks);
    await addSongVibesToTable(uncachedVibes);
    return [...uncachedVibes, ...cachedVibes];
}

export async function getSongVibes(vibedTracks: VibedTrack[]) {
    console.log("Analyzing", vibedTracks.length, "tracks");

    let promptTokensUsed = 0;
    let completionTokensUsed = 0;
    let totalTokensUsed = 0;
    let songsAnalyzed = 0;
    // Function to process a single VibedTrack
    async function processTrack(vibedTrack: VibedTrack) {
        if (!vibedTrack.name || !vibedTrack.artists || vibedTrack.artists.length === 0) {
            throw new Error("Track name or artist is missing");
        }

        // Constructing the message content with more detailed information
        const trackInfo = {
            name: vibedTrack.name.slice(0, 16) + "...",
            artist: vibedTrack.artists[0].name.slice(0, 16) + "...",
            album: vibedTrack.album.name.slice(0, 16) + "...",
            acousticness: vibedTrack.acousticness,
            danceability: vibedTrack.danceability,
            energy: vibedTrack.energy,
            liveness: vibedTrack.liveness,
            loudness: vibedTrack.loudness,
            tempo: vibedTrack.tempo,
            valence: vibedTrack.valence,
            mode: vibedTrack.mode,
            instrumentalness: vibedTrack.instrumentalness,
            time_signature: vibedTrack.time_signature,
            key: vibedTrack.key,
            popularity: vibedTrack.popularity,
        };

        // Message to send to GPT-3.5
        const messages: ChatCompletionMessageParam[] = [
            {
                role: "system",
                content: "Analyze songs' sentiments: happy," +
                    " sad, energetic, calm, romantic, nostalgic," +
                    " angry, inspirational, uplifting, party, mysterious." +
                    " Score each 0-100 (int). Use provided song metadata." +
                    " Return ONLY sentiment scores as a SIMPLE json with no tab or newlines."
            },
            {
                role: "user",
                content: `${JSON.stringify(trackInfo)}`
            }
        ];

        let response;
        try {
            response = await backOff(() => openai.chat.completions.create({
                messages: messages,
                model: "gpt-3.5-turbo-1106",
                response_format: {type: "json_object"},
                max_tokens: 700,
            }), {
                numOfAttempts: 20, // Number of retry attempts
                startingDelay: 2000, // Initial delay in milliseconds
                timeMultiple: 2, // Multiplier for delay
                delayFirstAttempt: false, // Whether to delay the first attempt
                retry: (e, attemptNumber) => {
                    console.log(`Retry attempt number: ${attemptNumber}`);
                    return e.response?.status !== 200; // Retry only on rate limit errors
                }
            });
        } catch (error) {
            console.error('Error after retrying:', error);
            throw error; // Rethrow the error if all retries fail
        }

        promptTokensUsed += response.usage?.prompt_tokens ?? 0;
        completionTokensUsed += response.usage?.completion_tokens ?? 0;
        totalTokensUsed += response.usage?.total_tokens ?? 0;
        songsAnalyzed += 1;
        console.log("Prompt tokens used:", promptTokensUsed);
        console.log("Completion tokens used:", completionTokensUsed);
        console.log("Total tokens used:", totalTokensUsed);
        console.log("Songs analyzed:", songsAnalyzed);

        // console.log(response.choices[0].message);
        if (response.choices && response.choices.length > 0 && response.choices[0].message.content!) {
            return {
                ...JSON.parse(response.choices[0].message.content!),
                artist: vibedTrack.artists[0],
                name: vibedTrack.name,
                spotify_id: vibedTrack.id,
            } as SongVibes;
        } else {
            throw new Error("No response from GPT");
        }
    }
    console.log("Processing tracks")
    // Run all track processing in parallel
    const trackVibesPromises = vibedTracks.map(track => processTrack(track));
    console.log("Waiting for tracks to be processed");
    const trackVibes = await Promise.all(trackVibesPromises) as SongVibes[];
    console.log("Successfully analyzed", trackVibes.length, "tracks");
    return trackVibes;
}

export async function pruneCachedSongs(tracks: VibedTrack[]) {
    if (!tracks || tracks.length === 0) {
        return [];
    }
    console.log("Pruning cached songs from list of tracks");
    const supabase = createServerActionClient<Database>({cookies: () => cookies()});

    // Creating an array of spotify_ids from the tracks
    const spotifyIds = tracks.map(track => track.id);

    // Using a single query to get all the cached songs corresponding to the tracks
    const { data: filteredSongs, error } = await supabase
        .from('song_vibes')
        .select('spotify_id')
        .in('spotify_id', spotifyIds);  // Filtering based on spotify_ids

    if (error) {
        console.error("Error fetching cached songs:", error);
        throw error;
    }

    const uncachedTracks = tracks.filter(track => !filteredSongs.some(song => song.spotify_id === track.id));
    const cachedTracks = tracks.filter(track => filteredSongs.some(song => song.spotify_id === track.id));

    console.log("Uncached tracks:", uncachedTracks.length);

    return [uncachedTracks, cachedTracks];
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
    if (!tracks || tracks.length === 0) {
        return [];
    }
    console.log("Merging track features");
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
        redirect('/logout')
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
    console.log("Getting top tracks");
    const {providerToken} = await getSpotifyToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${providerToken}`);
    console.log(providerToken);
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

    const trackResponse = await response.json() as GetTopTracksResponse;
    if (!trackResponse.items) {
        redirect('/refresh');
    }

    return trackResponse.items as Track[];
}

export async function getUserTopArtists(limit: number, time_range: string) {
    console.log("Getting top artists");
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

export async function getPlaylistTracks(playlistId: string) {
    console.log("Getting tracks from playlist with id", playlistId);
    const {providerToken} = await getSpotifyToken();
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${providerToken}`);
    console.log("Calling spotify api");

    const apiURL = `https://api.spotify.com/v1/playlists/${playlistId}`;
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
    if (response.status === 404) {
        throw new Error("Playlist with id " + playlistId + " not found")
    }
    if (response.status !== 200) {
        console.log(response.status);
        throw new Error("Error fetching playlist tracks");
    }

    const playlistResponse = await response.json() as Playlist;
    const playlistTracks: PlaylistTrack[] = playlistResponse.tracks.items.map(item => item) as PlaylistTrack[];
    const tracks: Track[] = playlistTracks.map(track => track.track);
    console.log("Loaded", tracks.length, "tracks from playlist with id", playlistId);
    return tracks;
}

export async function addSongsToTable(songs: VibedTrack[]) {
    if (songs.length === 0) {
        return;
    }
    console.log("Adding songs to table");
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
    const songDataUpload= songs.map(song => {
        const featureId = featuresData.find(f => f.spotify_id === song.id)?.id;
        return {
            name: song.name,
            artist: song.artists[0].name, // Assuming the first artist's name
            album: song.album.name, // Assuming 'album' has a 'name' property
            song_features_id: featureId,
            spotify_id: song.id // Again, assuming 'id' is the Spotify ID
        };
    });

    // Insert into song
    const { error: error2 } = await supabase
        .from('song')
        .upsert(songDataUpload, { onConflict: 'spotify_id' })

    if (error2) {
        console.error(error2);
        // Handle error - consider rolling back song_features insertion if necessary
    }

    console.log("Successfully added songs to table");

    return featuresData; // or appropriate return value
}

export async function addSongVibesToTable(songs: (SongVibes)[]) {
    if (songs.length === 0) {
        return;
    }
    console.log("Adding song vibes to table");
    const supabase = createServerActionClient<Database>({cookies: () => cookies()});
    const { data: songsData, error: songsError } = await supabase
        .from('song')
        .select('id, spotify_id');

    // Add song analysis to song_vibes table
    const { error } = await supabase
        .from('song_vibes')
        .upsert(songs.map(song => ({
            name: song.name,
            spotify_id: song.spotify_id,
            happy: song.happy,
            sad: song.sad,
            energetic: song.energetic,
            calm: song.calm,
            romantic: song.romantic,
            nostalgic: song.nostalgic,
            angry: song.angry,
            inspirational: song.inspirational,
            uplifting: song.uplifting,
            party: song.party,
            mysterious: song.mysterious,
            genre: song.genre
        })), { onConflict: 'spotify_id' });

    if (error) {
        console.error(error);
    }
    console.log("Successfully added song vibes to table");
}

export async function getAverageVibesForUser(userSongs: SongVibes[]): Promise<SongVibes> {
    console.log("Calculating average vibes for user");
    // average each vibe from the user's songs
    const averageVibes = {
        happy: 0,
        sad: 0,
        energetic: 0,
        calm: 0,
        romantic: 0,
        nostalgic: 0,
        angry: 0,
        inspirational: 0,
        uplifting: 0,
        party: 0,
        mysterious: 0,
    } as SongVibes;
    userSongs.forEach(song => {
        averageVibes.happy += song.happy;
        averageVibes.sad += song.sad;
        averageVibes.energetic += song.energetic;
        averageVibes.calm += song.calm;
        averageVibes.romantic += song.romantic;
        averageVibes.nostalgic += song.nostalgic;
        averageVibes.angry += song.angry;
        averageVibes.inspirational += song.inspirational;
        averageVibes.uplifting += song.uplifting;
        averageVibes.party += song.party;
        averageVibes.mysterious += song.mysterious;
    });
    averageVibes.happy /= userSongs.length;
    averageVibes.sad /= userSongs.length;
    averageVibes.energetic /= userSongs.length;
    averageVibes.calm /= userSongs.length;
    averageVibes.romantic /= userSongs.length;
    averageVibes.nostalgic /= userSongs.length;
    averageVibes.angry /= userSongs.length;
    averageVibes.inspirational /= userSongs.length;
    averageVibes.uplifting /= userSongs.length;
    averageVibes.party /= userSongs.length;
    averageVibes.mysterious /= userSongs.length;
    console.log("Average vibes:", averageVibes);
    return averageVibes;
}
