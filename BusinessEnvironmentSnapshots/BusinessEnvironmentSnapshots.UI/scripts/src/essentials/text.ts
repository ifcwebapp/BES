import * as ec from 'essentials/core';
import * as ea from 'essentials/array';
import * as eo from 'essentials/optional';

export function withLongerFirst<r>(
    one: string,
    another: string,
    haveLongerFirst: (longer: string, shorter: string) => r
) : r {
    return one.length > another.length
        ? haveLongerFirst(one, another)
        : haveLongerFirst(another, one);
}

export function startsWith(value: string, pattern: string): boolean  {
    return pattern.length <= value.length && value.substr(0, pattern.length) === pattern;
}

export function stripHeadIfAny(
    value: string,
    pattern: string,
    areEqual: (one: string, another: string) => boolean
) : string {
    if (value.length >= pattern.length) {
        if (areEqual(value.substr(0, pattern.length), pattern)) {
            return value.substr(pattern.length);
        } else {
            return value;
        }
    } else {
        return value;
    }
}

export function engraveRight(surface: string, value: string) : string {
    return surface.length < value.length
        ? ec.fail<string>('Unable to engrave. The surface \'' + surface + '\' is shorter than the value \'' + value + '\'.')
        : surface.substr(0, surface.length - value.length) + value;
}

export function stripTailIfAny(
    value: string,
    pattern: string,
    areEqual: (one: string, another: string) => boolean
) : string {
    if (value.length >= pattern.length) {
        if (areEqual(value.substr(value.length - pattern.length), pattern)) {
            return value.substr(0, value.length  - pattern.length);
        } else {
            return value;
        }
    } else {
        return value;
    }
}

export function areStringEqual(one: string, another: string) : boolean {
    return one === another;
}

export function trim(value: string) : string {
    return value.replace(/^\s+|\s+$/g, '');
}

export function toNonBlank(value: string) : eo.Optional<string> {
    var trimmed = trim(value);
    return trimmed === '' ? eo.fromNoneOf<string>(dueTo.beingBlank) : eo.fromSome(trimmed);
}

var dueTo = {
    beingBlank: 'String is blank.'
}

export function isNonBlank(value: string) : boolean {
    return !isBlank(value);
}

export function isBlank(value: string) : boolean {
    return /^\s*$/.test(value);
}

export function useNonBlank(value: string, useNonBlank: (value: string) => void) : void {
    if (!isBlank(value)) {
        useNonBlank(value);
    }
}

export function toMatches(pattern: string, flags: string, value: string) : string[][] {
    var regex = new RegExp(pattern, flags);
    var match: string[];
    var result : string[][] = [];
    while ((match = regex.exec(value)) != null) {
        result.push(ea.asArray(match));
    }
    return result;
}

export function withTrimmedNonBlank<r>(
    value: string,
    haveTrimmedNonBlank: (value: string) => r,
    haveEmpty: (value: string) => r
) : r {
    var trimmed = trim(value);
    return trimmed.length > 0 ? haveTrimmedNonBlank(trimmed) : haveEmpty(trimmed);
}