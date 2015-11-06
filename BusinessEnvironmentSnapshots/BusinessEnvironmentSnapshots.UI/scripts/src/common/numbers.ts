import * as ec from 'essentials/core';
import * as en from 'essentials/numbers';
import * as eo from 'essentials/optional';

export function parseAsEitherFloatingOrInteger(
    floatingValue: eo.Optional<string>,
    integerValue: eo.Optional<string>,
    failure: string
) : number {
    return eo.outOf2(
        floatingValue,
        integerValue,
        () => ec.fail<number>(failure + ' The value is both floating point and integer.'),
        value => en.toFloatOrDie(value, failure + ' Unable to read a floating point value.'),
        value => en.toIntegerOrDie(value, failure + ' Unable to read an integer value.'),
        () => ec.fail<number>(failure + ' The value is nither floating point nor integer.')
    );
}