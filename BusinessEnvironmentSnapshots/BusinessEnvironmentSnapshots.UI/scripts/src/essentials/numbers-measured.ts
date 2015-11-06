export interface Measured<u> {
    value: number;
    unit: u;
}

export function measuredFrom<u>(value: number, unit: u) : Measured<u> {
    return {
        value: value,
        unit: unit
    };
}