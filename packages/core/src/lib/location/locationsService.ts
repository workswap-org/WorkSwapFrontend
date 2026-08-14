import { apiFetchJson } from '@core/lib/common/utils/apiClient';

export const locationsService = {
    getLocations: () => apiFetchJson("/locations")
}