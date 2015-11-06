import * as ec from 'essentials/core';
import * as eo from 'essentials/optional';

export interface Position {
    x: number;
    y: number;
}

export function positionFrom(x: number, y: number): Position {
    return { x: x, y: y };
}

export function add(left: Position, right: Position): Position {
    return {
        x: left.x + right.x,
        y: left.y + right.y
    };
}

export function copyPosition(at: Position): Position {
    return { x: at.x, y: at.y };
}


export interface LineAccessor<a> {
    toStartAt(value: a): Position;
    toEndAt(value: a): Position;
}

export function fromAlike(alike: { x: number; y: number; }): Position {
    return positionFrom(alike.x, alike.y);
}