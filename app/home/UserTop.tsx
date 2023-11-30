'use client'

import {Input, Option, Select, Sheet, Typography} from "@mui/joy";
import Button from "@mui/joy/Button";
import React, {useState} from "react";
import TrackTable from "@/components/TrackTable";
import ArtistTable from "@/components/ArtistTable";
import {
    addSongsToTable,
    getSongVibes,
    getUserTopArtists,
    getUserTopTracks, mergeTrackFeatures, addSongVibesToTable, pruneCachedSongs
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
    const [songVibes, setSongVibes] = useState<SongVibes[]>([]);
    const [displayMode, setDisplayMode] = useState<'tracks' | 'artists' | null>(null)
    const [playlistId, setPlaylistId] = useState<string>('');

    const getTracks = async () => {
        const topTracks: Track[] = await getUserTopTracks(50, timeRange);
        setTopTracks(topTracks);
        setDisplayMode('tracks');
        const mergedTracks = await getVibedTracks(topTracks);
        setVibedTracks(mergedTracks);
        const tracksToAnalyze = await pruneCachedSongs(mergedTracks);
        const songVibes = await getSongVibes(tracksToAnalyze);
        console.log("Setting song vibes");
        setSongVibes(songVibes);
        console.log("Adding songs to table")
        await addSongsToTable(mergedTracks);
        await addSongVibesToTable(songVibes);
        // console.log("Calling backfill")
        // const res = await fetch('/backfill');
        // const data = await res.json();
        // console.log(data);

        // await fetch('/data_collection/playlist');

        console.log("Done");
    }
    const getPlaylist = async (playlistId: string) => {
        console.log("Fetching playlist");
        await fetch('/data-collection/playlists?playlist_id=' + playlistId);
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
            <form onSubmit={async (event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const playlistId = formData.get('playlistId');
                setPlaylistId(playlistId as string);
                console.log("Playlist id: " + playlistId);
                await getPlaylist(playlistId as string);
            }}>
                <Stack direction='row' sx={{borderRadius: 10, p: 3, m: 2}}>
                    {/* Ensure the input has a name attribute that matches the key used in formData.get */}
                    <Input name='playlistId' placeholder='Enter playlist id'/>
                    <Button type='submit'>Submit</Button>
                </Stack>
            </form>
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