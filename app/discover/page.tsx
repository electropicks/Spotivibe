import Button from "@mui/joy/Button";
import {Typography} from "@mui/joy";
import Grid from '@mui/material/Grid';
//import React, {useState} from "react";
import Box from '@mui/material/Box';
import Header from "./header";
import "./discover.css"


export default async function Discover() {

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
                <input type="range" className="slider"></input>
                </div>
                <Grid container spacing={2}>
                </Grid>
                <div className="slide-text">
                    <h2>Sad:&nbsp;&nbsp;</h2>
                    <input type="range" className="slider"></input>
                </div>
                <Grid container spacing={2} >
                </Grid>
                <div className="slide-text">
                    <h2>Angry:&nbsp;&nbsp;</h2>
                    <input type="range" className="slider"></input>
                </div>
                <Grid container spacing={2} >
                </Grid>
                <div className="slide-text">
                    <h2>Relaxed:&nbsp;&nbsp;</h2>
                    <input type="range" className="slider"></input>
                </div>
                <Grid container spacing={2} >
                </Grid>
            </Box>
            <Button variant="contained" className="button" size="large">Submit</Button>
        </div>
    );
}