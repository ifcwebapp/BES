import ec = require('essentials/core');
import ea = require('essentials/array');
import ca = require('common/accessors');

export interface Range<a> { from: a; to: a; }
export function rangeFrom<a>(from: a, to: a) { return { from : from, to: to }; }

export function toMappedRangeOrDie<a, b>(
    values: a[],
    map: (value: a) => b,
    isFirstBetter: (first: b, second: b) => boolean,
    isFirstWorse:  (first: b, second: b) => boolean,
    failure: string
) : Range<b> {
    return rangeFrom(
        ea.toMappedBestOrDie(values, map, isFirstWorse, failure + ' Unable to find a max value.'),
        ea.toMappedBestOrDie(values, map, isFirstBetter, failure + ' Unable to find a min value.')
    );
}

export function invert<a>(range: Range<a>) : Range<a> {
    return {
        from: range.to,
        to: range.from
    };
}

export function toBoundingRangeOrDie<a>(
    ranges: Range<a>[],
    isFirstBetter: (first: a, second: a) => boolean,
    isFirstWorse:  (first: a, second: a) => boolean,
    failure: string
) : Range<a> {
    return rangeFrom(
        ea.toMappedBestOrDie(
            ranges,
            ca.fromOf,
            isFirstWorse,
            'Unable to get a range upper boundary.'
        ),
        ea.toMappedBestOrDie(
            ranges,
            ca.toOf,
            isFirstBetter,
            'Unable to get a range lower boundary.'
        )
    );
}

export function toDoubleMappedBoundingRange<a, b, c>(
    values: a[],
    toOuter: (value: a) => b[],
    toInner: (value: b) => c,
    isFirstBetter: (first: c, second: c) => boolean,
    isFirstWorse:  (first: c, second: c) => boolean,
    failure: string
) : Range<c> {
    return toBoundingRangeOrDie(
        ea.map(
            values,
            values => toMappedRangeOrDie(
                toOuter(values),
                toInner,
                isFirstBetter,
                isFirstWorse,
                'Unable to get a bounding range for a set of values.'
            )
        ),
        isFirstBetter,
        isFirstWorse,
        'Unable to get a bounding range accross all sets of values.'
    );
}
