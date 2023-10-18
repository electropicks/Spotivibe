export const truncateString = (str: string, maxLength: number) => {
    if (str.length > maxLength) {
        return str.substring(0, maxLength) + '...';
    }
    return str;
};

export const serializeTrackIds = (tracks: Track[]) => {
    return tracks.map((track) => track.id).join(',');
}

export const getTrackFeatures = async (token: string, ids: string) => {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    const endpoint = `https://api.spotify.com/v1/audio-features?ids=${ids}`;
    const response = await fetch(endpoint, {
        method: 'GET',
        headers,
    })
    const data = await response.json();
    const audioFeatures = data.audio_features;
    return audioFeatures as AudioFeatures[];
}

export const getAverageVibes = (topTracks: VibedTrack[]): AverageVibes => {
    const numTracks = topTracks.length;
    if (numTracks === 0) {
        return {
            acousticness: 0,
            danceability: 0,
            energy: 0,
            tempo: 0, // Set the initial tempo value to 0
            instrumentalness: 0,
            liveness: 0,
            valence: 0,
        };
    }

    // Define the minimum and maximum tempo values for the "speed" range
    const minTempo = 60; // Minimum tempo (slower)
    const maxTempo = 180; // Maximum tempo (faster)

    const sum = topTracks.reduce(
        (accumulator, track) => {
            return {
                acousticness: accumulator.acousticness + track.acousticness,
                danceability: accumulator.danceability + track.danceability,
                energy: accumulator.energy + track.energy,
                tempo: accumulator.tempo + mapTempoToPercentage(track.tempo, minTempo, maxTempo), // Map tempo to percentage
                instrumentalness: accumulator.instrumentalness + track.instrumentalness,
                liveness: accumulator.liveness + track.liveness,
                valence: accumulator.valence + track.valence,
            };
        },
        {
            acousticness: 0,
            danceability: 0,
            energy: 0,
            tempo: 0, // Initialize the tempo property
            instrumentalness: 0,
            liveness: 0,
            valence: 0,
        }
    );

    return {
        acousticness: Math.round(sum.acousticness / numTracks * 100),
        danceability: Math.round(sum.danceability / numTracks * 100),
        energy: Math.round(sum.energy / numTracks * 100),
        tempo: Math.round(sum.tempo / numTracks), // Calculate the average tempo
        instrumentalness: Math.round(sum.instrumentalness / numTracks * 100),
        liveness: Math.round(sum.liveness / numTracks * 100),
        valence: Math.round(sum.valence / numTracks * 100),
    };
};

// Helper function to map tempo to a percentage within the specified range
function mapTempoToPercentage(tempo: number, minTempo: number, maxTempo: number): number {
    if (tempo < minTempo) {
        return 0;
    } else if (tempo > maxTempo) {
        return 100;
    } else {
        return ((tempo - minTempo) / (maxTempo - minTempo)) * 100;
    }
}
