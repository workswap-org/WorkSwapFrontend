export const locales = ['en', 'fi', 'ru'] as const;
export type Locale = (typeof locales)[number];

export function parseLocale(input: string): Locale {
    return locales.includes(input as Locale) ? (input as Locale) : 'en';
}