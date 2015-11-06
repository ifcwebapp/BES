import * as cp from 'common/position';

export interface Box {
    x: number;
    y: number;
    width: number;
    height: number;
}

export function boxFrom(x: number, y: number, width: number, height: number) : Box {
    return { x, y, width, height };
}

export function asAtZero(box: Box) : Box {
    return {
        x: 0,
        y: 0,
        width: box.width,
        height: box.height
    };
}

export function asTopLeftPosition(box: Box) : cp.Position {
    return {
        x: box.x,
        y: box.y
    };
}

export function asTopRightPosition(box: Box) : cp.Position {
    return {
        x: box.x + box.width,
        y: box.y
    };
}

export function asBottomRightPosition(box: Box) : cp.Position {
    return {
        x: box.x + box.width,
        y: box.y + box.height
    };
}

export function asBottomLeftPosition(box: Box) : cp.Position {
    return {
        x: box.x,
        y: box.y + box.height
    };
}


export var topLineAccessor : cp.LineAccessor<Box> = {
    toStartAt: asTopLeftPosition,
    toEndAt: asTopRightPosition
};

export var bottonLineAccessor : cp.LineAccessor<Box> = {
    toStartAt: asBottomLeftPosition,
    toEndAt: asBottomRightPosition
};

export var leftLineAccessor: cp.LineAccessor<Box> = {
    toStartAt: asTopLeftPosition,
    toEndAt: asBottomLeftPosition
};

export var rightLineAccessor : cp.LineAccessor<Box> = {
    toStartAt: asTopRightPosition,
    toEndAt: asBottomRightPosition
};

