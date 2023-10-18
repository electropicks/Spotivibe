'use client'

import {Sheet} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useState} from "react";
import TrackTable from "@/components/TrackTable";
import ArtistTable from "@/components/ArtistTable";
import {getTopArtistsResponse} from "@/lib/spotify.types";
import {getAverageVibes, getTrackFeatures, serializeTrackIds} from "@/lib/utils";
import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import {AverageVibesObject, VibedTrack} from "@/lib/vibe.types";
import VibeSheet from "./VibeSheet";
import {useRouter} from "next/navigation";

export default function UserTop({provider_token}: { provider_token: string }) {
    const router = useRouter();

    const [topTracks, setTopTracks] = useState<VibedTrack[]>([])
    const [averageVibes, setAverageVibes] = useState<AverageVibesObject>({} as AverageVibesObject)
    const [topArtists, setTopArtists] = useState<Artist[]>([])
    const [displayMode, setDisplayMode] = useState<'tracks' | 'artists' | null>(null)

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${provider_token}`);
    const params = new URLSearchParams();
    params.append('limit', '50');
    params.append('time_range', 'short_term');
    const getTracks = async () => {
        const apiURL = `https://api.spotify.com/v1/me/top/tracks?${params.toString()}`;
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: headers,
        })
        if (response.status === 401) {
            router.push('/login');
            return;
        }
        const trackResponse = await response.json() as getTopTracksResponse
        const tracks = trackResponse.items;
        setDisplayMode('tracks')
        const serializedTracks = serializeTrackIds(tracks);
        const trackFeatures = await getTrackFeatures(provider_token!, serializedTracks);
        const vibedTracks: VibedTrack[] = trackFeatures.map((features, index) => {
            const track: Track = tracks[index];
            return {
                ...features,
                ...track,
            };
        });
        const averageVibes: AverageVibes = getAverageVibes(vibedTracks);
        setTopTracks(vibedTracks);
        setAverageVibes(averageVibes);
    }

    const getArtists = async () => {
        const apiURL = `https://api.spotify.com/v1/me/top/artists?${params.toString()}`;
        const response = await fetch(apiURL, {
            method: 'GET',
            headers: headers,
        })
        const artistsResponse = await response.json() as getTopArtistsResponse
        const artists = artistsResponse.items;
        setTopArtists(artists);
        setDisplayMode('artists')
    }

    return (
        <>
            <Sheet sx={{borderRadius: 10, p: 3, m: 2}}>
                <Button sx={{m: 1}} onClick={getTracks}>get tracks</Button>
                <Button sx={{m: 1}} onClick={getArtists}>get artists</Button>
                <VibeSheet averageVibes={averageVibes}/>
                {(displayMode && displayMode === 'tracks' && topTracks) ? <TrackTable tracks={topTracks}/> : null}
                {(displayMode && displayMode === 'artists' && topArtists) ? <ArtistTable artists={topArtists}/> : null}
            </Sheet>
        </>
    );
}