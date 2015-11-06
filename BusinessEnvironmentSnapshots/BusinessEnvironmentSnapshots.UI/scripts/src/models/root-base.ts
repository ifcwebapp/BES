import ko = require('knockout');
import ec = require('essentials/core');
import ef = require('essentials/futures');
import ea = require('essentials/array');
import erq = require('essentials/request');
import dr = require('data/requested');
import d3 = require('d3');
import mchu = require('models/charting/utils');
import dsr = require('data/series');
import drp = require('data/repository');
import dcn = require('data/country');
import mnv = require('models/navigation');

type Option = {
    value: string,
    text: string;
    isSelected: boolean
}

var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export interface RootBase {
    formatValue(valueOpt: number, suffixOpt: string): string;
    formatMoney(valueOpt: number): string;
    formatDate(date: Date): string;
    parseDate(value: string): Date;
    formatReading(reading: dsr.Reading, valueSuffixOpt: string): string;
    toLowIncomeCountries<a>(navigation: mnv.Navigation<dcn.Country>): Option[];
    toHighIncomeCountries(navigation: mnv.Navigation<dcn.Country>): Option[];
    lightbox: KnockoutObservable<any>;
}


export function mapCountries<r>(
    repository: drp.Repository,
    map: (countries: dcn.Country[]) => r
): ef.Once<r> {
    return ef.map(
        repository.requestCountries(),
        countries => {
            return dr.outOfRequested(
                countries,
                countries => map(countries),
                reason => ec.fail<r>('Unable to get countries reason.')
            );
        }
    );
}

export var rootBase = {
    lightbox: ko.observable(null),
    formatValue: mchu.formatNullableValue,
    formatMoney: d3.format(','),
    formatDate(date: Date): string {
        return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
    },
    parseDate(value: string): Date {
        return new Date(value);
    },
    formatReading(reading: dsr.Reading, valueSuffixOpt: string): string {
        return mchu.formatNullableValueString(reading.valueString, reading.suffix || valueSuffixOpt);
    },
    toLowIncomeCountries<a>(navigation: mnv.Navigation<dcn.Country>): Option[] {
        return ea.fold(
            navigation.values,
            <Option[]>[],
            (result, country, index) => !country.isHighIncome
                ? ea.append(
                    result,
                    <Option> { isSelected: navigation.toKey(country) === navigation.originalKey, text: country.name, value: navigation.toKey(country) }
                )
                : result
        );
    },
    toHighIncomeCountries(navigation: mnv.Navigation<dcn.Country>): Option[] {
        return ea.fold(
            navigation.values,
            <Option[]>[],
            (result, country, index) => country.isHighIncome
                ? ea.append(
                    result,
                    <Option> { isSelected: navigation.toKey(country) === navigation.originalKey, text: country.name, value: navigation.toKey(country) }
                )
                : result
        );
    }
};