import ec = require('essentials/core');

export interface Few<a> extends Array<a> {
    'a few': Few<a>;
    'uses a': a;
}

export function fromOne<a>(value: a) : Few<a> {
    return <any>[value];
}

export function toBest<a>(values: Few<a>, isFirstBetter: (first: a, second: a) => boolean) : a {
    return fold(values, ec.id, (result, value) => isFirstBetter(result, value) ? result : value);
}

export function toFewOrDie<a>(values: a[], failure: string) : Few<a> {
    return withFew(values, ec.id, none => ec.fail<Few<a>>(failure + ' ' + none));
}

export function and<a>(values: Few<a>, is: (value: a) => boolean) : boolean {
    if (!is(values[0])) return false;
    for (var index = 1, length = values.length; index < length; index ++) {
        if (is(values[index])) continue;
        return false;
    }
    return true;
}

export function firstOf<a>(values: Few<a>) : a {
    return values[0];
}

export function lastOf<a>(values: Few<a>) : a {
    return values[values.length - 1];
}

export function or<a>(values: Few<a>, is: (value: a) => boolean) : boolean {
    if (is(values[0])) return true;
    for (var index = 1, length = values.length; index < length; index ++) {
        if (!is(values[index])) continue;
        return true;
    }
    return false;
}

export function toBestMapped<a, b>(
    values: Few<a>,
    map: (value: a, index: number) => b,
    isFirstBetter: (first: b, second: b) => boolean
) : b {
    return fold(
        values,
        map,
        (result, value, index) => ec.apply(
            map(value, index),
            mapped => isFirstBetter(result, mapped) ? result : mapped
        )
    );
}

export function toBestAsMapped<a, b>(
    values: Few<a>,
    map: (value: a, index: number) => b,
    isFirstBetter: (first: b, second: b) => boolean
) : a {
    var result = (<any> values)[0];
    var best = map(result, 0);
    for (var index = 1, length = (<any>values).length; index < length; index ++) {
        var value = (<any> values)[index];
        var mapped = map(value, index);
        if (isFirstBetter(mapped, best)) {
            best = mapped;
            result = value;
        }
    }
    return result;
}    

export function fold<a, r>(
    values: Few<a>,
    toResult: (value: a, index: number) => r,
    fold: (result: r, value: a, index: number) => r
) : r {
    var result = toResult(values[0], 0);
    for (var index = 1, length = values.length; index < length; index ++) {
        result = fold(result, values[index], index);
    }
    return result;
}

export function map<a, b>(
    values: Few<a>,
    map: (value: a, index: number) => b
) : Few<b> {
    var result : Few<b> = <any>[];
    for (var index = 0, length = values.length; index < length; index ++) {
        result.push(map(values[index], index));
    }
    return result;
}

export function concat<a>(ones: Few<a>, anothers: Few<a>) : Few<a> {
    return <Few<a>> ones.concat(anothers);
}

export function mapConcat<a, b>(values: Few<a>, map: (value: a) => Few<b>) : Few<b> {
    return fold(values, map, (result, value) => concat(result, map(value)));
}


export function withFew<a, r>(
    values: a[],
    haveFew: (values: Few<a>) => r,
    haveNone: (reason: string) => r
) : r {
    return values.length > 0 ? haveFew(<any>values) : haveNone(arrayIsEmptyReason);
}

export function fuseOrDie<a, b, c>(
    ones: Few<a>,
    anothers: Few<b>,
    fuse: (one: a, another: b) => c,
    failure: string
) : Few<c> {
    if (ones.length > anothers.length || ones.length < anothers.length) {
        return ec.fail<Few<c>>('Lengths are different.');
    } else {
        var result : Few<c> = <any>[];
        for (var index = 0, length = ones.length; index < length; index ++) {
            result.push(fuse(ones[index], anothers[index]));
        }
        return result;
    }
}

export function use<a>(
    values: Few<a>,
    use: (value: a, index: number) => void
) : void {
    for (var index = 0, length = values.length; index < length; index ++) {
        use(values[index], index);
    }
}

export function toReversed<a>(values: Few<a>) : Few<a> {
    return <Few<a>> values.slice().reverse();
}

export var arrayIsEmptyReason = 'The array is empty.';