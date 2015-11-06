import ec = require('essentials/core');

export interface Some<a> {
    some: a;
}
export interface None {
    none: string;
}

export type Optional<a> = Some<a> | None;

export function asSomeOrDefault<a>(value: Optional<a>, defaultValue: a) : a {
    return isSome(value) ? value.some : defaultValue;
}

export function asSomeOrDie<a>(value: Optional<a>, failure: string) : a {
    return isSome(value) ? value.some : ec.fail<a>(failure + ' ' + value.none);
}

export function use<a>(value: Optional<a>, use: (value: a) => void): void {
    return outOf(value, use, ec.ignore);
}

export function useAlpha<b, Alpha>(
    value: Optional<b>,
    alpha: Alpha,
    use: (value: b, alpha: Alpha) => void
) : void {
    return isSome(value) ? use(value.some, alpha) : ec.nothing;
}

export function fromNullable<a>(valueOpt: a): Optional<a> {
    return valueOpt === null
        ? fromNoneOf<a>('Value is null.')
        : valueOpt === undefined
            ? fromNoneOf<a>('Value is undefined.')
            : fromSome(valueOpt);
}

export function someFrom<a>(value: a) : Some<a> {
    return {
        some: value
    };
}

export function noneFrom(reason: string) : None {
    return {
        none: reason
    };
}
export function fromSome<a>(value: a) : Optional<a> {
    return someFrom(value);
}
export function fromNoneOf<a>(reason: string) : Optional<a> {
    return noneFrom(reason);
}

export function isSome<a>(optional: Optional<a>) : optional is Some<a> {
    return 'some' in optional;
}

export function isNone<a>(optional: None) : optional is None {
    return 'none' in optional;
}

export function outOf<a, r>(value: Optional<a>, haveSome: (value: a) => r, haveNone: (reason: string) => r): r {
    return isSome(value) ? haveSome(value.some) : haveNone(value.none);
}

export function outOf2<a, b, r>(
    one: Optional<a>,
    another: Optional<b>,
    haveBoth: (one: a, two: b) => r,
    haveOne: (one: a, noAnother: string) => r,
    haveAnother: (another: b, noOne: string) => r,
    haveNone: (noOne: string, noAnother: string) => r
) : r {
    return isSome(one)
        ? isSome(another)
            ? haveBoth(one.some, another.some)
            : haveOne(one.some, another.none)
        : isSome(another)
            ? haveAnother(another.some, one.none)
            : haveNone(one.none, another.none);
}

export interface Via2Alpha<a, b, Alpha, r> {
    caseOfBoth: (left: a, right: b, alpha: Alpha) => r,
    caseOfLeft: (left: a, alpha: Alpha, noAnother: string) => r,
    caseOfRight: (right: b, alpha: Alpha, noOne: string) => r,
    caseOfNeither: (alpha: Alpha, noOne: string, noAnother: string) => r
}

export function via2Alpha<a, b, Alpha, r>(
    one: Optional<a>,
    another: Optional<b>,
    alpha: Alpha,
    via: Via2Alpha<a, b, Alpha, r>
) : r {
    return isSome(one)
        ? isSome(another)
            ? via.caseOfBoth(one.some, another.some, alpha)
            : via.caseOfLeft(one.some, alpha, another.none)
        : isSome(another)
            ? via.caseOfRight(another.some, alpha, one.none)
            : via.caseOfNeither(alpha, one.none, another.none);
}


export function map<a, b>(value: Optional<a>, map: (value: a) => b): Optional<b> {
    return (<any>value).none != null ? fromNoneOf<b>((<any>value).none) : fromSome<b>(map((<any>value).some));
}


export function alwaysFromSomeOf<a>(): (value: a) => Optional<a> {
    return fromSome;
}

export function alwaysFromNoneOf<a>(): (reason: string) => Optional<a> {
    return fromNoneOf;
}

export function withSomeOrDefault<a, r>(
    value: Optional<a>,
    haveSome: (value: a) => r,
    defaultResult: r
): r {
    return outOf(
        value,
        haveSome,
        () => defaultResult
    );
}

export function withSomeOrDie<a, r>(
    value: Optional<a>,
    haveSome: (value: a) => r,
    failure: string
): r {
    return outOf(
        value,
        haveSome,
        none => ec.fail<r>(failure + ' ' + none)
    );
}

export function withBothOrDie<a, b, r>(
    one: Optional<a>,
    another: Optional<b>,
    haveBoth: (one: a, another: b) => r,
    failure: string
): r {
    return withSomeOrDie(one, one => withSomeOrDie(another, another => haveBoth(one, another), failure), failure);
}

export function bind<a, b>(value: Optional<a>, bind: (value: a) => Optional<b>) : Optional<b> {
    return isSome(value) ? bind(value.some) : value;
}
