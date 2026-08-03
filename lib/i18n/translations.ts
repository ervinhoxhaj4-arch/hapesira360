export const languages = ['sq', 'en'] as const;

export type Language = (typeof languages)[number];

export const defaultLanguage: Language = 'sq';

export const translations = {
  sq: {
    navigation: {
      home: 'Ballina',
      sale: 'Shitje',
      rent: 'Me Qira',
      map: 'Harta',
      favorites: 'Të preferuarat',
      contact: 'Kontakti',
    },

    homepage: {
      eyebrow: 'Platformë moderne për prona',
      title: 'Gjej hapësirën që të përshtatet.',
      intro:
        'Prona në shitje dhe me qira në Kosovë, të prezantuara me fotografi të qarta, lokacion dhe vizita virtuale 360°.',

      featuredEyebrow: 'Përzgjedhja jonë',
      featuredTitle: 'Prona të veçuara',
      featuredText:
        'Listimet më të fundit për shitje dhe me qira.',
      viewAll: 'Shiko të gjitha',

      experienceEyebrow: 'Përvoja Hapësira360',
      experienceTitle:
        'Shiko më shumë para se ta vizitosh.',
      experienceText:
        'Fotografi, detaje, vizitë 360° kur ekziston dhe lokacion në Google Maps.',
      explore: 'Eksploro pronat',

      nextSpace: 'Hapësira jote e ardhshme',
      saleOrRent: 'Shitje apo me qira?',
      filterText:
        'Filtro pronat sipas qytetit, llojit dhe buxhetit.',
      propertiesForSale: 'Prona në shitje',
      propertiesForRent: 'Prona me qira',
    },

    footer: {
      description:
        'Platformë moderne për prona në Kosovë.',
      contact: 'Kontakt',
      copyright:
        'Të gjitha të drejtat e rezervuara.',
    },
  },

  en: {
    navigation: {
      home: 'Home',
      sale: 'For Sale',
      rent: 'For Rent',
      map: 'Map',
      favorites: 'Favorites',
      contact: 'Contact',
    },

    homepage: {
      eyebrow: 'Modern property platform',
      title: 'Find the space that fits you.',
      intro:
        'Properties for sale and rent in Kosovo, presented with clear photography, locations, and virtual 360° tours.',

      featuredEyebrow: 'Our selection',
      featuredTitle: 'Featured properties',
      featuredText:
        'The latest properties available for sale and rent.',
      viewAll: 'View all',

      experienceEyebrow: 'The Hapësira360 experience',
      experienceTitle:
        'See more before you visit.',
      experienceText:
        'Photography, details, 360° tours when available, and Google Maps locations.',
      explore: 'Explore properties',

      nextSpace: 'Your next space',
      saleOrRent: 'Buying or renting?',
      filterText:
        'Filter properties by city, type, and budget.',
      propertiesForSale: 'Properties for sale',
      propertiesForRent: 'Properties for rent',
    },

    footer: {
      description:
        'A modern property platform for Kosovo.',
      contact: 'Contact',
      copyright: 'All rights reserved.',
    },
  },
} as const;

export function getTranslations(language: Language) {
  return translations[language];
}