import VibeSheet from "@/components/VibeSheet";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import LogoutButton from "@/components/LogoutButton";
import {Sheet, Typography} from "@mui/joy";
import UserTop from "@/components/UserTop";
import {getAverageVibes} from "@/lib/utils";

export default async function Home() {
    const supabaseComponent = createServerComponentClient<Database>({ cookies });
    const { data: {session} } = await supabaseComponent.auth.getSession();

    if (!session) {
        console.log("Redirecting to login");
        redirect('/login');
    }
    if (session.expires_in < 0) {
        console.log("Session expired, refreshing");
        await supabaseComponent.auth.refreshSession();
    }

    return (
        <>
            <LogoutButton/>
            <UserTop provider_token={session.provider_token!} />
        </>
    )
}