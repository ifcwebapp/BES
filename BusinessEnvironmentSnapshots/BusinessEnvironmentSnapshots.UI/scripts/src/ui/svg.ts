import * as ud from 'ui/dom';
import * as ec from 'essentials/core';
import * as el from 'essentials/list';
import * as er from 'essentials/runtime';
import * as en from 'essentials/numbers';
import * as eo from 'essentials/optional';
import * as ex from 'essentials/text';
import * as ea from 'essentials/array';
import * as cn from 'common/numbers';
import { Box } from 'common/box';
import * as cp from 'common/position';

var dueTo = {
    moreThanOneValueInLengthList: 'Length lists with more than one value are not supported.',
    emptyLengthList: 'Empty length list are not supported.'
}

export function lengthValueOutOf(value: SVGAnimatedLength): number {
    return value.baseVal.value;
}

export function singleLengthOutOfList(value: SVGLengthList): eo.Optional<number> {
    var count = value.numberOfItems;
    return count > 1
        ? ec.fail<eo.Optional<number>>(dueTo.moreThanOneValueInLengthList)
        : count < 1
            ? eo.noneFrom('Empty length list.')
            : eo.someFrom(value.getItem(0).value);  // <-- AB: getting a value in user units which are pixels for screen
}

export function turnSvgRectToBox(element: SVGRectElement): Box {
    return {
        x: lengthValueOutOf(element.x),
        y: lengthValueOutOf(element.y),
        width: lengthValueOutOf(element.width),
        height: lengthValueOutOf(element.height)
    };
}


export type UncertainPosition = [eo.Optional<number>, eo.Optional<number>];

export function toUncertainPositionOfSvgTextual(element: SVGTextPositioningElement): UncertainPosition {
    return [
        singleLengthOutOfList(element.x.baseVal),
        singleLengthOutOfList(element.y.baseVal)
    ];
}

export function toUncertainOffsetOfSvgTextual(element: SVGTextPositioningElement): UncertainPosition {
    return [
        singleLengthOutOfList(element.dx.baseVal),
        singleLengthOutOfList(element.dy.baseVal)
    ];
}

export interface ViaSvg<r> {
    caseOfG(element: SVGGElement): r;
    caseOfLine(element: SVGLineElement): r;
    caseOfText(element: SVGTextElement): r;
    caseOfRect(element: SVGRectElement): r;
    caseOfPath(element: SVGPathElement): r;
    caseOfSvg(element: SVGSVGElement): r;
    caseOfCircle(element: SVGCircleElement): r;
    caseOfTSpan(element: SVGTSpanElement): r;
}

export function viaSvg<r>(element: SVGElement, via: ViaSvg<r>): r {
    switch (element.tagName) {
        case 'g': return via.caseOfG(<SVGGElement>element);
        case 'line': return via.caseOfLine(<SVGLineElement>element);
        case 'text': return via.caseOfText(<SVGTextElement>element);
        case 'rect': return via.caseOfRect(<SVGRectElement>element);
        case 'path': return via.caseOfPath(<SVGPathElement>element);
        case 'svg': return via.caseOfSvg(<SVGSVGElement>element);
        case 'circle': return via.caseOfCircle(<SVGCircleElement>element);
        case 'tspan': return via.caseOfTSpan(<SVGTSpanElement>element);
        default: return ec.fail<r>('Unexpected case \'' + element.tagName + '\' of an SVG element.');
    }
}

export function toViaSvg<r>(toResult: (element: SVGElement) => r) : ViaSvg<r> {
    return {
        caseOfCircle: toResult,
        caseOfG: toResult,
        caseOfLine: toResult,
        caseOfPath: toResult,
        caseOfRect: toResult,
        caseOfSvg: toResult,
        caseOfText: toResult,
        caseOfTSpan: toResult
    };
}

var tspanViaSvg = er.roughlyLike(
    toViaSvg<SVGTSpanElement>(
        element => ec.fail<SVGTSpanElement>('Unable to get a TSPAN element. Unexpected SVG element \'' + element.tagName + '\'.')
    ), but => but.caseOfTSpan = element => element
);

export function asTSpan(element: SVGElement) : SVGTSpanElement {
    return viaSvg(element, tspanViaSvg);
}

