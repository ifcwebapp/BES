import em = require('essentials/maps');
import ec = require('essentials/core');
import ko = require('knockout');

export interface Navigation<a> {
    values: a[];
    originalKey: string;
    toKey(value: a): string;
    whenChanged(model: any, e: any): void;
}

export function toNavigation<a>(
    values: a[],
    valueOpt: a,
    toKey: (valueOpt: a) => string,
    useValue: (valueOpt: a) => void
) : Navigation<a> {
    var mapped = em.fromArrayUnsafe(values, toKey, ec.id);
    var originalKey = toKey(valueOpt);
    return {
        values: values,
        originalKey: toKey(valueOpt),
        whenChanged(_: any, e: any) {
            var key = e.target.value;
            if (key !== originalKey) {
                useValue(mapped[key]);
            }
        },
        toKey: toKey
    };
}

