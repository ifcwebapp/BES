import * as ec from 'essentials/core';

export interface X {
    x: number;
}

export interface Y {
    y: number;
}

export interface DX {
    dx: number;
}

export interface DY {
    dy: number;
}

export interface Text {
    text: string;
}

export type Step = X | Y | DX | DY | Text;

export function xFrom(x: number): X {
    return {
        x: x
    };
}

export function yFrom(y: number): Y {
    return {
        y: y
    };
}

export function dxFrom(dx: number): DX {
    return {
        dx: dx
    };
}

export function dyFrom(dy: number): DY {
    return {
        dy: dy
    };
}

export function textFrom(text: string): Text {
    return {
        text: text
    };
}

export interface ViaStep<r> {
    caseOfX(step: X): r;
    caseOfY(step: Y): r;
    caseOfDX(step: DX): r;
    caseOfDY(step: DY): r;
    caseOfText(step: Text): r;
}

export function viaStep<r>(step: Step, via: ViaStep<r>): r {
    var key = ec.toKeyOrDie(step, 'Unable to get a key of a step.');
    switch (key) {
        case 'x': return via.caseOfX(<X> step);
        case 'y': return via.caseOfY(<Y> step);
        case 'dx': return via.caseOfDX(<DX> step);
        case 'dy': return via.caseOfDY(<DY> step);
        case 'text': return via.caseOfText(<Text> step);
        default: return ec.fail<r>('Unexpected case \'' + key + '\' of a step.');
    }
}