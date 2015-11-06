export type Act = () => void;

export function toKeyOrDie(value: any, failure: string) : string {
    for (var key in value) {
        return key;
    }
    return fail<string>(failure + ' There is no key.');
}

export function fail<r>(message: string) : r {
    throw new Error(message);
}

export function failOver<r>(message: string) : () => r {
    return function() {
        return fail<r>(message);
    };
}

export type Apply<a, b, c> = (fn: (one: a|b, two: a|b) => c, one: a, two: b) => c;

export function use<a>(valueOpt: a, use: (value: a) => void) : void {
    if (valueOpt != null) {
        use(valueOpt);
    }
}

export function trace<a>(message: string, value: a) : a {
    console.log(message, value);
    return value;
}

export function flip<a, b, c>(fn: (left: a, right: b) => c) : (right: b, left: a) => c {
    return function(right: b, left: a) : c {
        return fn(left, right);
    };
} 

export function run(act: () => void) : void {
    act();
}

export function extend<a, b>(fn: (value: a) => b) : (_: any, value: a) => b {
    return function(_: any, value: a) : b {
        return fn(value);
    };
}

export function extend2<a, b, c>(fn: (one: a, two: b) => c) : (_: any, one: a, two: b) => c {
    return function(_: any, one: a, two: b) : c {
        return fn(one, two);
    };
}

export function compose<a, b, c>(inner: (value: a) => b, outer: (value: b) => c) {
    return function(value: a) : c {
        return outer(inner(value));
    };
}

export function areSame<a>(one: a, another: a) : boolean {
    return one === another;
}

export function mapOverSuch<a, b, c>(phony: a, inner: (value: a) => b, outer: (value: b) => c) : (value: a) => c {
    return function nested(value: a) : c {
        return outer(inner(value));
    };
}

export function mapOver<a, b, c>(inner: (value: a) => b, outer: (value: b) => c) : (value: a) => c {
    return function nested(value: a) : c {
        return outer(inner(value));
    };
}

export function map2over<a, b, c, d>(inner: (one: a, two: b) => c, outer: (value: c) => d) : (one: a, two: b) => d {
    return function nested(one: a, two: b) : d {
        return outer(inner(one, two));
    };
}

export function map3over<a, b, c, d, e>(inner: (one: a, two: b, three: c) => d, outer: (value: d) => e) : (one: a, two: b, three: c) => e {
    return function nested(one: a, two: b, three: c) : e {
        return outer(inner(one, two, three));
    };
}
export function map4over<a, b, c, d, e, f>(inner: (one: a, two: b, three: c, four: d) => e, outer: (value: e) => f) : (one: a, two: b, three: c, four: d) => f {
    return function nested(one: a, two: b, three: c, four: d) : f {
        return outer(inner(one, two, three, four));
    };
}

export function map5over<a, b, c, d, e, f, g>(
    inner: (one: a, two: b, three: c, four: d, five: e) => f,
    outer: (value: f) => g
) : (one: a, two: b, three: c, four: d, five: e) => g {
    return function nested(one: a, two: b, three: c, four: d, five: e) : g {
        return outer(inner(one, two, three, four, five));
    };
}

export function map6over<a, b, c, d, e, f, g, h>(
    inner: (one: a, two: b, three: c, four: d, five: e, six: f) => g,
    outer: (value: g) => h
) : (one: a, two: b, three: c, four: d, five: e, six: f) => h {
    return function nested(one: a, two: b, three: c, four: d, five: e, six: f) : h {
        return outer(inner(one, two, three, four, five, six));
    };
}

export function map3overTwice<a, b, c, d, e, f>(
    inner: (one: a, two: b, three: c) => d,
    middle: (value: d) => e,
    outer: (value: e) => f
) : (one: a, two: b, three: c) => f {
    return function nested(one: a, two: b, three: c) : f {
        return outer(middle(inner(one, two, three)));
    };
}

export function ignore() {}

export function id<a>(value: a) : a {
    return value;
}

export function apply<a, b>(value: a, map: (value: a) => b) : b {
    return map(value);
}

export function first<a>(first: a) : a { 
    return first;
}

export function second<a>(_1: any, second: a) : a {
    return second;
}

export function third<a>(_1: any, _2: any, third: a) : a {
    return third;
}

export function always<a>(value: a) : () => a {
    return function() { return value; };
}

export function alwaysFalse() { return false; }

export function alwaysTrue() { return true; }

export function alwaysFailOf<a>() : (message: string) => a {
    return fail;
}

export function alwaysUndefined() : any {
    return undefined;
}

export function alwaysNull(): any {
    return null;
}

export function alwaysNullOf<a>() : a {
    return null;
}

export function isNothing<a>(value: Nullable<a>) : value is Nothing {
    return value == null;
}


export var emptyString : string = '';
export var nothing : Nothing = undefined;
