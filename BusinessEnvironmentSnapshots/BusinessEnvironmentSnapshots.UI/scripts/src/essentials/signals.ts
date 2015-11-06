import ed = require('essentials/disposing');

export interface UseIn<a> {
    (value: a): void;
}

export interface UseOut<a> {
    watchUntil(beDisposed: ed.Disposables, use: (value: a) => void) : void;
}

export function toUseSignalOf<a>() {
    var listeners : { (value: a): void; }[] = [];
}