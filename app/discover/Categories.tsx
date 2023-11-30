'use client'

import {useState, useEffect} from "react";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import {useRouter} from "next/navigation";
import Header from "./header";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

export default function Categories({provider_token}: { provider_token: string }) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

    const headers = new Headers();
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
        const {categories: data} = await response.json();
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
                    {/*/>*/}
                </Grid>
                <div className="slide-text">
                    <h2>Sad:&nbsp;&nbsp;</h2>
                    <input type="range" className="slider"></input>
                </div>
                <Grid container spacing={2}>
                </Grid>
                <div className="slide-text">
                    <h2>Angry:&nbsp;&nbsp;</h2>
                    <input type="range" className="slider"></input>
                </div>
                <Grid container spacing={2}>
                </Grid>
                <div className="slide-text">
                    <h2>Relaxed:&nbsp;&nbsp;</h2>
                    <input type="range" className="slider"></input>
                </div>
                <Grid container spacing={2}>
                </Grid>
            </Box>
            {/*Button variant="contained" className="button" size="large">Submit</Button> */}
        </div>
    );
}
