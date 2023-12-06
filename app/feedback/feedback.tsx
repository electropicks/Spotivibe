'use client'

import { useState, useEffect, SetStateAction} from "react";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import {useRouter} from "next/navigation";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Header from "../discover/header";
import TrackTable from "@/components/TrackTable";
import {
    addSongsToTable,
    getSongVibes,
    getAiReccSongs,
    getUserTopArtists,
    getUserTopTracks, mergeTrackFeatures, addSongVibesToTable, pruneCachedSongs, getAverageVibesForUser, processSongs
} from "@/app/actions/actions";
import "../discover/discover.css";
//import LikertScale from 'likert-react';

export default function Categories(
    //{provider_token}: { provider_token: string }
    ) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    // Slider Parameters
    const [happy, setHappy] = useState("50");
    const [sad, setSad] = useState("50");
    const [angry, setAngry] = useState("50");
    const [calm, setCalm] = useState("50");
    const [energetic, setEnergetic] = useState("50");
    const [uplifting, setUplifting] = useState("50");


    // Slider weights in favor of user data
    const [perHappy, setPerHappy] = useState("50");
    const [perSad, setPerSad] = useState("50");
    const [perAngry, setPerAngry] = useState("50");
    const [perCalm, setPerCalm] = useState("50");
    const [perEnergetic, setPerEnergetic] = useState("50");
    const [perUplifting, setPerUplifting] = useState("50");


    const [table, setTable] = useState(<></>);
    const [topTracks, setTopTracks] = useState<Track[]>([]);

    // Feedback Parameters
    const [happyRes, setHappyRes] = useState(3);
    const [sadRes, setSadRes] = useState(3);
    const [angryRes, setAngryRes] = useState(3);
    const [calmRes, setCalmRes] = useState(3);
    const [energeticRes, setEnergeticRes] = useState(3);
    const [upliftingRes, setUpliftingRes] = useState(3);

    const headers = new Headers();
    //headers.append('Authorization', `Bearer ${provider_token}`);
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
        const {categories: data} = await response.json();
        return data;
    };

    const likertScale = (type: string, change: (f : number)=>void) => {

        return (
            <form>
                <br />
                <h3>How {type} did you find the playlist? </h3>
                <br />
                <label><input type="radio" name="myRadio" value="1" onClick={() => change(1)}/> Not {type} Enough</label>
                <label><input type="radio" name="myRadio" value="2" onClick={() => change(2)}/> Could be more {type}</label>
                <label><input type="radio" name="myRadio" value="3" defaultChecked={true} onClick={() => change(3)}/> Perfect</label>
                <label><input type="radio" name="myRadio" value="4" onClick={() => change(4)}/> A little too {type}</label>
                <label><input type="radio" name="myRadio" value="5" onClick={() => change(5)}/> Way too {type} </label>
            </form>
        )
    }

    const getFeedback = (slider : number, user : number, result: number, setParam: (f : string)=>void, param: number) => {
        switch (result){
            case 1:
                if (user < slider && param <= 80){
                    setParam(String(param + 20));
                } else if (user > slider && param >= 20){
                    setParam(String(param - 20))
                }
                break;
            case 2:
                if (user < slider && param <= 90){
                    setParam(String(param + 10));
                } else if (user > slider && param >= 10){
                    setParam(String(param - 10))
                }
                break;
            case 3:
                break;
            case 4:
                if (user > slider && param <= 90){
                    setParam(String(param + 10));
                } else if (user < slider && param >= 10){
                    setParam(String(param - 10))
                }
                break;
            case 5:
                if (user > slider && param <= 80){
                    setParam(String(param + 20));
                } else if (user < slider && param >= 20){
                    setParam(String(param - 20))
                }
                break;
            default:
                break;
        }
    }

    // This function adjusts weights based on feedback, so then the next reccomendation will be different
    // Adapts and learns
    const evalFeedback = async () => {

        const songVibes = await processSongs(topTracks);
        const userAverageSongVibes: SongVibes = await getAverageVibesForUser(songVibes);
        getFeedback(parseInt(happy), userAverageSongVibes.happy, happyRes, setPerHappy, parseInt(perHappy));
        getFeedback(parseInt(sad), userAverageSongVibes.sad, sadRes, setPerSad, parseInt(perSad));
        getFeedback(parseInt(angry), userAverageSongVibes.angry, angryRes, setPerAngry, parseInt(perAngry));
        getFeedback(parseInt(calm), userAverageSongVibes.calm, calmRes, setPerCalm, parseInt(perCalm));
        getFeedback(parseInt(energetic), userAverageSongVibes.energetic, energeticRes, setPerEnergetic, parseInt(perEnergetic));
        getFeedback(parseInt(uplifting), userAverageSongVibes.uplifting, upliftingRes, setPerUplifting, parseInt(perUplifting));

        return;
    }

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

    const gen = async() => {
        // Activates pop up that shows the results
        setShowPopup(true);

        // use getAverageVibesPerUser functions
        // shown that the user likes from the user data
        const topTracks: Track[] = await getUserTopTracks(50, 'medium_term');
        setTopTracks(topTracks);

        const songVibes = await processSongs(topTracks);
        const userAverageSongVibes: SongVibes = await getAverageVibesForUser(songVibes);

        // // "Averages" the vibes put in through the sliders and the vibes
        const avgHappy = ((parseInt(happy) * (parseInt(perHappy) / 100.0)) +
            (userAverageSongVibes.happy * ((100 - parseInt(perHappy)) / 100.0))) / 2;
        const avgSad = ((parseInt(sad) * (parseInt(perSad) / 100.0)) +
            (userAverageSongVibes.sad * ((100 - parseInt(perSad)) / 100.0))) / 2;
        const avgAngry = ((parseInt(angry) * (parseInt(perAngry) / 100.0)) +
            (userAverageSongVibes.angry * ((100 - parseInt(perAngry)) / 100.0))) / 2;
        const avgCalm = ((parseInt(calm) * (parseInt(perCalm) / 100.0)) +
            (userAverageSongVibes.calm * ((100 - parseInt(perCalm)) / 100.0))) / 2;
        const avgEnergetic = ((parseInt(energetic) * (parseInt(perEnergetic) / 100.0)) +
            (userAverageSongVibes.energetic * ((100 - parseInt(perEnergetic)) / 100.0))) / 2;
        const avgUplifting = ((parseInt(uplifting) * (parseInt(perUplifting) / 100.0)) +
            (userAverageSongVibes.uplifting * ((100 - parseInt(perUplifting)) / 100.0))) / 2;
        const recTracks: Track[] = await getAiReccSongs(Number((avgHappy /100.0).toFixed(2)),
            Number((avgSad /100.0).toFixed(2)),
            Number((avgAngry /100.0).toFixed(2)),
            Number((avgCalm /100.0).toFixed(2)),
            Number((avgEnergetic /100.0).toFixed(2)),
            Number((avgUplifting/100.0).toFixed(2)));

        // Returns the playlist
        setTable(<TrackTable tracks={recTracks}></TrackTable>);
        return (<TrackTable tracks={recTracks}></TrackTable>);
    }

    return (
        <div className="App">
            <Header></Header>
            <div className="box">
                <h1>Recommendation Generator with Feedback:</h1>
                <h2>Give us your feedback on the playlists generated by our AI and we will
                    readjust our parameters to better fit your needs!</h2>
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
            <Button onClick={gen} className="button">Submit</Button>
            {showPopup &&
                (<div>
                    <Box className="box" id="results">
                        <h2>Your Playlist</h2>
                        {table}
                    </Box>
                    <Box className="box">
                        <h2 className="left">Tell us how you think we did:</h2>
                        {likertScale("happy", setHappyRes)}
                        {likertScale("sad", setSadRes)}
                        {likertScale("angry", setAngryRes)}
                        {likertScale("calm", setCalmRes)}
                        {likertScale("energetic", setEnergeticRes)}
                        {likertScale("uplifting", setUpliftingRes)}
                    </Box>
                    <Button className="button" onClick={evalFeedback}>Submit</Button>
                </div>)}
            <br />
        </div>)
}