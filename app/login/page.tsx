import Button from "@mui/joy/Button";
import { Sheet } from "@mui/joy";
import SpotifyIcon from "@/components/SpotifyIcon";
import Link from 'next/link';

export default function Login() {
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
