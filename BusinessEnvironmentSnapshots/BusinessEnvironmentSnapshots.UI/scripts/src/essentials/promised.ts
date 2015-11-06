import ec = require('essentials/core');

import $ = require('jquery');
import Q = require('q');

export interface Promised<a> {
    then<b>(map: (value: a) => Promised<b>): Promised<b>;
    then<b>(map: (value: a) => b): Promised<b>;
    done(): void;
}

export interface Deferred<a>  {
    (): Promised<a>;
    (value: a): void;
}

export function toDeferredOf<a>() : Deferred<a> {
    var deferred = $.Deferred<a>();
    return function() {
        if (arguments.length > 0) {
            deferred.resolve(arguments[0]);
        } else {
            return <any>deferred.promise();
        }
    };
}
export function all<a>(promises: Promised<void>[]) : Promised<void>;
export function all<a>(promises: Promised<a>[]) : Promised<a[]>;
export function all<a>(promises: any) : any {
    return Q.all(promises);
}

export function willBe<a>(value: a) : Promised<a> {
    var result = Q.defer<a>();
    result.resolve(value);
    return result.promise;
}

export function ignore<a>(promised: Promised<a>) : Promised<void>  {
    return promised.then(ec.ignore);
}

export function willBeSecond<a>(first: any, second: a) : Promised<a> {
    return willBe(second);
}

export function bindBoth<a, b, c>(
    one: Promised<a>,
    another: Promised<b>,
    bind: (one: a, another: b) => Promised<c>
) : Promised<c> {
    return Q.all(<any[]>[one, another]).then((all: any) => bind(all[0], all[1]));
}

export function bind<a, b>(
    one: Promised<a>,
    bind: (value: a) => Promised<b>
) : Promised<b> {
    return one.then(bind);
}

export function willFail<r>(reason: string) : Promised<r> {
    return ec.fail<Promised<r>>(reason);
}

export var voidTobe = willBe(ec.nothing);