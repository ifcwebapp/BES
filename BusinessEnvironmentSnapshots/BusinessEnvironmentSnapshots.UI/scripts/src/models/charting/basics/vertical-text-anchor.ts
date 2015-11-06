import * as ex from 'essentials/text';
import * as ec from 'essentials/core';
import * as eo from 'essentials/optional';

export const enum VerticalTextAnchor { Start, Middle, End }

export interface ForVerticalTextAnchor<r> {
    caseOfStart: r;
    caseOfMiddle: r;
    caseOfEnd: r;
}

export function forVerticalTextAnchor<r>(
    value: VerticalTextAnchor,
    result: ForVerticalTextAnchor<r>
): r {
    switch (value) {
        case VerticalTextAnchor.Start: return result.caseOfStart;
        case VerticalTextAnchor.Middle: return result.caseOfMiddle;
        case VerticalTextAnchor.End: return result.caseOfEnd;
        default: return ec.fail<r>('Unexpected case \'' + value + '\' of a vertical text anchor.');
    }
}

export type ViaVerticalTextAnchorAlpha<Alpha, r> = ForVerticalTextAnchor<(alpha: Alpha) => r>;
export function viaVerticalTextAnchorAlpha<Alpha, r>(
    value: VerticalTextAnchor,
    alpha: Alpha,
    via: ViaVerticalTextAnchorAlpha<Alpha, r>
) : r {
    return forVerticalTextAnchor(value, via)(alpha);
}
var stringForVerticalTextAnchor: ForVerticalTextAnchor<string> = {
    caseOfEnd: 'end',
    caseOfMiddle: 'middle',
    caseOfStart: 'start'
};

export function parseVerticalTextAnchor<r>(
    value: string,
    toResult: (value: VerticalTextAnchor) => r,
    haveOther: (value: string) => r
): r {
    switch (value) {
        case stringForVerticalTextAnchor.caseOfStart: return toResult(VerticalTextAnchor.Start);
        case stringForVerticalTextAnchor.caseOfMiddle: return toResult(VerticalTextAnchor.Middle);
        case stringForVerticalTextAnchor.caseOfEnd: return toResult(VerticalTextAnchor.End);
        default: haveOther(value);
    }
}

export function parseIfAnyWith<a>(
    value: string,
    parse: <r>(value: string, toResult: (value: a) => r, haveOther: (value: string) => r) => r,
    failure: string
) : eo.Optional<a> {
    return parse(
        value,
        value => eo.someFrom(value),
        value => ex.isNonBlank(value)
            ? ec.fail<eo.Optional<a>>(failure + 'Unexpected value \'' + value + '\'.')
            : eo.fromNoneOf<a>('Empty value.')
    );
}



export function verticalTextAnchorOutOf(text: SVGTextElement): eo.Optional<VerticalTextAnchor> {
    var value = text.getAttribute('vertical-text-anchor');
    return eo.bind(
        eo.fromNullable(value),
        value => parseIfAnyWith(value,  parseVerticalTextAnchor, 'Unable to parse a vertical text anchor.')
    );
}
 