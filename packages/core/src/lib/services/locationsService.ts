import { apiFetchJson } from './apiClient';

export const locationsService = {
    getLocations: () => apiFetchJson("/locations")
}