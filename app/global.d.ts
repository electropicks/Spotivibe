import type {Database as DB} from "@/lib/database.types";
import {
    TrackObject,
    AudioFeaturesObject, CategoriesObject
} from "@/lib/spotify.types";
import {AverageVibesObject, VibedTrack as VibedTrackObject} from "@/lib/vibe.types";

declare global {
    type Database = DB;
    type VibedTrack = VibedTrackObject;
    type AverageVibes = AverageVibesObject;
    type AudioFeatures = AudioFeaturesObject;
    type getTopTracksResponse = TopTrackRes;
    type Categories = CategoriesObject;
    type Category = CategoryObject;
    type Artist = Artist;
    type Track = TrackObject;
}