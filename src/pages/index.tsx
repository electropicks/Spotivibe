import type {NextPage} from 'next'
import {signIn} from 'next-auth/react'
import {Button} from "@mui/joy";
import Link from "next/link";

const Home: NextPage = () => {
    return (
        <Link href="/api/auth/signin">
            <Button>Sign in</Button>
        </Link>
    )
}
export default Home