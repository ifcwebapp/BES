import em = require('essentials/maps');

export interface Statistics {
    countryName: string;
    regionName: string;
    stats: em.Map<Field>;
}

export interface Field {
    title: string;
    countryValue: number;
    countryYear: number;
    regionValue: number;
    regionYear: number;
}

export function isFieldDefined(field: Field) : boolean {
    return field.countryValue != null
        || field.countryYear != null
        || field.regionValue != null
        || field.regionYear != null;
}

export function hasAnyFieldDefined(data: Statistics) {
    return em.hasAnyThat(data.stats, isFieldDefined);
}