export interface ViaSvgAlpha<Alpha, r> {
    caseOfG(element: SVGGElement, alpha: Alpha): r;
    caseOfLine(element: SVGLineElement, alpha: Alpha): r;
    caseOfText(element: SVGTextElement, alpha: Alpha): r;
    caseOfRect(element: SVGRectElement, alpha: Alpha): r;
    caseOfPath(element: SVGPathElement, alpha: Alpha): r;
    caseOfSvg(element: SVGSVGElement, alpha: Alpha): r;
    caseOfCircle(element: SVGCircleElement, alpha: Alpha): r;
}

export function viaSvgAlpha<Alpha, r>(element: SVGElement, alpha: Alpha, via: ViaSvgAlpha<Alpha, r>): r {
    switch (element.tagName) {
        case 'g': return via.caseOfG(<SVGGElement>element, alpha);
        case 'line': return via.caseOfLine(<SVGLineElement>element, alpha);
        case 'text': return via.caseOfText(<SVGTextElement>element, alpha);
        case 'rect': return via.caseOfRect(<SVGRectElement>element, alpha);
        case 'path': return via.caseOfPath(<SVGPathElement>element, alpha);
        case 'svg': return via.caseOfSvg(<SVGSVGElement>element, alpha);
        case 'circle': return via.caseOfCircle(<SVGCircleElement>element, alpha);
        default: return ec.fail<r>('Unexpected case \'' + element.tagName + '\' of an SVG element.');
    }
}

export interface ViaSvgBravo<Alpha, Bravo, r> {
    caseOfG(element: SVGGElement, alpha: Alpha, bravo: Bravo): r;
    caseOfLine(element: SVGLineElement, alpha: Alpha, bravo: Bravo): r;
    caseOfText(element: SVGTextElement, alpha: Alpha, bravo: Bravo): r;
    caseOfRect(element: SVGRectElement, alpha: Alpha, bravo: Bravo): r;
    caseOfPath(element: SVGPathElement, alpha: Alpha, bravo: Bravo): r;
    caseOfSvg(element: SVGSVGElement, alpha: Alpha, bravo: Bravo): r;
    caseOfCircle(element: SVGCircleElement, alpha: Alpha, bravo: Bravo): r;
    caseOfPolygon(element: SVGPolygonElement, alpha: Alpha, bravo: Bravo): r;
    caseOfTSpan(element: SVGTSpanElement, alpha: Alpha, bravo: Bravo): r;
}

export function viaSvgBravoExt<Alpha, Bravo, r>(
    element: Element,
    alpha: Alpha, bravo: Bravo,
    via: ViaSvgBravo<Alpha, Bravo, r>,
    haveOther: (element: Element) => r
): r {
    switch (element.tagName) {
        case 'g': return via.caseOfG(<SVGGElement>element, alpha, bravo);
        case 'line': return via.caseOfLine(<SVGLineElement>element, alpha, bravo);
        case 'text': return via.caseOfText(<SVGTextElement>element, alpha, bravo);
        case 'rect': return via.caseOfRect(<SVGRectElement>element, alpha, bravo);
        case 'path': return via.caseOfPath(<SVGPathElement>element, alpha, bravo);
        case 'svg': return via.caseOfSvg(<SVGSVGElement>element, alpha, bravo);
        case 'circle': return via.caseOfCircle(<SVGCircleElement>element, alpha, bravo);
        case 'polygon': return via.caseOfPolygon(<SVGPolygonElement>element, alpha, bravo);
        case 'tspan': return via.caseOfTSpan(<SVGTSpanElement>element, alpha, bravo);
        default: return haveOther(element);
    }
}

export function toStartPositionOfLine(element: SVGLineElement): cp.Position {
    return {
        x: lengthValueOutOf(element.x1),
        y: lengthValueOutOf(element.y1)
    };
}

export function toEndPositionOfLine(element: SVGLineElement): cp.Position {
    return {
        x: lengthValueOutOf(element.x2),
        y: lengthValueOutOf(element.y2)
    };
}

export function viaSvgBravo<Alpha, Bravo, r>(
    element: Element,
    alpha: Alpha, bravo: Bravo,
    via: ViaSvgBravo<Alpha, Bravo, r>
): r {
    return viaSvgBravoExt(element, alpha, bravo, via, alwaysFailWithUnexpectedElement<r>());
}

