import {Sheet, Slider, Typography} from "@mui/joy";

interface VibeSliderProps {
    vibes: SongVibes[];
}

const VibeSlider = ({ vibes }: VibeSliderProps) => {
    return (
        <div>
            {vibes.map((track, index) => (
                <div key={index}>
                    {Object.entries(track).map(([vibe, score]) => (
                        <div key={vibe} style={{ margin: '20px 0' }}>
                            <Typography sx={{ mb: 2 }}>
                                {vibe}: {score.toFixed(2)}
                            </Typography>
                            <Sheet>
                            <Slider
                                defaultValue={score}
                                step={0.1}
                                marks
                                min={0}
                                variant={'solid'}
                                color={'success'}
                                max={100}
                                sx={{ width: 300, color: 'success.main'}}
                                // Add onChange handler here if you want it to be interactive
                            />
                            </Sheet>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default VibeSlider;
