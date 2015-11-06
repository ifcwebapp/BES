import * as ec from 'essentials/core';

export const enum DisplayOrder { AsIs = 0, HighToLow = 1, LowToHigh = 2 };
export interface ViaDisplayOrder<r> {
    caseOfAsIs(): r;
    caseOfHighToLow(): r;
    caseOfLowToHigh(): r;
}
export function viaDisplayOrder<r>(
    order: DisplayOrder,
    via: ViaDisplayOrder<r>
): r {
    switch (order) {
        case DisplayOrder.AsIs: return via.caseOfAsIs();
        case DisplayOrder.HighToLow: return via.caseOfHighToLow();
        case DisplayOrder.LowToHigh: return via.caseOfLowToHigh();
        default: return ec.fail<r>('Unexpected case \'' + order + '\' of a display order.');
    }
}