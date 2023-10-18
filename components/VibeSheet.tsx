import {LinearProgress, Stack, Typography} from "@mui/joy";
import React from "react";

export interface ProgressBarsProps {
    averageVibes: AverageVibes;
}

const categories = [
    {label: "Acousticness", key: "acousticness"},
    {label: "Danceability", key: "danceability"},
    {label: "Energy", key: "energy"},
    {label: "Speed", key: "tempo"},
    {label: "Instrumentalness", key: "instrumentalness"},
    {label: "Happy", key: "valence"},
];

export default function VibeSheet({averageVibes}: ProgressBarsProps) {
    return (
        <>
            {categories.map((category, index) => (
                <Stack sx={{p:1, m:2}} key={index}>
                    <Typography component="h4">{category.label}</Typography>
                    <LinearProgress determinate thickness={7} value={averageVibes[category.key]}/>
                </Stack>
            ))}
        </>
    );
}
