import axios from 'axios';
import type { NasaSearchResponse } from '@/features/search/types/nasa-api';

export const PAGE_SIZE = 20;

const nasaApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 15_000,
});

export async function searchNasaImages(
    query: string,
    page = 1,
    signal?: AbortSignal
): Promise<NasaSearchResponse> {
    const { data } = await nasaApi.get<NasaSearchResponse>('/search', {
        params: { q: query, page, page_size: PAGE_SIZE },
        signal,
    });
    return data;
}
