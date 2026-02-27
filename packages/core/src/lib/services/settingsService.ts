import { apiFetchJson } from './apiClient';

export const settingService = {
    getSupportedLanguages: () => apiFetchJson("/settings/languages"),
    getSupportedPriceTypes: () => apiFetchJson('/settings/price-types')
}