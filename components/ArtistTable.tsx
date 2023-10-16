import {Table, Typography} from "@mui/joy";
import {truncateString} from "@/lib/utils";

interface TableProps {
    data: getTopArtistsResponse;
}

const ArtistTable: React.FC<TableProps> = ({ data }) => {
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
                {data.items.map((item: ArtistObject, index: number) => (
                    <tr key={index}>
                        <td>{truncateString(item.name, 40)}</td>
                        <td>{item.genres}</td>
                        <td><img width={100} src={item.images[0].url ?? 'N/A'} alt='artist image' /></td>
                        <td>{item.popularity}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
};

export default ArtistTable;