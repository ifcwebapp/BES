export interface Size {
    width: number;
    height: number;
}

export function sizeFrom(
    width: number,
    height: number
) : Size {
    return {
        width: width,
        height: height
    };
}