export interface getTopTracksResponse {
    href: string
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
    items: TrackObject[]
}

export interface getTopArtistsResponse {
    href: string
    limit: number
    next: string | null
    offset: number
    previous: string | null
    total: number
    items: ArtistObject[]
}

export interface ArtistObject {
    external_urls: {
        spotify: string
    }
    followers: {
        href: string | null
        total: number
    }
    genres: string[]
    href: string
    images: ImageObject[]
    name: string
    popularity: number
    type: string
    uri: string
}

export interface TrackObject {
    album: AlbumObject
    artists: ArtistObject[]
    available_markets: string[]
    disc_number: number
    duration_ms: number
    explicit: boolean
    external_ids: {
        isrc: string
        ean: string
        upc: string
    }
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    is_playable: boolean
    linked_from: {
        external_urls: {
            spotify: string
        }
    }
    restrictions?: {
        reason: 'market' | 'product' | 'explicit'
    }
    name: string
    popularity: number
    preview_url: string | null
    track_number: number
    type: string
    uri: string
    is_local: boolean
}

export type AlbumObject = {
    album_type: string
    total_tracks: number
    available_markets: string[]
    external_urls: {
        spotify: string
    }
    href: string
    id: string
    images: ImageObject[]
    name: string
    release_date: string
    release_date_precision: string
    restrictions?: {
        reason: 'market' | 'product' | 'explicit'
    }
    type: string
    uri: string
}

export type ImageObject =
    {
        url: string,
        height: number | null,
        width: number | null,
    }

export interface AudioFeaturesObject {
    acousticness: number;
    analysis_url: string;
    danceability: number;
    duration_ms: number;
    energy: number;
    id: string;
    instrumentalness: number;
    key: number;
    liveness: number;
    loudness: number;
    mode: number;
    speechiness: number;
    tempo: number;
    time_signature: number;
    track_href: string;
    type: string;
    uri: string;
    valence: number;
}

interface CategoryObject {
    href: string;
    icons: ImageObject[];
    id: string;
    name: string;
}

export interface CategoriesObject {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items: CategoryObject[];
}