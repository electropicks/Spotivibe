'use client'

import { useState, useEffect } from "react";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useRouter } from "next/navigation";
import Header from "../discover/header";
import Box from '@mui/material/Box';
import "../discover/discover.css"

export default function Categories(
    //{ provider_token }: { provider_token: string }
) {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);

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