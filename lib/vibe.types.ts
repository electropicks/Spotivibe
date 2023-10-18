import {AudioFeaturesObject, TrackObject} from "@/lib/spotify.types";

export interface VibedTrack extends TrackObject, AudioFeaturesObject {

}

export interface AverageVibesObject {
    acousticness: number;
    danceability: number;
    energy: number;
    instrumentalness: number;
    liveness: number;
    valence: number;
    [key: string]: number; // index signature
}