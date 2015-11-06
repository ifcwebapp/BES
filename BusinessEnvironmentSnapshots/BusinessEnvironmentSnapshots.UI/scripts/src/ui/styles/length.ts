import * as ec from 'essentials/core';
import * as ea from 'essentials/array';
import * as eas from 'essentials/array-sparse';
import * as enm from 'essentials/numbers-measured';
import * as ex from 'essentials/text';
import * as en from 'essentials/numbers';
import * as eo from 'essentials/optional';
import * as cn from 'common/numbers';

export type Length = number | enm.Measured<Unit>;

export const enum Unit { Px, Pt, Em }

export interface ViaUnit<r> {
    caseOfPx(): r;
    caseOfPt(): r;
    caseOfEm(): r;
}



export function viaUnit<r>(
    unit: Unit,
    via: ViaUnit<r>
): r {
    switch (unit) {
        case Unit.Px: return via.caseOfPx();
        case Unit.Pt: return via.caseOfPt();
        case Unit.Em: return via.caseOfEm();
        default: return ec.fail<r>('Unexpected case \'' + unit + '\' of a DOM unit.');
    }
}

export function parseUnit(value: string): eo.Optional<eo.Optional<Unit>> {
    switch (value) {
        case 'px': return { some: { some: Unit.Px } };
        case 'em': return { some: { some: Unit.Em } };
        case 'pt': return { some: { some: Unit.Pt } };
        case '': return { some: { none: 'Unit is omitted.' } };
        default: return { none: 'Unexpected value for a DOM unit.' };
    }
}

export function parseLengthListOrDie(values: string, failure: string): Length[] {
    return ea.map(
        ex.toMatches('(\\s*|\\s*\\,\\s*)?((\\d+\\.\\d+|\\.\\d+)|(\\d+))(\\w*)', 'g', values),
        matches => _parseLengthOrDie(
            eas.atOrDie(matches, 3, failure + ' Unable to get a floating point length value.'),
            eas.atOrDie(matches, 4, failure + ' Unable to get an integer length value.'),
            eas.atOrDie(matches, 5, 'Unable to get a unit of the value.'),
            failure
        )
    );
}

export function tryParseLength(value: string, failure: string): eo.Optional<Length> {
    var matches = /((\d+\.\d+|\.\d+)|(\d+))(\w+)/.exec(value);
    if (matches != null) {
        return eo.fromSome(_parseLengthOrDie(
            eas.atOrDie(matches, 2, failure + ' Unable to get a floating point length value.'),
            eas.atOrDie(matches, 3, failure + ' Unable to get an integer length value.'),
            eas.atOrDie(matches, 4, 'Unable to get a unit of the value.'),
            failure
        ));
    } else {
        return { none: 'Invalid length value.' };
    }
}

function _parseLengthOrDie(
    floatingValue: eo.Optional<string>,
    integerValue: eo.Optional<string>,
    unitValue: eo.Optional<string>,
    failure: string
): Length {
    var value = cn.parseAsEitherFloatingOrInteger(
        floatingValue,
        integerValue,
        failure + ' Unable to get a length value.'
    );
    var unit = eo.bind(
        unitValue,
        some => eo.asSomeOrDie(parseUnit(some), failure + ' Unable to get a length unit.')
    );
    return eo.isSome(unit) ? enm.measuredFrom(value, unit.some) : value;
}

export function toPixels(length: Length): number {
    return typeof length === 'number' ? length : viaUnit(length.unit, {
        caseOfEm: () => ec.fail<number>('Conversion from em to px is not supported.'),
        caseOfPt: () => ec.fail<number>('Conversion from pt to px is not supported.'),
        caseOfPx: () => length.value
    });
}
 

export function map(length: Length, map: (value: number) => number) : Length {
    return typeof length === 'number' ? map(length) : { unit: length.unit, value: map(length.value) };
}