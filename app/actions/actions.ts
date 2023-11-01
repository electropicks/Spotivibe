'use server'

import {getTopArtistsResponse} from "@/lib/spotify.types";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import {createServerActionClient} from "@supabase/auth-helpers-nextjs";

async function getSpotifyToken() {
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

