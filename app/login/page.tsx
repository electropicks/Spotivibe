'use client'

import {createClientComponentClient, User} from '@supabase/auth-helpers-nextjs'
import {useRouter} from 'next/navigation'

import Button from "@mui/joy/Button";
import {Sheet} from "@mui/joy";
import SpotifyIcon from "@/components/SpotifyIcon";
import {useEffect, useState} from "react";
import {Session} from "@supabase/supabase-js";

export default function Login() {
    const supabase = createClientComponentClient<Database>()
    const router = useRouter()
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const scope =
        "user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-read-currently-playing user-follow-read playlist-read-private user-read-email user-read-private user-library-read playlist-read-collaborative";

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
            }
        );
        return () => {
            authListener.subscription?.unsubscribe();
        };
    }, []);

    const handleSignIn = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'spotify',
            options: {
                scopes: scope,
                redirectTo: `${location.origin}/auth/callback`
            },
        })
        router.refresh()
    }

    return (
        <Sheet
            sx={{
                width: 300,
                mx: 'auto', // margin left & right
                my: 4, // margin top & bottom
                py: 3, // padding top & bottom
                px: 2, // padding left & right
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRadius: 'lg',
                boxShadow: 'md',
            }}
        >
            <Button sx={{'--Button-gap': '14px', py: 2,}} startDecorator={<SpotifyIcon/>} variant='outlined'
                    onClick={handleSignIn}>
                Continue with Spotify
            </Button>
        </Sheet>
    );
}