export function alwaysFailWithUnexpectedElement<r>(): (element: Element) => r {
    return failWithUnexpectedElement;
}

export function failWithUnexpectedElement<r>(element: Element): r {
    return ec.fail<r>('Unexpected case \'' + element.tagName + '\' of an SVG element.');
}

export interface ViaTransform<r> {
    caseOfUnknown(transform: SVGTransform): r;
    caseOfMatrix(transform: SVGTransform): r;
    caseOfTranslate(transform: SVGTransform): r;
    caseOfScale(transform: SVGTransform): r;
    caseOfRotate(transform: SVGTransform): r;
    caseOfSkewX(transform: SVGTransform): r;
    caseOfSkewY(transform: SVGTransform): r;
}

export function viaTransform<r>(
    transform: SVGTransform,
    via: ViaTransform<r>
): r {
    switch (transform.type) {
        case 0: return via.caseOfUnknown(transform);
        case 1: return via.caseOfMatrix(transform);
        case 2: return via.caseOfTranslate(transform);
        case 3: return via.caseOfScale(transform);
        case 4: return via.caseOfRotate(transform);
        case 5: return via.caseOfSkewX(transform);
        case 6: return via.caseOfSkewY(transform);
        default: return ec.fail<r>('Unexpected case \'' + transform.type + '\' of an SVG transform type.');
    }
}

export interface ViaTransformAlpha<a, r> {
    caseOfUnknown(transform: SVGTransform, alpha: a): r;
    caseOfMatrix(transform: SVGTransform, alpha: a): r;
    caseOfTranslate(transform: SVGTransform, alpha: a): r;
    caseOfScale(transform: SVGTransform, alpha: a): r;
    caseOfRotate(transform: SVGTransform, alpha: a): r;
    caseOfSkewX(transform: SVGTransform, alpha: a): r;
    caseOfSkewY(transform: SVGTransform, alpha: a): r;
}

export function viaTransformAlpha<a, r>(
    transform: SVGTransform,
    alpha: a,
    via: ViaTransformAlpha<a, r>
): r {
    switch (transform.type) {
        case 0: return via.caseOfUnknown(transform, alpha);
        case 1: return via.caseOfMatrix(transform, alpha);
        case 2: return via.caseOfTranslate(transform, alpha);
        case 3: return via.caseOfScale(transform, alpha);
        case 4: return via.caseOfRotate(transform, alpha);
        case 5: return via.caseOfSkewX(transform, alpha);
        case 6: return via.caseOfSkewY(transform, alpha);
        default: return ec.fail<r>('Unexpected case \'' + transform.type + '\' of an SVG transform type.');
    }
}

export interface ViaTransformDelta<a, b, c, d, r> {
    caseOfUnknown(transform: SVGTransform, alpha: a, bravo: b, charlie: c, delta: d): r;
    caseOfMatrix(transform: SVGTransform, alpha: a, bravo: b, charlie: c, delta: d): r;
    caseOfTranslate(transform: SVGTransform, alpha: a, bravo: b, charlie: c, delta: d): r;
    caseOfScale(transform: SVGTransform, alpha: a, bravo: b, charlie: c, delta: d): r;
    caseOfRotate(transform: SVGTransform, alpha: a, bravo: b, charlie: c, delta: d): r;
    caseOfSkewX(transform: SVGTransform, alpha: a, bravo: b, charlie: c, delta: d): r;
    caseOfSkewY(transform: SVGTransform, alpha: a, bravo: b, charlie: c, delta: d): r;
}

export function viaTransformDelta<a, b, c, d, r>(
    transform: SVGTransform,
    alpha: a, bravo: b, charlie: c, delta: d,
    via: ViaTransformDelta<a, b, c, d, r>
): r {
    switch (transform.type) {
        case 0: return via.caseOfUnknown(transform, alpha, bravo, charlie, delta);
        case 1: return via.caseOfMatrix(transform, alpha, bravo, charlie, delta);
        case 2: return via.caseOfTranslate(transform, alpha, bravo, charlie, delta);
        case 3: return via.caseOfScale(transform, alpha, bravo, charlie, delta);
        case 4: return via.caseOfRotate(transform, alpha, bravo, charlie, delta);
        case 5: return via.caseOfSkewX(transform, alpha, bravo, charlie, delta);
        case 6: return via.caseOfSkewY(transform, alpha, bravo, charlie, delta);
        default: return ec.fail<r>('Unexpected case \'' + transform.type + '\' of an SVG transform type.');
    }
}


