import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Typography } from "@mui/joy";

type AggregateVibes = {
    [key: string]: number;
};

interface VibeSliderProps {
    vibes: SongVibes[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658', '#ff7043', '#c0ca33'];

const VibePieChart = ({ vibes }: VibeSliderProps) => {
    const aggregatedVibes = vibes.reduce((acc: AggregateVibes, song) => {
        Object.keys(song).forEach(key => {
            if (typeof song[key] === 'number') {
                acc[key] = (acc[key] || 0) + song[key];
            }
        });
        return acc;
    }, {});

    const data = Object.keys(aggregatedVibes).map(key => ({
        name: key,
        value: aggregatedVibes[key]
    })).filter(vibe => !['spotify_id', 'name', 'artist', 'genre'].includes(vibe.name)); // Exclude non-vibe properties

    return (
        <ResponsiveContainer width="80%" height={500}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={170}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};

export default VibePieChart;