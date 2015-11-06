import * as ec from 'essentials/core';
import * as eo from 'essentials/optional';

export function atOrDie<a>(values: a[], index: number, failure: string) : eo.Optional<a> {
    return index < values.length
        ? eo.fromNullable(values[index])
        : ec.fail<eo.Optional<a>>('The index is outside of the array.');
} 