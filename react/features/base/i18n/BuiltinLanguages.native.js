// @flow

import i18next from 'i18next';

/**
 * The builtin languages.
 */
const _LANGUAGES = {

    // German
    'de': {
        languages: require('../../../../lang/languages-de'),
        main: require('../../../../lang/main-de')
    },

    // Spanish
    'es': {
        languages: require('../../../../lang/languages-es'),
        main: require('../../../../lang/main-es')
    },

    // French
    'fr': {
        languages: require('../../../../lang/languages-fr'),
        main: require('../../../../lang/main-fr')
    },

    // Italian
    'it': {
        languages: require('../../../../lang/languages-it'),
        main: require('../../../../lang/main-it')
    },

   // Portuguese
    'pt': {
        languages: require('../../../../lang/languages-pt'),
        main: require('../../../../lang/main-pt')
    }
 };

// Register all builtin languages with the i18n library.
for (const name in _LANGUAGES) { // eslint-disable-line guard-for-in
    const { languages, main } = _LANGUAGES[name];

    i18next.addResourceBundle(
        name,
        'languages',
        languages,
        /* deep */ true,
        /* overwrite */ true);
    i18next.addResourceBundle(
        name,
        'main',
        main,
        /* deep */ true,
        /* overwrite */ true);
}
