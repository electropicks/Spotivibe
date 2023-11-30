import Button from "@mui/joy/Button";
import {Typography} from "@mui/joy";
import {createServerComponentClient} from "@supabase/auth-helpers-nextjs";
import Categories from "./Categories";
import {redirect} from "next/navigation";
import {cookies} from "next/headers";

export default async function Discover() {
    const supabase = createServerComponentClient<Database>({cookies});
    const {data: {session}} = await supabase.auth.getSession();
    if (!session) {
        redirect('/login')
    }

    return (
        <>
            <Categories provider_token={session!.provider_token!} />
        </>
    )
}