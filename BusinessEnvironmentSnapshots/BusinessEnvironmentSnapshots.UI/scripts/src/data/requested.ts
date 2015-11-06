import eo = require('essentials/optional');

export interface Requested<a> {
    'a requested': Requested<a>;
    'uses a': a;
    // data: a;
    // problem: string;
} 

export function outOfRequested<a, r>(
    requested: Requested<a>,
    haveData: (value: a) => r,
    haveProblem: (reason: string) => r
) : r {
    return 'data' in requested ? haveData((<any> requested)['data']) : haveProblem((<any> requested)['problem']);
}

export function toOptional<a>(
    requested: Requested<a>
) : eo.Optional<a> {
    return outOfRequested(
        requested,
        eo.fromSome,
        eo.alwaysFromNoneOf<a>()
    );
}


export function withBoth<a, b, r>(
    one: Requested<a>,
    another: Requested<b>,
    haveBoth: (one: a, another: b) => r,
    haveOtherwise: (reason: string[]) => r
) : r {
    return outOfRequested(
        one, 
        one => outOfRequested(
            another,
            another => haveBoth(one, another),
            another => haveOtherwise([another])
        ),
        one => outOfRequested(
            another,
            another => haveOtherwise([one]),
            another => haveOtherwise([one, another])
        )
    );
}