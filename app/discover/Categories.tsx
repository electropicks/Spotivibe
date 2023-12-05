'use client'

import { useState, useEffect } from "react";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useRouter } from "next/navigation";
import Header from "./header";
import Grid from '@mui/material/Grid';
//import React, {useState} from "react";
import Box from '@mui/material/Box';
import TrackTable from "@/components/TrackTable";
import {
    addSongsToTable,
    getSongVibes,
    getUserTopArtists,
    getUserTopTracks, mergeTrackFeatures, addSongVibesToTable, pruneCachedSongs, getAverageVibesForUser, processSongs
} from "@/app/actions/actions";

export default function Categories({ provider_token }: { provider_token: string }) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    // Vibes for parameters
    const [happy, setHappy] = useState("50");
    const [sad, setSad] = useState("50");
    const [angry, setAngry] = useState("50");
    const [calm, setCalm] = useState("50");
    const [energetic, setEnergetic] = useState("50");
    const [uplifting, setUplifting] = useState("50");


    const [topTracks, setTopTracks] = useState<Track[]>([])

    const headers = new Headers();
    const [showPopup, setShowPopup] = useState(false);
    headers.append('Authorization', `Bearer ${provider_token}`);
    const params = new URLSearchParams();
    params.append('country', 'US');
    params.append('offset', '0');
    params.append('limit', '50');

    const fetchCategories = async (url: string) => {
        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
        });
        if (response.status === 401) {
            router.push('/login');
            return [];
        }
        const { categories: data } = await response.json();
        return data;
    };

    const getCategories = async () => {
        setLoading(true);
        let nextPage = `https://api.spotify.com/v1/browse/categories?${params.toString()}`;

        const allCategories: Category[] = [];

        while (nextPage) {
            const data = await fetchCategories(nextPage);
            allCategories.push(...data.items);

            if (data.next) {
                nextPage = data.next;
            } else {
                nextPage = '';
            }
        }

        setCategories(allCategories);
        setLoading(false)
    };

    const generatePlaylist = async() => {
        const top: Track[] = await getUserTopTracks(50, 'medium_term');
        setTopTracks(top);
        return (<TrackTable tracks={topTracks}></TrackTable>);
    }

    // PRIMARY FUNCTION THAT GENERATES AI PLAYLIST
    const gen = async() => {
        // Activates pop up that shows the results
        setShowPopup(true);

        // use getAverageVibesPerUser functions
        // shown that the user likes from the user data
        const topTracks: Track[] = await getUserTopTracks(50, 'medium');
        setTopTracks(topTracks);
        const songVibes = await processSongs(topTracks);
        const userAverageSongVibes: SongVibes = await getAverageVibesForUser(songVibes);

        // "Averages" the vibes put in through the sliders and the vibes
        const avgHappy = happy;
        const avgSad = sad;
        const avgAngry = angry;
        const avgCalm = calm;
        const avgEnergetic = energetic;
        const avgUplifting = uplifting;

        // Generates playlist with a range from those given parameters
        // E.X. avgHappy = .5, thus pull songs .4 - .6 happy etc

        // Evaluates if playist is too long or too short,
        // If its too long, tighten the range and try again
        // If its too short, expand the range and try again

        // Returns the playlist
        // currently just uses the get track feature
        return generatePlaylist();
    }

    return (
        <div className="App">
            <Header></Header>
            <div className="box">
                <h1>Recommendation Generator:</h1>
                <h2>Enter the vibes of the playlist you would like our newest Artificial Intelligence to generate below,
                    and click submit!</h2>
            </div>

            <Box className="box">
                <div className="slide-text">
                    <h2>Happy:&nbsp;&nbsp;</h2>
                    <input type="range" min="0" max="100" step="1" className="slider" value={happy} onChange={e => setHappy(e.target.value)}></input>
                </div>
                <Grid container spacing={2}>
                </Grid>
                <div className="slide-text">
                    <h2>Sad:&nbsp;&nbsp;</h2>
                    <input type="range" min="0" max="100" step="1" className="slider" value={sad} onChange={e => setSad(e.target.value)}></input>
                </div>
                <Grid container spacing={2} >
                </Grid>
                <div className="slide-text">
                    <h2>Angry:&nbsp;&nbsp;</h2>
                    <input type="range" min="0" max="100" step="1" className="slider" value={angry} onChange={e => setAngry(e.target.value)}></input>
                </div>
                <Grid container spacing={2} >
                </Grid>
                <div className="slide-text">
                    <h2>Calm:&nbsp;&nbsp;</h2>
                    <input type="range" min="0" max="100" step="1" className="slider" value={calm} onChange={e => setCalm(e.target.value)}></input>
                </div>
                <div className="slide-text">
                    <h2>Energetic:&nbsp;&nbsp;</h2>
                    <input type="range" min="0" max="100" step="1" className="slider" value={energetic} onChange={e => setEnergetic(e.target.value)}></input>
                </div>
                <div className="slide-text">
                    <h2>Uplifting:&nbsp;&nbsp;</h2>
                    <input type="range" min="0" max="100" step="1" className="slider" value={uplifting} onChange={e => setUplifting(e.target.value)}></input>
                </div>
                <Grid container spacing={2} >
                </Grid>
            </Box>
            <Button className="button" onClick={gen}>Submit</Button>
            {showPopup &&
                (<Box className="box" id="results">
                    <h2>Show results here</h2>
                </Box>)}
        </div>
    );
}