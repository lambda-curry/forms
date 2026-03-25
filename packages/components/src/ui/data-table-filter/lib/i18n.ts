import en from '../locales/en.json';

export type Locale = 'en' | string;

type Translations = Record<string, string>;

const translations: Record<string, Translations> = {
  en,
};

export function t(key: string, locale: Locale): string {
  return translations[locale]?.[key] ?? translations.en[key] ?? key;
}

export function pluralize(text: string, locale: Locale): string {
  // If no locale provided, default to english behavior
  const loc = locale || 'en';

  try {
    const rules = new Intl.PluralRules(loc);
    const options = rules.resolvedOptions();

    // If the language has only one category (e.g. 'other'), it doesn't distinguish plural forms (like Japanese, Chinese)
    if (options.pluralCategories.length === 1) {
      return text;
    }
  } catch (e) {
    // Fallback if Intl.PluralRules fails or locale is invalid
    console.warn(`[i18n] Invalid locale for PluralRules: ${loc}`, e);
  }

  // Improved English pluralization
  if (loc.startsWith('en')) {
    // Handle 'y' ending (e.g. category -> categories, but boy -> boys)
    if (text.endsWith('y') && !/[aeiou]y/i.test(text)) {
      return `${text.slice(0, -1)}ies`;
    }

    // Handle sibilants (e.g. box -> boxes, bus -> buses, watch -> watches)
    if (/[sxz]$/i.test(text) || /[cs]h$/i.test(text)) {
      return `${text}es`;
    }
  }

  // Default: append 's'
  // This matches the original behavior but is now safer for non-plural languages (checked above)
  return `${text}s`;
}
