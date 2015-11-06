export interface SidesOf<a> {
    top: a;
    right: a;
    bottom: a;
    left: a;
}

export interface Sides extends SidesOf<number> {
}

export function map<a, b>(sides: SidesOf<a>, mapping: (value: a) => b) : SidesOf<b> {
    return {
        top: mapping(sides.top),
        right: mapping(sides.right),
        bottom: mapping(sides.bottom),
        left: mapping(sides.left)
    };
}