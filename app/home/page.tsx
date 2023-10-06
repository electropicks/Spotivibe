'use client'

import {Sheet, Slider, Table, Typography} from "@mui/joy";
import {createClientComponentClient, User} from "@supabase/auth-helpers-nextjs";
import {useEffect, useState} from "react";
import {Session} from "@supabase/supabase-js";
import {redirect, useRouter} from "next/navigation";
import Button from "@mui/joy/Button";

export default function Home() {
    const supabase = createClientComponentClient<Database>();
    const [session, setSession] = useState<Session | null>();
    const router = useRouter();

    useEffect(() => {
        const retrieveSession = async () => {
            const {data, error} = await supabase.auth.getSession();
            if (error) {
                console.error(error);
                return;
            }
            setSession(data?.session)
        }
        retrieveSession();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.replace('../')
    };

    const MIN = 100;
    const MAX = 100;
    return (
        <>
            <Button onClick={handleSignOut}>
                Sign Out
            </Button>
            <Typography>Hello {session?.user?.email}</Typography>
            <Sheet variant='outlined' sx={{padding: 2}}>
                <Table>
                    <tbody>
                    <tr>
                        <td>
                            <Typography component='h2'>Upbeat</Typography>
                            <Slider min={MIN} max={MAX}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Typography component='h2'>Elevator</Typography>
                            <Slider min={MIN} max={MAX}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Typography component='h2'>Beachy</Typography>
                            <Slider min={MIN} max={MAX}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Typography component='h2'>Sad</Typography>
                            <Slider min={MIN} max={MAX}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Typography component='h2'>Dancing Music</Typography>
                            <Slider min={MIN} max={MAX}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Typography component='h2'>Rock</Typography>
                            <Slider min={MIN} max={MAX}/>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <Typography component='h2'>Instrumental</Typography>
                            <Slider min={MIN} max={MAX}/>
                        </td>
                    </tr>
                    </tbody>
                </Table>
            </Sheet>
        </>
    )
}