import type {Database as DB} from "@/lib/database.types";
import {
    TrackObject,
    AudioFeaturesObject,
    CategoriesObject,
    GetPlaylistResponse,
    PlaylistTrackObject, getTopTracksResponse
} from "@/lib/spotify.types";
import {AverageVibesObject, SongVibesObject, VibedTrack as VibedTrackObject} from "@/lib/vibe.types";

declare global {
    type Database = DB;
    type VibedTrack = VibedTrackObject;
    type AverageVibes = AverageVibesObject;
    type AudioFeatures = AudioFeaturesObject;
    type Categories = CategoriesObject;
    type GetTopTracksResponse = getTopTracksResponse
    type Artist = Artist;
    type Track = TrackObject;
    type SongVibes = SongVibesObject;
    type Playlist = GetPlaylistResponse;
    type PlaylistTrack = PlaylistTrackObject;
}