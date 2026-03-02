import { apiFetchJson } from './utils/apiClient';

export const locationsService = {
    getLocations: () => apiFetchJson("/locations")
}