export interface ForTransform<r> {
    forUnknown: r;
    forMatrix: r;
    forTranslate: r;
    forScale: r;
    forRotate: r;
    forSkewX: r;
    forSkewY: r;
}

export function forTransform<r>(
    transform: SVGTransform,
    result: ForTransform<r>
): r {
    switch (transform.type) {
        case 0: return result.forUnknown;
        case 1: return result.forMatrix;
        case 2: return result.forTranslate;
        case 3: return result.forScale;
        case 4: return result.forRotate;
        case 5: return result.forSkewX;
        case 6: return result.forSkewY;
        default: return ec.fail<r>('Unexpected case \'' + transform.type + '\' of an SVG transform type.');
    }
}

function styleOf(stylable: SVGStylable): CSSStyleDeclaration {
    return stylable.style;
}

function textAnchorOf(styles: CSSStyleDeclaration): string {
    return styles.textAnchor;
}

export function fillOf(styles: CSSStyleDeclaration): string {
    return styles.fill;
}

export function strokeOf(styles: CSSStyleDeclaration): string {
    return styles.stroke;
}

export function strokeWidthOf(styles: CSSStyleDeclaration): string {
    return styles.strokeWidth;
}

export function strokeDasharrayOf(styles: CSSStyleDeclaration): string {
    return styles.strokeDasharray;
}

// https://github.com/Microsoft/TypeScript/issues/4146
export function isStylable(element: SVGElement | (SVGElement & SVGStylable)): element is SVGElement & SVGStylable {
    return (<SVGStylable><any>element).className != null && (<SVGStylable><any>element).style != null;
}

export function styleValueOutOf(
    styles: CSSStyleDeclaration,
    valueOf: (style: CSSStyleDeclaration) => string
): eo.Optional<string> {
    return eo.bind(eo.fromNullable(valueOf(styles)), ex.toNonBlank);
}

export function styledValueOutOf(
    element: SVGElement,
    styles: CSSStyleDeclaration,
    valueOf: (style: CSSStyleDeclaration) => string,
    name: string
): eo.Optional<string> {
    var styled = styleValueOutOf(styles, valueOf);
    return eo.isSome(styled) ? styled : ud.toAttributeValueAt(element, name);
}

export function textAnchorOutOf(
    element: SVGElement,
    styles: CSSStyleDeclaration
): eo.Optional<string> {
    return styledValueOutOf(element, styles, textAnchorOf, 'text-anchor');
}

export function fillOutOf(
    element: SVGElement,
    styles: CSSStyleDeclaration
): eo.Optional<string> {
    return styledValueOutOf(element, styles, fillOf, 'fill');
}

export function strokeOutOf(
    element: SVGElement,
    styles: CSSStyleDeclaration
): eo.Optional<string> {
    return styledValueOutOf(element, styles, strokeOf, 'stroke');
}

export function strokeWidthOutOf(
    element: SVGElement,
    styles: CSSStyleDeclaration
): eo.Optional<number> {
    return eo.bind(styledValueOutOf(element, styles, strokeWidthOf, 'stroke-width'), en.toFloat);
}

export function strokeDasharrayOutOf(
    element: SVGElement,
    styles: CSSStyleDeclaration
): eo.Optional<string> {
    return styledValueOutOf(element, styles, strokeDasharrayOf, 'stroke-dasharray');
}





export interface ViaTextElementChild<r> {
    caseOfTSpan(element: SVGTSpanElement): r;
}

export function viaTextElementChild<r>(
    element: Element,
    via: ViaTextElementChild<r>
): r {
    switch (element.tagName) {
        case 'tspan': return via.caseOfTSpan(<SVGTSpanElement>element);
        default: return ec.fail<r>('Unexpected case \'' + element.tagName + '\' of a tag name of a text element child.');
    }
}

export interface ViaTextAnchor<r> {
    caseOfStart(): r;
    caseOfMiddle(): r;
    caseOfEnd(): r;
    caseOfInherit(): r;
}

