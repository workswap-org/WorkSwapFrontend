import { apiFetchJson } from './utils/apiClient';

export const settingService = {
    getSupportedLanguages: () => apiFetchJson("/settings/languages"),
    getSupportedPriceTypes: () => apiFetchJson('/settings/price-types')
}