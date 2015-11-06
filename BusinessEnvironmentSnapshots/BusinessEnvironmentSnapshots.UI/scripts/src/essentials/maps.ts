import ec = require('essentials/core');
import ea = require('essentials/array');
import en = require('essentials/numbers');
export interface Map<a> {
    [key: string]: a;
}

export function toMapOf<a>() : Map<a> {
    return {};
}

export function fold<a, r>(values: Map<a>, result: r, fold: (result: r, value: a, key: string) => r) : r {
    for (var key in values) {
        result = fold(result, values[key], key); 
    }
    return result;
}

export function toArrayUnsafe<a, b>(values: Map<a>, map: (value: a, key: string) => b) : b[] {
    return fold(values, <b[]> [], (result, value, key) => ea.append(result, map(value, key)));
}

export function atOrDie<a>(values: Map<a>, key: string, failure: string) : a {
    return key in values ? values[key] : ec.fail<a>(failure + ' There is no value at the \'' + key + '\' key.');
}

export function atOrDefault<a>(values: Map<a>, key: string, defaultResult: a) : a {
    return key in values ? values[key] : defaultResult;
}

export function use<a>(values: Map<a>, use: (value: a, key: string, values: Map<a>) => void) : void {
    for (var key in values) {
        use(values[key], key, values);
    }
}

export function count<a>(values: a[], toKey: (value: a) => string) : Map<number> {
    return ea.fold(
        values,
        toMapOf<number>(),
        (result, value) => withAt(
            result,
            toKey(value),
            (count, key) => addUnsafe(
                result,
                count + 1,
                key
            ),
            (_, key) => addUnsafe(
                result,
                1,
                key
            )
        )
    );
}

export function hasAnyAt<a>(values: Map<a>, key: string): boolean {
    return key in values;
}

export function hasAnyThat<a>(values: Map<a>, isThat: (value: a, key: string) => boolean) : boolean {
    for (var key in values) {
        var value = values[key];
        if (isThat(value, key)) return true;
    }
    return false;
}

export function addUnsafe<a>(values: Map<a>, value: a, key: string) : Map<a> {
    values[key] = value;
    return values;
}

export function alwaysToMapOf<a>() : () => Map<a> {
    return toMapOf;
}

export function withAt<a, r>(values: Map<a>, key: string, haveValue: (value: a, key: string) => r, haveNone: (reason: string, key: string) => r) : r {
    return key in values ? haveValue(values[key], key) : haveNone('There is nothing at the \'' + key + '\'.', key);
}

export function fromArrayUnsafe<a, b>(values: a[], toKey: (value: a, index: number) => string, toValue: (value: a, index: number) => b) : Map<b> {
    return ea.fold(
        values,
        toMapOf<b>(),
        (result, value, index) => addUnsafe(
            result,
            toValue(value, index),
            toKey(value, index)
        )
    );
}