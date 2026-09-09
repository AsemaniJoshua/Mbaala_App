/**
 * Supported languages for Mbaala App.
 * Primary target: Northern Ghana livestock farmers.
 */

export interface LanguageOption {
  id: 'en' | 'dag' | 'hau' | 'gur';
  /** Display title */
  name: string;
  /** Native script / phonetic name */
  nativeName: string;
  /** Geographic / cultural tag */
  region: string;
  /** Spoken greeting played on tap */
  greeting: string;
  /** Secondary phonetic pronunciation / translation */
  phoneticGreeting: string;
  /** Primary accent badge */
  tag: string;
  /** Short 2-3 char language badge */
  badge: string;
  /** TTS language code fallback */
  speechCode: string;
  /** Localized action phrase for CTA button */
  actionText: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Standard Ghana',
    greeting: 'Welcome to Mbaala. Tap to continue.',
    phoneticGreeting: 'Welcome to Mbaala',
    tag: 'DEFAULT',
    badge: 'EN',
    speechCode: 'en-US',
    actionText: 'Start Scanning',
  },
  {
    id: 'dag',
    name: 'Dagbani',
    nativeName: 'Dagbanli',
    region: 'Northern Region (Tamale)',
    greeting: 'Ansulaamu alaykum. A yaa Mbaala.',
    phoneticGreeting: 'An-su-laa-mu a-lay-kum',
    tag: 'NORTH',
    badge: 'DAG',
    speechCode: 'en-GH',
    actionText: 'Pillim Womika',
  },
  {
    id: 'hau',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    region: 'Northern Ghana & Sahel',
    greeting: 'Sannu da zuwa Mbaala. Zabi yarenka.',
    phoneticGreeting: 'San-nu da zu-wa',
    tag: 'SAHEL',
    badge: 'HAU',
    speechCode: 'ha',
    actionText: 'Fara Bincike',
  },
  {
    id: 'gur',
    name: 'Gurune',
    nativeName: 'Gurenɛ (Frafra)',
    region: 'Upper East (Bolgatanga)',
    greeting: 'Solege Mbaala. N de baala bɔŋa.',
    phoneticGreeting: 'So-le-ge Mbaa-la',
    tag: 'UPPER EAST',
    badge: 'GUR',
    speechCode: 'en-GH',
    actionText: 'Pilligɛ Nɛŋa',
  },
];
