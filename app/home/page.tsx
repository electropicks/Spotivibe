import VibeSheet from "@/components/VibeSheet";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function Home() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: {session} } = await supabase.auth.getSession();
    if (!session) {
        console.log("Redirecting to login");
        redirect('/login');
    }
    return (
        <>
            <LogoutButton/>
            <VibeSheet username={session.user.email ?? 'unknown user'}/>
        </>
    )
}