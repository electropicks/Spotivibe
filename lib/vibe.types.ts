import {AudioFeaturesObject, TrackObject} from "@/lib/spotify.types";

export interface VibedTrack extends TrackObject, AudioFeaturesObject {

}

export interface AverageVibesObject {
    acousticness: number;
    danceability: number;
    energy: number;
    tempo: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    [key: string]: number; // index signature
}

export interface SongVibesObject {
    name: string;
    artist: string;
    spotify_id: string;
    happy: number;
    sad: number;
    energetic: number;
    calm: number;
    romantic: number;
    nostalgic: number;
    angry: number;
    inspirational: number;
    uplifting: number;
    party: number;
    mysterious: number;
    genre: string;
}
