import VibeSheet from "@/components/VibeSheet";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import {Sheet, Typography} from "@mui/joy";
import TopTracks from "@/components/TopTracks";

export default async function Home() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: {session} } = await supabase.auth.getSession();
    if (!session) {
        console.log("Redirecting to login");
        redirect('/login');
    }

    return (
        <>
            <Sheet sx={{borderRadius: 10, p: 2, m:2}}>
                <Typography component='h1'>Test</Typography>
            </Sheet>
            <LogoutButton/>
            <TopTracks session={session}/>
            <VibeSheet username={session.user.email ?? 'unknown user'}/>
        </>
    )
}