import {cookies} from "next/headers";
import "./discover.css"
import {redirect} from "next/navigation";

function Header() {
    return (
        <div className="head">
            <div className="App-header">
                <h1>&nbsp;&nbsp;SpotiVibe&nbsp;&nbsp;</h1>
                <img src={"https://static.showit.co/200/ryDYjxkrQGak1r2RqSbhXQ/76192/spotify_icon-white.png"}
                     className="App-logo" alt="Logo" />
            </div>
            {/*<h3 className="homeButton">Home</h3>*/}
            {/*<img src={*/}
            {/*    "https://spng.pngfind.com/pngs/s/680-6800118_home-icon-png-white-home-button-icon-white.png"}*/}
            {/*    className="homeButton"*/}
            {/*     //onClick={() => redirect('/')}*/}
            {/*/>*/}
        </div>
    );
}

export default Header;