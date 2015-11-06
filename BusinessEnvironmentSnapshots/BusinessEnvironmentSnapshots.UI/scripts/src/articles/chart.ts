import ec = require('essentials/core');
import eo = require('essentials/optional');
import en = require('essentials/numbers');
import ew = require('essentials/few');
import ea = require('essentials/array');
import crn = require('common/range');

export const enum Orientation { Landscape, Portrait }

export interface ForOrientation<r> {
    forLandscape: r;
    forPortraint: r;
}

export function forOrienation<r>(orientation: Orientation, result: ForOrientation<r>) : r {
    switch (orientation) {
        case Orientation.Landscape: return result.forLandscape;
        case Orientation.Portrait: return result.forPortraint;
        default: return ec.fail<r>('Unexpected case \'' + orientation + '\' of an orientation.');
    }
}

var valueablePlacementForOrientation : ForOrientation<Placed> = {
    forLandscape: Placed.Vertically,
    forPortraint: Placed.Horizontally
}

export function toValueablePlacement(orientation: Orientation) : Placed {
    return forOrienation(orientation, valueablePlacementForOrientation);
}

var categorialPlacementForOrientation : ForOrientation<Placed> = {
    forLandscape: Placed.Horizontally,
    forPortraint: Placed.Vertically
}

export function toCategorialPlacement(orientation: Orientation): Placed {
    return forOrienation(orientation, categorialPlacementForOrientation);
}

export interface Placement {
    categorial: Placed;
    valueable: Placed;
}

export function toPlacement(orientation: Orientation) : Placement {
    return {
        categorial: toCategorialPlacement(orientation),
        valueable: toValueablePlacement(orientation)
    };
}


export const enum Placed { Vertically, Horizontally };
export function forPlaced<r>(
    placed: Placed, result: {
        forHorizontally: r;
        forVertically: r;
    }
) : r {
    switch (placed) {
        case Placed.Horizontally: return result.forHorizontally;
        case Placed.Vertically: return result.forVertically;
        default: return ec.fail<r>('Unexpected case \'' + placed + '\' of placed.');
    }
}
export function viaPlaced<r>(
    placed: Placed, via: {
    caseOfVertically(): r;
    caseOfHorizontally(): r;
}
) : r {
    switch (placed) {
        case Placed.Horizontally: return via.caseOfHorizontally();
        case Placed.Vertically: return via.caseOfVertically();
        default: return ec.fail<r>('Unexpected case \'' + placed + '\' of placed.');
    }
}

export const enum CategoryAxisKind {
    Bands,
    Points
}

export interface ForCategoryAxisKind<r> {
    caseOfBands(): r;
    caseOfPoints(): r;
}

export function viaCategoryAxisKind<r>(
    kind: CategoryAxisKind,
    via: ForCategoryAxisKind<r>
) : r {
    switch(kind) {
        case CategoryAxisKind.Bands: return via.caseOfBands();
        case CategoryAxisKind.Points: return via.caseOfPoints();
        default: return ec.fail<r>('');
    }
}