export function viaTextAnchor<r>(value: string, via: ViaTextAnchor<r>): r {
    switch (value) {
        case 'start': return via.caseOfStart();
        case 'middle': return via.caseOfMiddle();
        case 'end': return via.caseOfEnd();
        case 'inherit': return via.caseOfInherit();
        default: return ec.fail<r>('Unexpected case \'' + value + '\' of a text anchor.');
    }
}

export interface ViaPathSegment<r> {
    caseOfUnknown(segment: SVGPathSeg): r;
    caseOfClosepath(segment: SVGPathSegClosePath): r;
    caseOfMoveToAbs(segment: SVGPathSegMovetoAbs): r;
    caseOfMoveToRel(segment: SVGPathSegMovetoRel): r;
    caseOfLineToAbs(segment: SVGPathSegLinetoAbs): r;
    caseOfLineToRel(segment: SVGPathSegLinetoRel): r;
    caseOfCurveToCubicAbs(segment: SVGPathSegCurvetoCubicAbs): r;
    caseOfCurveToCubicRel(segment: SVGPathSegCurvetoCubicRel): r;
    caseOfCurveToQuadraticAbs(segment: SVGPathSegCurvetoQuadraticAbs): r;
    caseOfCurveToQuadraticRel(segment: SVGPathSegCurvetoQuadraticRel): r;
    caseOfArcAbs(segment: SVGPathSegArcAbs): r;
    caseOfArcRel(segment: SVGPathSegArcRel): r;
    caseOfLineToHorizontalAbs(segment: SVGPathSegLinetoHorizontalAbs): r;
    caseOfLineToHorizontalRel(segment: SVGPathSegLinetoHorizontalRel): r;
    caseOfLineToVerticalAbs(segment: SVGPathSegLinetoVerticalAbs): r;
    caseOfLineToVerticalRel(segment: SVGPathSegLinetoVerticalRel): r;
    caseOfCurveToCubicSmoothAbs(segment: SVGPathSegCurvetoCubicSmoothAbs): r;
    caseOfCurveToCubicSmoothRel(segment: SVGPathSegCurvetoCubicSmoothRel): r;
    caseOfCurveToQuadraticSmoothAbs(segment: SVGPathSegCurvetoQuadraticSmoothAbs): r;
    caseOfCurveToQuadraticSmoothRel(segment: SVGPathSegCurvetoQuadraticSmoothRel): r;
}

export function viaPathSegment<r>(segment: SVGPathSeg, via: ViaPathSegment<r>): r {
    switch (segment.pathSegType) {
        case 0: return via.caseOfUnknown(<SVGPathSeg>segment);
        case 1: return via.caseOfClosepath(<SVGPathSegClosePath>segment);
        case 2: return via.caseOfMoveToAbs(<SVGPathSegMovetoAbs>segment);
        case 3: return via.caseOfMoveToRel(<SVGPathSegMovetoRel>segment);
        case 4: return via.caseOfLineToAbs(<SVGPathSegLinetoAbs>segment);
        case 5: return via.caseOfLineToRel(<SVGPathSegLinetoRel>segment);
        case 6: return via.caseOfCurveToCubicAbs(<SVGPathSegCurvetoCubicAbs>segment);
        case 7: return via.caseOfCurveToCubicRel(<SVGPathSegCurvetoCubicRel>segment);
        case 8: return via.caseOfCurveToQuadraticAbs(<SVGPathSegCurvetoQuadraticAbs>segment);
        case 9: return via.caseOfCurveToQuadraticRel(<SVGPathSegCurvetoQuadraticRel>segment);
        case 10: return via.caseOfArcAbs(<SVGPathSegArcAbs>segment);
        case 11: return via.caseOfArcRel(<SVGPathSegArcRel>segment);
        case 12: return via.caseOfLineToHorizontalAbs(<SVGPathSegLinetoHorizontalAbs>segment);
        case 13: return via.caseOfLineToHorizontalRel(<SVGPathSegLinetoHorizontalRel>segment);
        case 14: return via.caseOfLineToVerticalAbs(<SVGPathSegLinetoVerticalAbs>segment);
        case 15: return via.caseOfLineToVerticalRel(<SVGPathSegLinetoVerticalRel>segment);
        case 16: return via.caseOfCurveToCubicSmoothAbs(<SVGPathSegCurvetoCubicSmoothAbs>segment);
        case 17: return via.caseOfCurveToCubicSmoothRel(<SVGPathSegCurvetoCubicSmoothRel>segment);
        case 18: return via.caseOfCurveToQuadraticSmoothAbs(<SVGPathSegCurvetoQuadraticSmoothAbs>segment);
        case 19: return via.caseOfCurveToQuadraticSmoothRel(<SVGPathSegCurvetoQuadraticSmoothRel>segment);
        default: return ec.fail<r>('Unexpected case \'' + segment.pathSegType + '\' of a path segment type.');
    }
}

