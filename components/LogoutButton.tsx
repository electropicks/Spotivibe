'use client'

import {createClientComponentClient} from "@supabase/auth-helpers-nextjs";
import Button from "@mui/joy/Button";
import {useRouter} from "next/navigation";

export default function LogoutButton () {
    const supabase = createClientComponentClient<Database>()
    const router = useRouter();
    const handleSignout = async () => {
        await supabase.auth.signOut();
        router.push('/login');
    }
    return (
        <Button onClick={handleSignout}>Sign Out</Button>
    );
}