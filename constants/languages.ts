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
  /** TTS language code fallback */
  speechCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  {
    id: 'en',
    name: 'English',
    nativeName: 'English',
    region: 'Standard / Ghana',
    greeting: 'Welcome to Mbaala. Tap to continue.',
    phoneticGreeting: 'Welcome to Mbaala',
    tag: 'DEFAULT',
    speechCode: 'en-US',
  },
  {
    id: 'dag',
    name: 'Dagbani',
    nativeName: 'Dagbanli',
    region: 'Northern Region (Tamale)',
    greeting: 'Ansulaamu alaykum. A yaa Mbaala.',
    phoneticGreeting: 'An-su-laa-mu a-lay-kum',
    tag: 'NORTH',
    speechCode: 'en-GH',
  },
  {
    id: 'hau',
    name: 'Hausa',
    nativeName: 'Harshen Hausa',
    region: 'Northern Ghana & Sahel',
    greeting: 'Sannu da zuwa Mbaala. Zabi yarenka.',
    phoneticGreeting: 'San-nu da zu-wa',
    tag: 'SAHEL',
    speechCode: 'ha',
  },
  {
    id: 'gur',
    name: 'Gurune',
    nativeName: 'Gurenɛ (Frafra)',
    region: 'Upper East (Bolgatanga)',
    greeting: 'Solege Mbaala. N de baala bɔŋa.',
    phoneticGreeting: 'So-le-ge Mbaa-la',
    tag: 'UPPER EAST',
    speechCode: 'en-GH',
  },
];
