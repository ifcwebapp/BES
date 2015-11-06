import ef = require('essentials/few');
import eo = require('essentials/optional');
import ec = require('essentials/core');

export function asArray<a>(arrayLike: { length: number; [index: number]: a; } ) : a[] {
    return Array.prototype.slice.call(arrayLike, 0);
}

export function fromIndexed<a, b>(values: a, toCount: (values: a) => number, toValueAt: (values: a, index: number) => b) : b[] {
    var result : b[] = [];
    for (var index = 0, length = toCount(values); index < length; index ++) {
        result.push(toValueAt(values, index));
    }
    return result;
}

export function pick<a, b>(values: a[], pick: (value: a, index: number) => eo.Optional<b>) : eo.Optional<b> {
    for (var index = 0, length = values.length; index < length; index ++) {
        var picked = pick(values[index], index);
        if (eo.isSome(picked)) {
            return picked;
        }
    }
    return eo.noneFrom('Nothing to pick from.');
}

export function mapChunked<a, b>(values: a[], size: number, map: (chunk: a[]) => b) : b[] {
    var length = values.length;
    if (size <= length) {
        var result : b[] = [];
        for (var chunk = 0; chunk * size < length; chunk ++) {
            result.push(map(values.slice(chunk * size, (chunk + 1) * size)));
        }
        return result;
    } else {
        return [map(values)];
    }
}

export function withNoneOf3<a, b, c, r>(
    alphas: a[], bravos: b[], charlies: c[],
    haveNone: () => r,
    haveSome: (
        toReason: (
            nameAlphas: () => string,
            nameBravos: () => string,
            nameCharlies: () => string
        ) => string
    ) => r
) : r {
    return  alphas.length > 0
        ?   haveSome(nameAlphas => 'There are ' + nameAlphas() + '.')
        :   bravos.length > 0
            ?   haveSome((_, nameBravos) => 'There are ' + nameBravos() + '.')
            :   charlies.length > 0
                ?   haveSome((_1, _2, nameCharlies) => 'There are ' + nameCharlies() + '.')
                :   haveNone();
}

export function withNoneOf4<a, b, c, d, r>(
    alphas: a[], bravos: b[], charlies: c[], deltas: d[],
    haveNone: () => r,
    haveSome: (
        toReason: (
            nameAlphas: () => string,
            nameBravos: () => string,
            nameCharlies: () => string,
            nameDeltas: () => string
        ) => string
    ) => r
) : r {
    return  alphas.length > 0
        ?   haveSome(nameAlphas => 'There are ' + nameAlphas() + '.')
        :   bravos.length > 0
            ?   haveSome((_, nameBravos) => 'There are ' + nameBravos() + '.')
            :   charlies.length > 0
                ?   haveSome((_1, _2, nameCharlies) => 'There are ' + nameCharlies() + '.')
                :   deltas.length > 0
                    ?   haveSome((_1, _2, _3, nameDeltas) => 'There are ' + nameDeltas() + '.')
                    :   haveNone();
}



export function withNoneOf5<a, b, c, d, e, r>(
    alphas: a[], bravos: b[], charlies: c[], deltas: d[], echos: e[],
    haveNone: () => r,
    haveSome: (
        toReason: (
            nameAlphas:   () => string,
            nameBravos:   () => string,
            nameCharlies: () => string,
            nameDeltas:   () => string,
            nameEchos:    () => string
        ) => string
    ) => r
) : r {
    return  alphas.length > 0
        ?   haveSome(nameAlphas => 'There are ' + nameAlphas() + '.')
        :   bravos.length > 0
            ?   haveSome((_, nameBravos) => 'There are ' + nameBravos() + '.')
            :   charlies.length > 0
                ?   haveSome((_1, _2, nameCharlies) => 'There are ' + nameCharlies() + '.')
                :   deltas.length > 0
                    ?   haveSome((_1, _2, _3, nameDeltas) => 'There are ' + nameDeltas() + '.')
                    :   echos.length > 0
                        ?   haveSome((_1, _2, _3, _4, nameEchos) => 'There are ' + nameEchos() + '.')
                        :   haveNone();
}

