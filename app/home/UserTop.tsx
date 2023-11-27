'use client'

import {Option, Select, Sheet, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import React, {useState} from "react";
import TrackTable from "@/components/TrackTable";
import ArtistTable from "@/components/ArtistTable";
import {
    addSongsToTable,
    getSongVibes,
    getSpotifyToken,
    getUserTopArtists,
    getUserTopTracks, mergeTrackFeatures
} from "@/app/actions/actions";
import Stack from "@mui/joy/Stack";

enum TimeRange {
    SHORT_TERM = 'short_term',
    MEDIUM_TERM = 'medium_term',
    LONG_TERM = 'long_term'
}

export default function UserTop() {
    const [timeRange, setTimeRange] = useState<TimeRange>(TimeRange.MEDIUM_TERM)
    const [topTracks, setTopTracks] = useState<Track[]>([])
    const [topArtists, setTopArtists] = useState<Artist[]>([])
    const [vibedTracks, setVibedTracks] = useState<Track[]>([])
    const [displayMode, setDisplayMode] = useState<'tracks' | 'artists' | null>(null)

    const getTracks = async () => {
        const topTracks: Track[] = await getUserTopTracks(50, timeRange);
        setTopTracks(topTracks)
        setDisplayMode('tracks')
        const mergedTracks = await getVibedTracks(topTracks);
        setVibedTracks(mergedTracks)
        // await getSongVibes(topTracks[0].name, topTracks[0].artists[0].name);
        await addSongsToTable(mergedTracks);
    }

    const getVibedTracks = async (tracks: Track[]) => {
        console.log("Getting track features");
        return await mergeTrackFeatures(tracks);
    }

    const getArtists = async () => {
        const topArtists: Artist[] = await getUserTopArtists(50, timeRange);
        setTopArtists(topArtists)
        setDisplayMode('artists')
    }

    const handleChange = (
        event: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element> | React.FocusEvent<Element, Element> | null,
        newValue: TimeRange | null
    ) => {
        // Check if the event is not null and prevent the default action
        if (event) {
            event.preventDefault();
        }

        // Assuming `newValue` is the new selected value you need.
        // Make sure this matches how the new value is actually passed in your Select component's onChange event.
        if (newValue !== null) {
            setTimeRange(newValue);
        }
    };


    return (
        <>
            <Sheet sx={{borderRadius: 10, p: 3, m: 2}}>
                <Stack direction={'row'} spacing={2} justifyContent={'center'} alignItems={'center'}>
                    <Button sx={{m: 1}} onClick={getTracks}>get tracks</Button>
                    <Button sx={{m: 1}} onClick={getArtists}>get artists</Button>
                    <Typography>time range</Typography>
                    <Select defaultValue={timeRange} onChange={handleChange} sx={{width: 150}}>
                        <Option value={TimeRange.SHORT_TERM}>short term</Option>
                        <Option value={TimeRange.MEDIUM_TERM}>medium term</Option>
                        <Option value={TimeRange.LONG_TERM}>long term</Option>
                    </Select>
                </Stack>
                {/*<VibeSheet averageVibes={averageVibes}/>*/}
                {(displayMode && displayMode === 'tracks' && topTracks) ? <TrackTable tracks={topTracks}/> : null}
                {(displayMode && displayMode === 'artists' && topArtists) ? <ArtistTable artists={topArtists}/> : null}
            </Sheet>
        </>
    );
}