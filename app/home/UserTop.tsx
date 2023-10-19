'use client'

import {Sheet} from "@mui/joy";
import Button from "@mui/joy/Button";
import {useState} from "react";
import TrackTable from "@/components/TrackTable";
import ArtistTable from "@/components/ArtistTable";
import {getTopArtistsResponse} from "@/lib/spotify.types";
import {getAverageVibes, getTrackFeatures, serializeTrackIds} from "@/lib/utils";
import {AverageVibesObject, VibedTrack} from "@/lib/vibe.types";
import VibeSheet from "./VibeSheet";
import {useRouter} from "next/navigation";
import {getArtistsFromSpotify, getTracksFromSpotify} from "@/app/actions/actions";

export default function UserTop({provider_token}: { provider_token: string }) {
    const router = useRouter();

    const [topTracks, setTopTracks] = useState<VibedTrack[]>([])
    const [averageVibes, setAverageVibes] = useState<AverageVibesObject>({} as AverageVibesObject)
    const [topArtists, setTopArtists] = useState<Artist[]>([])
    const [displayMode, setDisplayMode] = useState<'tracks' | 'artists' | null>(null)

    const getTracks = async () => {
        const vibedTracks = await getTracksFromSpotify(provider_token);
        setTopTracks(vibedTracks);
        setAverageVibes(getAverageVibes(vibedTracks));
        setDisplayMode('tracks')
    }

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${provider_token}`);
    const params = new URLSearchParams({
        limit: '50',
        time_range: 'short_term',
    });

    const getArtists = async () => {
        const artists = await getArtistsFromSpotify(provider_token);
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