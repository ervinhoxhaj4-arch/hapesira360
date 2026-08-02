import type { UiProperty } from './types';

export const properties: UiProperty[] = [
  {
    id: 'apartament-modern-prizren',
    title: 'Apartament modern me pamje të hapur',
    purpose: 'shitje',
    type: 'Apartament',
    city: 'Prizren',
    neighborhood: 'Bazhdarhane',
    price: 145000,
    area: 98,
    bedrooms: 2,
    bathrooms: 1,
    floor: 3,
    description:
      'Apartament modern, i ndriçuar dhe i organizuar mirë, në një nga zonat më të kërkuara të Prizrenit. Prona ofron hapësira të rehatshme, ballkon dhe qasje të shpejtë në qendër.',
    coverImage:
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
    ],
    tour360Url:
      'https://kuula.co/share/collection/7qQZP?logo=1&info=0&fs=1&vr=0&zoom=1&thumbs=1',
    latitude: 42.2139,
    longitude: 20.7397,
    featured: true,
    published: true,
  },
  {
    id: 'apartament-me-qira-prishtine',
    title: 'Apartament elegant afër qendrës',
    purpose: 'qira',
    type: 'Apartament',
    city: 'Prishtinë',
    neighborhood: 'Lakrishtë',
    price: 650,
    area: 82,
    bedrooms: 2,
    bathrooms: 1,
    floor: 6,
    description:
      'Apartament i mobiluar me stil modern, ideal për banim afatgjatë. Ndodhet pranë qendrës dhe ka qasje të lehtë në shërbimet kryesore.',
    coverImage:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=85',
      'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=85',
    ],
    latitude: 42.6557,
    longitude: 21.1437,
    featured: true,
    published: true,
  },
  {
    id: 'shtepi-familjare-ferizaj',
    title: 'Shtëpi familjare me oborr',
    purpose: 'shitje',
    type: 'Shtëpi',
    city: 'Ferizaj',
    neighborhood: 'Qendër',
    price: 235000,
    area: 210,
    bedrooms: 4,
    bathrooms: 2,
    description:
      'Shtëpi e bollshme familjare me oborr privat dhe organizim praktik në dy kate.',
    coverImage:
      'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=85',
    images: [
      'https://images.unsplash.com/photo-1600585152915-d208bec867a1?auto=format&fit=crop&w=1600&q=85',
    ],
    latitude: 42.3702,
    longitude: 21.1553,
    featured: false,
    published: true,
  },
];

export const getProperty = (id: string) =>
  properties.find((property) => property.id === id);