export function map<a, b>(values: a[], map: (value: a, index: number) => b) : b[] {
    var result : b[] = [];
    for (var index = 0, length = values.length; index < length; index ++) {
        result.push(map(values[index], index));
    }
    return result;
}

export function concat<a>(left: a[], right: a[]) : a[] {
    return left.concat(right);
}

export function concatAll<a>(values: a[][]) : a[] {
    return fold(
        values,
        <a[]>[],
        concat
    );
}

export function insert<a>(values: a[], value: a, index: number) : a[] {
    values.splice(index, 0, value);
    return values;
}

export function mapConcat<a, b>(values: a[], map: (value: a) => b[]) : b[] {
    return fold(values, <b[]>[], (result, value) => concat(result, map(value)));
}

export function choose<a, b>(values: a[], map: (value: a) => eo.Optional<b>) : b[] {
    return fold(
        values,
        <b[]>[],
        (result, value) => eo.withSomeOrDefault(
            map(value),
            mapped => append(result, mapped),
            result
        )
    );
}

export function mapPairs<a, b>(values: a[], map: (one: a, another: a) => b) : b[] {
    var result : b[] = [];
    for (var index = 0, length = values.length; index < length; index += 2) {
        result.push(map(values[index], values[index + 1]));
    }
    return result;
}

export var use: <a>(values: a[], use: (value: a, index: number) => void) => void = ef.use;


export function fold<a, r>(values: a[], result: r, fold: (result: r, value: a, index: number) => r) : r {
    for (var index = 0, length = values.length; index < length; index ++) {
        result = fold(result, values[index], index);
    }
    return result;
}


export function prepend<a>(value: a, result: a[]) : a[] {
    result.unshift(value);
    return result;
}

export function append<a>(result: a[], value: a) : a[] {
    return (result.push(value), result);
}

export function appendAll<a>(result: a[], values: a[]): a[] {
    return fold(values, result, append);
}

export function appendThrough<a>(result: a[], value: a) : a {
    return (result.push(value), value);
}


export function fuseOrDie<a, b, c>(ones: a[], anothers: b[], fuse: (one: a, another: b, index: number) => c, failure: string) : c[] {
    var result : c[] = [];
    var length = ones.length;
    var anotherLength = anothers.length;
    if (length !== anotherLength) return ec.fail<typeof result>(failure + ' Unable to fuse 2 arrays whose lengths are different (' + length + ' vs. ' + anotherLength + ').');
    for (var index = 0; index < length; index ++) {
        result.push(fuse(ones[index], anothers[index], index));
    }
    return result;
}


export function toBestOrDie<a>(values: a[], isFirstBetter: (first: a, second: a) => boolean, failure: string) : a {
    if (values.length < 1) {
        return ec.fail<a>(failure + ' ' + ef.arrayIsEmptyReason);
    } else {
        var best = values[0];
        for (var index = 1, length = values.length; index < length; index ++) {
            var value = values[index];
            if (isFirstBetter(value, best)) {
                best = value;
            }
        }
        return best;
    }
}

export function toMappedBestOrDie<a, b>(
    values: a[],
    map: (value: a, index: number) => b,
    isFirstBetter: (first: b, second: b) => boolean,
    failure: string
) : b {
    if (values.length < 1) {
        return ec.fail<b>(failure + ' ' + ef.arrayIsEmptyReason);
    } else {
        var best = map(values[0], 0);
        for (var index = 1, length = values.length; index < length; index ++) {
            var value = map(values[index], index);
            if (isFirstBetter(value, best)) {
                best = value;
            }
        }
        return best;
    }
}

export function withHeadOrDefault<a, r>(
    values: a[],
    haveHead: (first: a, rest: a[]) => r,
    defaultResult: r
) : r {
    if (values.length > 0) {
        return haveHead(values[0], values.slice(1));
    } else {
        return defaultResult;
    }
}