function toFailViaSegmentPath<r>(): ViaPathSegment<r> {
    return {
        caseOfUnknown: segment => ec.fail<r>('An unknown SVG path segment is not supported.'),
        caseOfClosepath: segment => ec.fail<r>('A close path SVG path segment is not supported.'),
        caseOfMoveToAbs: segment => ec.fail<r>('A move to abs SVG path segment is not supported.'),
        caseOfMoveToRel: segment => ec.fail<r>('A move to rel SVG path segment is not supported.'),
        caseOfLineToAbs: segment => ec.fail<r>('A line to abs SVG path segment is not supported.'),
        caseOfLineToRel: segment => ec.fail<r>('A line to rel SVG path segment is not supported.'),
        caseOfCurveToCubicAbs: segment => ec.fail<r>('A curve to cubic abs SVG path segment is not supported.'),
        caseOfCurveToCubicRel: segment => ec.fail<r>('A curve to cubic rel SVG path segment is not supported.'),
        caseOfCurveToQuadraticAbs: segment => ec.fail<r>('A curve to quadratic abs SVG path segment is not supported.'),
        caseOfCurveToQuadraticRel: segment => ec.fail<r>('A curve to quadratic rel SVG path segment is not supported.'),
        caseOfArcAbs: segment => ec.fail<r>('A arc abs SVG path segment is not supported.'),
        caseOfArcRel: segment => ec.fail<r>('A arc rel SVG path segment is not supported.'),
        caseOfLineToHorizontalAbs: segment => ec.fail<r>('A line to horizontal abs SVG path segment is not supported.'),
        caseOfLineToHorizontalRel: segment => ec.fail<r>('A line to horizontal rel SVG path segment is not supported.'),
        caseOfLineToVerticalAbs: segment => ec.fail<r>('A line to vertical abs SVG path segment is not supported.'),
        caseOfLineToVerticalRel: segment => ec.fail<r>('A line to vertical rel SVG path segment is not supported.'),
        caseOfCurveToCubicSmoothAbs: segment => ec.fail<r>('A curve to cubics mooth abs SVG path segment is not supported.'),
        caseOfCurveToCubicSmoothRel: segment => ec.fail<r>('A curve to cubics mooth rel SVG path segment is not supported.'),
        caseOfCurveToQuadraticSmoothAbs: segment => ec.fail<r>('A curve to quadratic smooth abs SVG path segment is not supported.'),
        caseOfCurveToQuadraticSmoothRel: segment => ec.fail<r>('A curve to quadratic smooth rel SVG path segment is not supported.')
    };
}

var _toFailViaSegmentPath = toFailViaSegmentPath<any>();
export function alwaysFailViaSegmentPathOf<r>(): ViaPathSegment<r> {
    return _toFailViaSegmentPath;
}


