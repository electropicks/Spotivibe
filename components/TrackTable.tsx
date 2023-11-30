import {Table, Typography} from "@mui/joy";
import {truncateString} from "@/lib/utils";

interface TableProps {
    tracks: Track[];
}

const TrackTable = ({ tracks }: TableProps) => {
    return (
        <div>
            <Typography>Tracks</Typography>
            <Table>
                <thead>
                <tr>
                    <th>Song</th>
                    <th>Artist</th>
                    <th>Album</th>
                    <th>Popularity</th>
                </tr>
                </thead>
                <tbody>
                {tracks.map((track: Track, index: number) => (
                    <tr key={index}>
                        <td>{truncateString(track.name, 40)}</td>
                        <td>{track.artists[0].name}</td>
                        <td>{track.album.name}</td>
                        <td>{track.popularity}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TrackTable;