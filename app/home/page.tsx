import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import UserTop from "./UserTop";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Link from "next/link";

export default async function Home() {
    const supabase = createServerComponentClient<Database>({cookies});
    const {data: {session}} = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <>
            <Stack
                direction="row"
                justifyContent="center"
                alignItems="center"
                spacing={2}
            >
                <Link href={'/auth/signout'}>
                    <Button>Logout</Button>
                </Link>
                <Link href={'/discover'}>
                    <Button>Discover</Button>
                </Link>
            </Stack>
            <UserTop provider_token={session!.provider_token!}/>
        </>
    )
}