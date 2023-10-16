'use client'

import {Sheet} from "@mui/joy";
import Button from "@mui/joy/Button";
import {Session} from "@supabase/supabase-js";
import {useState} from "react";
import TrackTable from "@/components/TrackTable";
import ArtistTable from "@/components/ArtistTable";
import {getTopArtistsResponse} from "@/lib/spotify.types";

export default function TopTracks({session}: { session: Session }) {
    const [topTracks, setTopTracks] = useState<getTopTracksResponse | null>(null)
    const [topArtists, setTopArtists] = useState<getTopArtistsResponse | null>(null)
    const [displayMode, setDisplayMode] = useState<'tracks' | 'artists' | null>(null)
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${session?.provider_token}`);
    const params = new URLSearchParams();
    params.append('limit', '50');
    params.append('time_range', 'short_term');
    const getTracks = async () => {
        const apiURL = `https://api.spotify.com/v1/me/top/tracks?${params.toString()}`;
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: headers,
        })
        const topItems = await response.json() as getTopTracksResponse
        console.log(topItems);
        setTopTracks(topItems);
        setDisplayMode('tracks')
    }
    const getArtists = async () => {
        const apiURL = `https://api.spotify.com/v1/me/top/artists?${params.toString()}`;
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: headers,
        })
        const topItems = await response.json() as getTopArtistsResponse
        console.log(topItems);
        setTopArtists(topItems);
        setDisplayMode('artists')
    }

    return (
        <>
            <Sheet sx={{borderRadius: 10, p: 2, m: 2}}>
                <Button sx={{m: 1}} onClick={getTracks}>get tracks</Button>
                <Button sx={{m: 1}} onClick={getArtists}>get artists</Button>
                {(displayMode && displayMode === 'tracks' && topTracks) ? <TrackTable data={topTracks}/> : null}
                {(displayMode && displayMode === 'artists' && topArtists) ? <ArtistTable data={topArtists}/> : null}
            </Sheet>
        </>
    );
}