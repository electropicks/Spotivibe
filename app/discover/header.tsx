import {cookies} from "next/headers";
import "./discover.css"
import {redirect} from "next/navigation";

function Header() {
    return (
        <div className="head">
            <div className="App-header">
                <h1>&nbsp;&nbsp;SpotiVibe&nbsp;&nbsp;</h1>
                <img src={"https://static.showit.co/200/ryDYjxkrQGak1r2RqSbhXQ/76192/spotify_icon-white.png"}
                     className="App-logo" alt="Logo"/>
            </div>
        </div>
    );
}

export default Header;