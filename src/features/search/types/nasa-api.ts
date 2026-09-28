export type MediaType = 'image' | 'video' | 'audio';

export interface NasaSearchResponse {
    collection: NasaCollection;
}

export interface NasaCollection {
    version: string;
    href: string;
    items: NasaItem[];
    metadata: NasaMetadata;
    /** Absent when there are no further pages (e.g. empty results). */
    links?: NasaCollectionLink[];
}

export interface NasaItem {
    href: string;
    data: NasaItemData[];
    /** Absent for most audio items. */
    links?: NasaItemLink[];
}

export interface NasaItemData {
    center: string;
    title: string;
    nasa_id: string;
    media_type: MediaType;
    date_created: string;
    description?: string;
    keywords?: string[];
    photographer?: string;
    location?: string;
    description_508?: string;
    secondary_creator?: string;
    album?: string[];
}

export interface NasaItemLink {
    href: string;
    rel: string;
    render?: string;
    width?: number;
    height?: number;
    size?: number;
}

export interface NasaMetadata {
    total_hits: number;
}

export interface NasaCollectionLink {
    rel: 'next' | 'prev';
    prompt: string;
    href: string;
}

/** Flattened view of a search result, ready for rendering. */
export interface SearchResultItem {
    id: string;
    title: string;
    description?: string;
    mediaType: MediaType;
    dateCreated: string;
    center: string;
    keywords: string[];
    previewUrl?: string;
}

export interface SearchResults {
    items: SearchResultItem[];
    totalHits: number;
}
