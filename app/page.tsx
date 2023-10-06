import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
        data: { session },
    } = await supabase.auth.getSession();

    console.log(session?.user);

    if (session) {
        console.log("Redirecting to home");
        redirect("/home");
    }
    else {
        console.log("Redirecting to login");
        redirect("/login")
    }
}