export interface ViaPathSegmentAlpha<Alpha, r> {
    caseOfUnknown(segment: SVGPathSeg, alpha: Alpha): r;
    caseOfClosepath(segment: SVGPathSegClosePath, alpha: Alpha): r;
    caseOfMoveToAbs(segment: SVGPathSegMovetoAbs, alpha: Alpha): r;
    caseOfMoveToRel(segment: SVGPathSegMovetoRel, alpha: Alpha): r;
    caseOfLineToAbs(segment: SVGPathSegLinetoAbs, alpha: Alpha): r;
    caseOfLineToRel(segment: SVGPathSegLinetoRel, alpha: Alpha): r;
    caseOfCurveToCubicAbs(segment: SVGPathSegCurvetoCubicAbs, alpha: Alpha): r;
    caseOfCurveToCubicRel(segment: SVGPathSegCurvetoCubicRel, alpha: Alpha): r;
    caseOfCurveToQuadraticAbs(segment: SVGPathSegCurvetoQuadraticAbs, alpha: Alpha): r;
    caseOfCurveToQuadraticRel(segment: SVGPathSegCurvetoQuadraticRel, alpha: Alpha): r;
    caseOfArcAbs(segment: SVGPathSegArcAbs, alpha: Alpha): r;
    caseOfArcRel(segment: SVGPathSegArcRel, alpha: Alpha): r;
    caseOfLineToHorizontalAbs(segment: SVGPathSegLinetoHorizontalAbs, alpha: Alpha): r;
    caseOfLineToHorizontalRel(segment: SVGPathSegLinetoHorizontalRel, alpha: Alpha): r;
    caseOfLineToVerticalAbs(segment: SVGPathSegLinetoVerticalAbs, alpha: Alpha): r;
    caseOfLineToVerticalRel(segment: SVGPathSegLinetoVerticalRel, alpha: Alpha): r;
    caseOfCurveToCubicSmoothAbs(segment: SVGPathSegCurvetoCubicSmoothAbs, alpha: Alpha): r;
    caseOfCurveToCubicSmoothRel(segment: SVGPathSegCurvetoCubicSmoothRel, alpha: Alpha): r;
    caseOfCurveToQuadraticSmoothAbs(segment: SVGPathSegCurvetoQuadraticSmoothAbs, alpha: Alpha): r;
    caseOfCurveToQuadraticSmoothRel(segment: SVGPathSegCurvetoQuadraticSmoothRel, alpha: Alpha): r;
}

export function viaPathSegmentAlpha<Alpha, r>(segment: SVGPathSeg, alpha: Alpha, via: ViaPathSegmentAlpha<Alpha, r>): r {
    switch (segment.pathSegType) {
        case 0: return via.caseOfUnknown(<SVGPathSeg>segment, alpha);
        case 1: return via.caseOfClosepath(<SVGPathSegClosePath>segment, alpha);
        case 2: return via.caseOfMoveToAbs(<SVGPathSegMovetoAbs>segment, alpha);
        case 3: return via.caseOfMoveToRel(<SVGPathSegMovetoRel>segment, alpha);
        case 4: return via.caseOfLineToAbs(<SVGPathSegLinetoAbs>segment, alpha);
        case 5: return via.caseOfLineToRel(<SVGPathSegLinetoRel>segment, alpha);
        case 6: return via.caseOfCurveToCubicAbs(<SVGPathSegCurvetoCubicAbs>segment, alpha);
        case 7: return via.caseOfCurveToCubicRel(<SVGPathSegCurvetoCubicRel>segment, alpha);
        case 8: return via.caseOfCurveToQuadraticAbs(<SVGPathSegCurvetoQuadraticAbs>segment, alpha);
        case 9: return via.caseOfCurveToQuadraticRel(<SVGPathSegCurvetoQuadraticRel>segment, alpha);
        case 10: return via.caseOfArcAbs(<SVGPathSegArcAbs>segment, alpha);
        case 11: return via.caseOfArcRel(<SVGPathSegArcRel>segment, alpha);
        case 12: return via.caseOfLineToHorizontalAbs(<SVGPathSegLinetoHorizontalAbs>segment, alpha);
        case 13: return via.caseOfLineToHorizontalRel(<SVGPathSegLinetoHorizontalRel>segment, alpha);
        case 14: return via.caseOfLineToVerticalAbs(<SVGPathSegLinetoVerticalAbs>segment, alpha);
        case 15: return via.caseOfLineToVerticalRel(<SVGPathSegLinetoVerticalRel>segment, alpha);
        case 16: return via.caseOfCurveToCubicSmoothAbs(<SVGPathSegCurvetoCubicSmoothAbs>segment, alpha);
        case 17: return via.caseOfCurveToCubicSmoothRel(<SVGPathSegCurvetoCubicSmoothRel>segment, alpha);
        case 18: return via.caseOfCurveToQuadraticSmoothAbs(<SVGPathSegCurvetoQuadraticSmoothAbs>segment, alpha);
        case 19: return via.caseOfCurveToQuadraticSmoothRel(<SVGPathSegCurvetoQuadraticSmoothRel>segment, alpha);
        default: return ec.fail<r>('Unexpected case \'' + segment.pathSegType + '\' of a path segment type.');
    }
}