export function filter<a>(values: a[], shouldKeep: (value: a, index: number) => boolean) : a[] {
    var result : a[] = [];
    for (var  index = 0, length = values.length; index < length; index ++) {
        var value = values[index];
        if (shouldKeep(value, index)) {
            result.push(value);
        }
    }
    return result;
}

export function toFirstThatOrDefault<a>(values: a[], isThat: (value: a, index: number) => boolean, defaultResult: a) : a {
    var result : a[] = [];
    for (var index = 0, length= values.length; index < length; index ++) {
        var value = values[index];
        if (isThat(value, index)) { 
            return value
        }
    }
    return defaultResult;
}

export function toFirstThatOrToDefault<a>(values: a[], isThat: (value: a, index: number) => boolean, toDefaultResult: () => a) : a {
    var result : a[] = [];
    for (var index = 0, length= values.length; index < length; index ++) {
        var value = values[index];
        if (isThat(value, index)) { 
            return value
        }
    }
    return toDefaultResult();
}

export function toFirstThatOrDie<a>(values: a[], isThat: (value: a, index: number) => boolean, failure: string) : a {
    var result : a[] = [];
    for (var index = 0, length= values.length; index < length; index ++) {
        var value = values[index];
        if (isThat(value, index)) { 
            return value
        }
    }
    return ec.fail<a>(failure + ' Unable to find a value that satisfies a given criterion.');
}

export function withUpTo2<a, r>(
    values: a[],
    haveOne: (value: a) => r,
    haveTwo: (one: a, two: a) => r,
    haveOtherwise: (reason: string) => r
) : r {
    switch (values.length)  {
        case 0: return haveOtherwise(ef.arrayIsEmptyReason);
        case 1: return haveOne(values[0]);
        case 2: return haveTwo(values[0], values[1]);
        default: return haveOtherwise('There are ' + values.length + ' elements in the array.');
    }
}

export function withFirstBeforeLike<a, r>(
    values: a[],
    sample: a,
    areAlike: (one: a, another: a) => boolean,
    havePrevious: (value: a) => r,
    haveNone: (reason: string) => r
) : r {
    var length = values.length;
    if (length > 0) {
        for (var index = 0; index < length; index ++) {
            var current = values[index];
            if (areAlike(sample, current)) {
                if (index > 0) {
                    return havePrevious(values[index - 1]);
                } else {
                    return haveNone('There is no previous value before the one that is searched. The seached value comes first.');
                }
            } else {
                continue;
            }
            return haveNone('Unable to find a searched value.');
        }
    } else {
        return haveNone(ef.arrayIsEmptyReason);
    }
}

export function withFirstAfterLike<a, r>(
    values: a[],
    sample: a,
    areAlike: (one: a, another: a) => boolean,
    haveNext: (value: a) => r,
    haveNone: (reason: string) => r
) : r {
    var length = values.length;
    if (length > 0) {
        for (var index = 0; index < length; index ++) {
            var current = values[index];
            if (areAlike(sample, current)) {
                if (index < length - 1) {
                    return haveNext(values[index + 1]);
                } else {
                    return haveNone('There is no next value after the one that is searched. The searched value comes last.');
                }
                break;
            } else {
                continue;
            }
        }
        return haveNone('Unable to find a searched value.');
    } else {
        return haveNone(ef.arrayIsEmptyReason);
    }
}

export function asOfLength2OrDie<a>(values: a[], failure: string) : [a, a] {
    return values.length > 2 ||  values.length < 2
        ? ec.fail<[a, a]>(failure + ' Given an array of ' + values.length + ', whereas exactly 2 values are expected.')
        : <[a, a]>values;
}


export function toShallowCopy<a>(values: a[]) : a[] {
    return values.slice();
}

export function toReversed<a>(values: a[]): a[] {
    var result = toShallowCopy(values);
    result.reverse();
    return result;
}