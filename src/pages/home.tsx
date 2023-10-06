import {useSession} from "next-auth/react";
import Login from "../components/login";
import Profile from "../components/profile";

const Home = () => {
    const {data: session, status} = useSession();
    if (!session || status !== "authenticated") {
        return <Login/>
    } else {
        return (
            <Profile/>
        );
    }
};

export default Home;
