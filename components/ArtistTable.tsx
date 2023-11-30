import {Table, Typography} from "@mui/joy";
import {truncateString} from "@/lib/utils";
import {ArtistObject} from "@/lib/spotify.types";

interface TableProps {
    artists: ArtistObject[];
}

const ArtistTable = ({artists}: TableProps) => {
    return (
        <div>
            <Typography>Artists</Typography>
            <Table>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Genres</th>
                    <th>Image</th>
                    <th>Popularity</th>
                </tr>
                </thead>
                <tbody>
                {artists.map((artist: ArtistObject, index: number) => (
                    <tr key={index}>
                        <td>{truncateString(artist.name, 40)}</td>
                        <td>{artist.genres}</td>
                        <td><img width={100} src={artist.images[0].url ?? 'N/A'} alt='artist image' /></td>
                        <td>{artist.popularity}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ArtistTable;