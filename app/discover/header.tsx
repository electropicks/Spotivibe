import {cookies} from "next/headers";
import "./discover.css"
import logos from './logo.png';

function Header() {
    return (
        <div className="App-header">
            <h1>&nbsp;&nbsp;SpotiVibe</h1>
            <img src={logos} alt="Logo" />
        </div>
    );
}

export default Header;