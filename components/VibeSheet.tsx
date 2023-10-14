import { Sheet, Slider, Table, Typography } from "@mui/joy";

export interface VibeSheetProps {
    username: string;
}

const MIN = 0;
const MAX = 100;
const defaultValue = 50;

const categories = [
    { label: "Upbeat" },
    { label: "Elevator" },
    { label: "Beachy" },
    { label: "Sad" },
    { label: "Dancing Music" },
    { label: "Rock" },
    { label: "Instrumental" },
];

export default function VibeSheet({ username }: VibeSheetProps) {
    return (
        <Sheet variant="soft" sx={{ padding: 5, borderRadius: 25 }}>
            <Typography component="h1">Welcome, {username}</Typography>
            <Table>
                <tbody>
                {categories.map((category, index) => (
                    <tr key={index}>
                        <td>
                            <Typography component="h2">{category.label}</Typography>
                            <Slider
                                valueLabelDisplay="auto"
                                defaultValue={defaultValue}
                                min={MIN}
                                max={MAX}
                            />
                        </td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Sheet>
    );
}
