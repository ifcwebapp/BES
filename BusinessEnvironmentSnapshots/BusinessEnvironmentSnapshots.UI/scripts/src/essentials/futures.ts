import * as ec from 'essentials/core';
import * as q from 'q';

export type Once<a> = Promise<a>;

export function map<a, b>(value: Promise<a>, map: (value: a) => b): Promise<b> {
    return value.then(map);
}

export function both<a, b, c>(one: Promise<a>, two: Promise<b>, map: (one: a, two: b) => c): Promise<c> {
    return all<any, any>([one, two], values => map(values[0], values[1]));
}

export interface LaterOf<a> {
    (): Once<a>;
    (value: a): void;
}

export function toLatterOf<a>() : LaterOf<a>{
    var deferred = q.defer<a>();
    return <any>function() {
        if (arguments.length > 0) {
            deferred.resolve(arguments[0]);
        } else {
            return deferred.promise;
        }
    };
}

export function second<a>(one: any, two: a) : Once<a> {
    return willBe(two);
}

export function all<a, b>(two: Promise<a>[], map: (two: a[]) => b): Promise<b>;
export function all(two: Promise<any>[], map: (two: any[]) => any): Promise<any> {
    return <any>q.all(<any>two).then(<any>map);
}

export function willBe<a>(value: a) : Promise<a> {
    var defer = q.defer<a>();
    defer.resolve(value);
    return <any>defer.promise;
}

export function ignore<a>(value: Promise<a>) : Promise<void> {
    return value.then(ec.ignore);
}

export var voidTobe: Promise<void> = willBe(ec.nothing);

export function alwaysWillBeVoid() {
    return voidTobe;
}