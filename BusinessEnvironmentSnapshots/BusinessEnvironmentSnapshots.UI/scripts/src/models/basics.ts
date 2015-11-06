import ex = require('essentials/text');

export function toCountryUrl(
    baseUrl: string,
    countryCode: string
) : string { 
    return ex.stripTailIfAny(baseUrl, '/', ex.areStringEqual) + '/country/' + countryCode;
}

export function toCountryUrl2(countryUrlTemplate: string, countryCode: string) : string {
    return countryUrlTemplate.replace('[country-code]', countryCode);
}