function toFailViaSegmentPathAlpha<Alpha, r>(): ViaPathSegmentAlpha<Alpha, r> {
    return {
        caseOfUnknown: (segment, alpha) => ec.fail<r>('An unknown SVG path segment is not supported.'),
        caseOfClosepath: (segment, alpha) => ec.fail<r>('A close path SVG path segment is not supported.'),
        caseOfMoveToAbs: (segment, alpha) => ec.fail<r>('A move to abs SVG path segment is not supported.'),
        caseOfMoveToRel: (segment, alpha) => ec.fail<r>('A move to rel SVG path segment is not supported.'),
        caseOfLineToAbs: (segment, alpha) => ec.fail<r>('A line to abs SVG path segment is not supported.'),
        caseOfLineToRel: (segment, alpha) => ec.fail<r>('A line to rel SVG path segment is not supported.'),
        caseOfCurveToCubicAbs: (segment, alpha) => ec.fail<r>('A curve to cubic abs SVG path segment is not supported.'),
        caseOfCurveToCubicRel: (segment, alpha) => ec.fail<r>('A curve to cubic rel SVG path segment is not supported.'),
        caseOfCurveToQuadraticAbs: (segment, alpha) => ec.fail<r>('A curve to quadratic abs SVG path segment is not supported.'),
        caseOfCurveToQuadraticRel: (segment, alpha) => ec.fail<r>('A curve to quadratic rel SVG path segment is not supported.'),
        caseOfArcAbs: (segment, alpha) => ec.fail<r>('A arc abs SVG path segment is not supported.'),
        caseOfArcRel: (segment, alpha) => ec.fail<r>('A arc rel SVG path segment is not supported.'),
        caseOfLineToHorizontalAbs: (segment, alpha) => ec.fail<r>('A line to horizontal abs SVG path segment is not supported.'),
        caseOfLineToHorizontalRel: (segment, alpha) => ec.fail<r>('A line to horizontal rel SVG path segment is not supported.'),
        caseOfLineToVerticalAbs: (segment, alpha) => ec.fail<r>('A line to vertical abs SVG path segment is not supported.'),
        caseOfLineToVerticalRel: (segment, alpha) => ec.fail<r>('A line to vertical rel SVG path segment is not supported.'),
        caseOfCurveToCubicSmoothAbs: (segment, alpha) => ec.fail<r>('A curve to cubics mooth abs SVG path segment is not supported.'),
        caseOfCurveToCubicSmoothRel: (segment, alpha) => ec.fail<r>('A curve to cubics mooth rel SVG path segment is not supported.'),
        caseOfCurveToQuadraticSmoothAbs: (segment, alpha) => ec.fail<r>('A curve to quadratic smooth abs SVG path segment is not supported.'),
        caseOfCurveToQuadraticSmoothRel: (segment, alpha) => ec.fail<r>('A curve to quadratic smooth rel SVG path segment is not supported.')
    };
}

var _toFailViaSegmentAlphaPath = toFailViaSegmentPathAlpha<any, any>();
export function alwaysFailViaSegmentPathAlphaOf<Alpha, r>(): ViaPathSegmentAlpha<Alpha, r> {
    return _toFailViaSegmentAlphaPath;
}

export type Owned = {
    ownerSVGElement: SVGSVGElement;
}

export function lengthOn(length: SVGLength, list: SVGAnimatedLengthList): void {
    list.baseVal.initialize(length);
}

export function toLength(value: number, svg: SVGSVGElement): SVGLength {
    var length = svg.createSVGLength();
    length.value = value;
    return length;
}

export function lengthOutOf(list: SVGAnimatedLengthList) : number {
    return list.baseVal.getItem(0).value;
}


type CreateElement = {
    (document: Document, tagName: "tspan"): SVGTSpanElement;
    (document: Document, tagName: string): SVGElement;
};
export var createElement: CreateElement = function (document: Document, tagName: string): SVGElement {
    return <SVGElement>document.createElementNS(svgNamespace, tagName);
}


export var svgNamespace = 'http://www.w3.org/2000/svg';