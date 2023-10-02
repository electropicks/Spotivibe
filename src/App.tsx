import React, {useEffect} from 'react';

const App = () => {
    const CLIENT_ID: string = "c7f48b569016462994b5569c76ef7c5b"
    const REDIRECT_URI: string = "http://localhost:3000/callback"
    const AUTH_ENDPOINT: string = "https://accounts.spotify.com/authorize"
    const RESPONSE_TYPE: string = "token"
    const [token, setToken] = React.useState<string>("")
    useEffect(() => {
        const hash = window.location.hash
        let token = window.localStorage.getItem("token")

        if (!token && hash) {
            token = hash.substring(1).split("&").filter((element) => element.startsWith("access_token"))[0].split("=")[1]
            window.localStorage.setItem("token", token)
        }

        setToken(token || "");
    }, [])
    const logout = () => {
        setToken("")
        window.localStorage.removeItem("token")
    }
    return <div>
        <p>{token}</p>
        <a
            href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}
        >Login to Spotify</a>
        <button onClick={logout}>Logout</button>
    </div>;
}

export default App;