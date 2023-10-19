'use server'

import {getTrackFeatures, serializeTrackIds} from "@/lib/utils";
import {VibedTrack} from "@/lib/vibe.types";
import {getTopArtistsResponse} from "@/lib/spotify.types";

export async function getTracksFromSpotify(provider_token: string) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${provider_token}`);
    const params = new URLSearchParams();
    params.append('limit', '50');
    params.append('time_range', 'short_term');
    const apiURL = `https://api.spotify.com/v1/me/top/tracks?${params.toString()}`;
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: headers,
    })
    const trackResponse = await response.json() as getTopTracksResponse
    const topTracks = trackResponse.items;
    const serializedTracks = serializeTrackIds(topTracks);
    const trackFeatures = await getTrackFeatures(provider_token!, serializedTracks);
    const vibedTracks: VibedTrack[] = trackFeatures.map((features, index) => {
        const track: Track = topTracks[index];
        return {
            ...features,
            ...track,
        };
    });
    return vibedTracks;
}

export async function getArtistsFromSpotify(provider_token: string) {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${provider_token}`);
    const params = new URLSearchParams();
    params.append('limit', '50');
    params.append('time_range', 'short_term');
    const apiURL = `https://api.spotify.com/v1/me/top/artists?${params.toString()}`;
    const response = await fetch(apiURL, {
        method: 'GET',
        headers: headers,
    })
    const artistsResponse = await response.json() as getTopArtistsResponse;
    return artistsResponse.items;
}

