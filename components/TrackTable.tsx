import {Table, Typography} from "@mui/joy";
import {truncateString} from "@/lib/utils";

interface TableProps {
    data: getTopTracksResponse;
}

const TrackTable: React.FC<TableProps> = ({ data }) => {
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
                {data.items.map((item: TrackObject, index: number) => (
                    <tr key={index}>
                        <td>{truncateString(item.name, 40)}</td>
                        <td>{item.artists[0].name}</td>
                        <td>{item.album.name}</td>
                        <td>{item.popularity}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TrackTable;