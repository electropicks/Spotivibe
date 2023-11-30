import Button from "@mui/joy/Button";
import { Sheet } from "@mui/joy";
import SpotifyIcon from "@/components/SpotifyIcon";
import Link from 'next/link';
import {cookies} from "next/headers";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {redirect} from "next/navigation";

export default async function Login() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        redirect('/home');
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Sheet
                sx={{
                    py: 2,
                    px: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center', // Center children vertically
                    borderRadius: 'lg',
                    boxShadow: 'md',
                    color: 'primary.300'
                }}
            >
                <Link href="/auth/login" passHref>
                    <Button sx={{ m: 1, p: 2, width: 300 }} variant='outlined' startDecorator={<SpotifyIcon />}>
                        Continue with Spotify
                    </Button>
                </Link>
            </Sheet>
        </div>
    );
}
