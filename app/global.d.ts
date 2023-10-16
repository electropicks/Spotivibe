import type {Database as DB} from "@/lib/database.types";
import {
    getTopTracksResponse as TopTrackRes,
    getTopArtistsResponse as TopArtistRes,
    ArtistObject as Artist,
    TrackObject as Track,
    AlbumObject as Album,
    ImageObject as Image
} from "@/lib/spotify.types";

declare global {
    type Database = DB;
    type getTopTracksResponse = TopTrackRes;
    type getTopArtistsResponse = TopArtistRes;
    type ArtistObject = Artist;
    type TrackObject = Track;
    type AlbumObject = Album;
    type ImageObject = Image;
}