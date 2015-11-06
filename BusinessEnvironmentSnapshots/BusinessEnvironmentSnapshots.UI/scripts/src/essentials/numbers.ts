
import ec = require('essentials/core');
import eo = require('essentials/optional');

export function maxOf2(one: number, two: number) : number {
    return one > two ? one : two;
}

export function minOf2(one: number, two: number) : number {
    return one < two ? one : two;
}

export function isFirstGreater(first: number, second: number) : boolean {
    return first > second;
}

export function isFirstLess(first: number, second: number) : boolean {
    return first < second;
}

export function toRadian(degrees: number) : number {
    return Math.PI * degrees / 180;
}

export function fromatAsHex(value: number) : string {
    return value.toString(16);
}

export function toIntegerOrDie(value: string, failure: string) : number {
    return withInteger(value, ec.id, none => ec.fail<number>(failure + ' ' + none));
}

export function toFloat(value: string) : eo.Optional<number> {
    return withFloat<eo.Optional<number>>(value, eo.someFrom, eo.noneFrom);
}

export function toFloatOrDie(value: string, failure: string) : number {
    return withFloat(value, ec.id, none => ec.fail<number>(failure + ' ' + none));
}

export function withInteger<r>(value: string, haveInteger: (value: number) => r, haveNone: (reason: string) => r) : r {
    var result = parseInt(value, 10);
    if (isNaN(result)) {
        return haveNone('The given value \'' + value + '\' is not a number.');
    } else {
        return haveInteger(result);
    }
}

export function withFloat<r>(value: string, haveFloat: (value: number) => r, haveNone: (reason: string) => r) : r {
    var result = parseInt(value, 10);
    if (isNaN(result)) {
        return haveNone('The given value \'' + value + '\' is not a number.');
    } else {
        return haveFloat(result);
    }
}


export function isPositive(value: number) : boolean {
    return value > 0;
}

export function toIntegerUnsafe(value: string): number {
    return parseInt(value, 10);
}


export function toFloatUnsafe(value: string): number {
    return parseFloat(value);
}

