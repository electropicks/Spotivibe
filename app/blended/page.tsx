import Button from "@mui/joy/Button";
import {Typography} from "@mui/joy";
import Grid from '@mui/material/Grid';
//import React, {useState} from "react";
import Box from '@mui/material/Box';
import Header from "../discover/header";
import "../discover/discover.css"


export default async function Discover() {

    return (
        <div className="App">
            <Header></Header>
            <div className="box">
                <h1>Blended Playlists:</h1>
                <h2>Select two playlist and we will generate a new playlist for you that uses AI to find the
                    best match up of the vibes of both playlists!</h2>
            </div>
            <Box className="box">
                <p>Placeholder for Playlist selection however we choose to implement that!</p>
            </Box>
        </div>
    );
}