import  eo = require('essentials/optional');
import ec = require('essentials/core');

export interface Uncertain<a, b> {
    'uses a': a;
    'uses b': b;
    'a relaxed': Uncertain<a, b>;
    // coming: a;
    // empty: string;
    // failed: string;
    // ok: b;
}

export function fromComing<a, b>(coming: a) : Uncertain<a, b> {
    return <any> {
        'coming': coming
    };
}

export function fromFailed<a, b>(problem: string): Uncertain<a, b> {
    return <any> {
        'failed': problem
    };
}


export function fromEmpty<a, b>(reason: string) : Uncertain<a, b> {
    return <any> {
        'empty': reason
    };
}

export function fromAvailable<a, b>(available: b) : Uncertain<a, b> {
    return <any> {
        'available': available
    };
}

export function alwaysFromAvailableOf<a, b>() : (available: b) => Uncertain<a, b> {
    return <any> fromAvailable;
}


export interface ViaRelaxed<a, b, r> {
    caseOfComing(value: a, uncertain: Uncertain<a, b>): r;
    caseOfFailed(problem: string, uncertain: Uncertain<a, b>): r;
    caseOfEmpty(reason: string, uncertain: Uncertain<a, b>): r;
    caseOfAvailable(value: b, uncertain: Uncertain<a, b>): r;
}

export function viaUncertain<a, b, r>(relaxed: Uncertain<a, b>, via: ViaRelaxed<a, b, r>) : r {
    var key = ec.toKeyOrDie(relaxed, 'Unable to resolve a relaxed.');
    switch(key) {
        case 'coming': return via.caseOfComing((<any> relaxed)['coming'], relaxed);
        case 'failed': return via.caseOfFailed((<any> relaxed)['failed'], relaxed);
        case 'empty': return via.caseOfEmpty((<any> relaxed)['empty'], relaxed);
        case 'available': return via.caseOfAvailable((<any> relaxed)['available'], relaxed);
        default: return ec.fail<r>('Unexpected case \'' + key + '\' of a relaxed.');
    }
}
export function isEmpty<a, b>(uncertain: Uncertain<a, b>) : boolean {
    return viaUncertain(uncertain, {
        caseOfAvailable: ec.alwaysFalse,
        caseOfComing: ec.alwaysFalse,
        caseOfEmpty: ec.alwaysTrue,
        caseOfFailed: ec.alwaysFalse
    });
}