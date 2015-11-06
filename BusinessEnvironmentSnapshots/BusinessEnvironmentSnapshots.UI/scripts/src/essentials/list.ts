import ec = require('essentials/core');


export type List<a> = Nothing | Node<a>;

export interface Node<a> {
    value: a;
    rest: List<a>;
}

export function hasAny<a>(values: List<a>) : values is Node<a> {
    return values !== undefined;
}

export function toListOf<a>(): List<a> {
    return undefined;
}

export function fromOne<a>(value: a) : Node<a> {
    return add(toListOf<a>(), value);
}

export function withHead<a, r>(values: List<a>, haveHead: (value: a, rest: List<a>) => r, haveNone: () => r): r {
    return hasAny(values) ? haveHead(values.value, values.rest) : haveNone();
}

export function headOfOrDie<a>(values: List<a>, failure: string) : Node<a> {
    return hasAny(values) ? values : ec.fail<Node<a>>(failure + '  ' + dueTo.listIsEmpty);
}

export function fish<a, b, r>(
    values: List<a>,
    bait: b,
    sinking: (bait: b, value: a) => b,
    biting: (bait: b) => r
): r {
    return hasAny(values)
        ? fish(
            values.rest,
            sinking(bait, values.value),
            sinking,
            biting
        )
        : biting(bait);
}

export function fishAlpha<a, b, Alpha, r>(
    values: List<a>,
    alpha: Alpha,
    bait: b,
    sinking: (bait: b, value: a, alpha: Alpha) => b,
    biting: (bait: b, alpha: Alpha) => r
): r {
    return hasAny(values)
        ? fishAlpha(
            values.rest,
            alpha,
            sinking(bait, values.value, alpha),
            sinking,
            biting
        )
        : biting(bait, alpha)
}

function nodeFrom<a>(value: a, values: List<a>): Node<a> {
    return {
        rest: values,
        value: value
    };
}

export function add<a>(values: List<a>, value: a): Node<a> {
    return nodeFrom(value, values);
}

export function fromIndexedAsReversed<a, b>(values: a, count: number, toValue: (values: a, index: number) => b): List<b> {
    var result = toListOf<b>();
    for (var index = 0; index < count; index++) {
        result = nodeFrom(toValue(values, index), result);
    }
    return result;
}

export function use<a>(values: List<a>, using: (value: a) => void) : void {
    return fold(values, ec.nothing, (_, value) => using(value));
}

export function fold<a, r>(values: List<a>, result: r, folding: (result: r, value: a) => r): r {
    // AB: sorry for the mess, type gurards make you structure your code in a very special way
    var current = values;
    while (true) {
        let next : List<a>;
        if (hasAny(current)) {
            result = folding(result, current.value);
            next = current.rest;
        } else {
            break;
        }
        current = next;
    }
    return result;
}

export function reverse<a>(values: List<a>): List<a> {
    return fold(values, toListOf<a>(), add);
}

var dueTo = {
    listIsEmpty: 'The list is empty.'
};