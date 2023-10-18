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
            instrumentalness: 0,
            liveness: 0,
            valence: 0,
        };
    }
    const sum = topTracks.reduce(
        (accumulator, track) => {
            return {
                acousticness: accumulator.acousticness + track.acousticness,
                danceability: accumulator.danceability + track.danceability,
                energy: accumulator.energy + track.energy,
                instrumentalness: accumulator.instrumentalness + track.instrumentalness,
                liveness: accumulator.liveness + track.liveness,
                valence: accumulator.valence + track.valence,
            };
        },
        {
            acousticness: 0,
            danceability: 0,
            energy: 0,
            instrumentalness: 0,
            liveness: 0,
            valence: 0,
        }
    );
    return {
        acousticness: Math.round(sum.acousticness / numTracks * 100),
        danceability: Math.round(sum.danceability / numTracks * 100),
        energy: Math.round(sum.energy / numTracks * 100),
        instrumentalness: Math.round(sum.instrumentalness / numTracks * 100),
        liveness: Math.round(sum.liveness / numTracks * 100),
        valence: Math.round(sum.valence / numTracks * 100),
    };
}