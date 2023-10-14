import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import {cookies} from "next/headers";
import {redirect} from "next/navigation";

export default async function Unauthenticated () {
    const supabase = createServerComponentClient<Database>({ cookies });
    const { data: {session} } = await supabase.auth.getSession();
    if (session) {
        console.log("Redirecting to home");
        redirect('/home');
    }
    return (
        <div>
            <h1>Unauthenticated</h1>
        </div>
    )
}