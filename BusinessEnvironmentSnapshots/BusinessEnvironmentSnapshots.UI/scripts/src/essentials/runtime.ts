import ea = require('essentials/array');
import ec = require('essentials/core');
import em = require('essentials/maps');

export function merge<Base, Exclusive, Inclusive>(base: Base, exclusive: Exclusive, cIsA: (value: Inclusive) => Base = ec.id, cIsB: (value: Inclusive) => Exclusive = ec.id) : Inclusive {
    var draft = Object.create(base);
    copyRoughly(exclusive, draft);
    return draft;
}

export function copyRoughly<a, b>(source: a, target: b, bIsA: (value: b) => a = ec.id) : b {
    return fold(
        source,
        target,
        (target, value, key) => {
            (<any>target)[key] = value;
            return target;
        }
    );
}
 
export function roughlyLike<a>(value: a, mutate: (value: a) => void) : a {
    var copied = Object.create(value);
    mutate(copied);
    return copied;
}

/** UNSAFE: Make sure there are no cyclic references. */
export function copyMostlyUnsafe<a>(value: a) : a {
    return viaTypeOf<any>(value, {
        caseOfUndefined: ec.alwaysUndefined,
        caseOfNull: ec.alwaysNull,
        caseOfBoolean: ec.id,
        caseOfNumber: ec.id,
        caseOfString: ec.id,
        caseOfArray: values => ea.fold(values, [], (result, value) => ea.append(result, copyMostlyUnsafe(value))),
        caseOfDate: value => new Date(value.getTime()),
        caseOfObject: value => fold(value, <any>{}, (result, value, key) => { result[key] = copyMostlyUnsafe(value); return result; }),
        caseOfFunction: ec.id
    });        
}

export function mostlyLike<a>(value: a, mutate: (value: a) => void) : a {
    var copied = copyMostlyUnsafe(value);
    mutate(copied);
    return copied;
}

export var fold : <r>(value: any, result: r, fold: (result: r, value: any, key: string) => r) => r = em.fold;

export function toType(value: any) : string {
    return Object.prototype.toString.call(value);
}


export interface ViaType<r> {
    caseOfUndefined(): r;
    caseOfNull     (): r;
    caseOfBoolean  (value: boolean ): r;
    caseOfNumber   (value: number  ): r;
    caseOfString   (value: string  ): r;
    caseOfDate     (value: Date    ): r;
    caseOfArray    (value: any[]   ): r;
    caseOfObject   (value: Object  ): r;
    caseOfFunction (value: Function): r;
}

export function viaTypeOf<r>(value: any, via: ViaType<r>) : r {
    var type = toType(value);
    switch(type) {
        case '[object Undefined]': return via.caseOfUndefined();
        case '[object Null]'     : return via.caseOfNull     ();
        case '[object Boolean]'  : return via.caseOfBoolean  (value);
        case '[object Number]'   : return via.caseOfNumber   (value);
        case '[object String]'   : return via.caseOfString   (value);
        case '[object Date]'     : return via.caseOfDate     (value);
        case '[object Array]'    : return via.caseOfArray    (value);
        case '[object Object]'   : return via.caseOfObject   (value);
        case '[object Function]' : return via.caseOfFunction (value);
        default: return ec.fail<r>('Unknown type \'' + type + '\'.');
    }
}