import * as ec from 'essentials/core';
import * as ea from 'essentials/array';
import * as el from 'essentials/list';
import * as en from 'essentials/numbers';
import * as er from 'essentials/runtime';
import * as ex from 'essentials/text';
import * as eo from 'essentials/optional';
import * as cb from 'common/box';
import * as uv from 'ui/svg';
import * as ud from 'ui/dom';
import * as upw from 'ui/pdf/writer';
import * as ca from 'common/accessors';
import * as cp from 'common/position';
import { Box, boxFrom } from 'common/box';
import * as uvts from 'ui/svg/text-steps';
import * as uvts2l from 'ui/svg/text-steps-to-lines';
import * as uvtl from 'ui/svg/text-lines';
import * as up from 'ui/pdf';
import * as us from 'ui/styles';

export function withNormalizedColor<r>(
    value: string,
    haveNormalized: (color: string, opacity: number) => r
): r {
    var rgb = us.tryParseColor(value);
    if (eo.isSome(rgb)) {
        return haveNormalized(us.formatColorAsHex6(rgb.some), rgb.some.opacity);
    } else if (value === 'none') {
        return haveNormalized('white', 0);
    } else {
        return haveNormalized(value, 1);
    }
}

function withFillAndStrokeAlpha<Alpha, r>(
    element: SVGElement,
    styles: CSSStyleDeclaration,
    alpha: Alpha,
    haveBoth: (fillColor: string, fillOpacity: number, strokeColor: string, strokeOpacity: number, alpha: Alpha) => r,
    haveFill: (fillColor: string, fillOpactity: number, alpha: Alpha) => r,
    haveStroke: (strokeColor: string, strokeOpacity: number, alpha: Alpha) => r,
    haveNone: (reason: string) => r
): r {
    var fill = uv.fillOutOf(element, styles);
    var stroke = uv.strokeOutOf(element, styles);
    if (eo.isSome(fill)) {
        if (eo.isSome(stroke)) {
            return withNormalizedColor(fill.some, (fillColor, fillOpacity) =>
                withNormalizedColor(stroke.some, (strokeColor, strokeOpacity) =>
                    haveBoth(fillColor, fillOpacity, strokeColor, strokeOpacity, alpha)
                )
            );
        } else {
            return withNormalizedColor(fill.some, (fillColor, fillOpacity) =>
                haveFill(fillColor, fillOpacity, alpha)
            );
        }
    } else {
        if (eo.isSome(stroke)) {
            return withNormalizedColor(stroke.some, (strokeColor, strokeOpacity) =>
                haveStroke(strokeColor, strokeOpacity, alpha)
            );
        } else {
            return haveNone(fill.none + ' ' + stroke.none);
        }
    }
}
function _finishRenderingWithCommonStylingApplied(
    element: SVGElement,
    styles: CSSStyleDeclaration,
    writer: upw.Writer
): void {
    return withFillAndStrokeAlpha(
        element,
        styles,
        writer,
        (fillColor, fillOpacity, strokeColor, strokeOpacity, writer) => {
            upw.fillAndStrokeOn(fillColor, fillOpacity, strokeColor, strokeOpacity, writer);
            upw.fillAndStrokeDocument(writer);
        },
        (fillColor, fillOpacity, writer) => {
            upw.setFill(fillColor, fillOpacity, writer);
            upw.fillDocument(writer);
        },
        (strokeColor, strokeOpacity, writer) => {
            upw.strokeOn(strokeColor, strokeOpacity, writer);
            upw.strokeDocument(writer);
        },
        ec.ignore
    );
}

var considerRenderingSvgElementVia: uv.ViaSvgBravo<CSSStyleDeclaration, upw.Writer, boolean> = {
    caseOfG: ec.map3over(renderGElement, ec.alwaysTrue),
    caseOfSvg: ec.map3over(renderSvgElement, ec.alwaysTrue),
    caseOfLine: ec.map3over(renderLineElement, ec.alwaysTrue),
    caseOfPath: ec.map3over(renderPathElement, ec.alwaysTrue),
    caseOfRect: ec.map3over(renderRectElement, ec.alwaysTrue),
    caseOfText: ec.map3over(renderTextElement, ec.alwaysTrue),
    caseOfCircle: ec.map3over(renderCircleElement, ec.alwaysTrue),
    caseOfPolygon: ec.map3over(renderPolygonElement, ec.alwaysTrue),
    caseOfTSpan: () => ec.fail<boolean>('Unexpected element TSPAN.')
};

var renderSvgElementVia: uv.ViaSvgBravo<CSSStyleDeclaration, upw.Writer, void> = {
    caseOfG: renderGElement,
    caseOfSvg: renderSvgElement,
    caseOfLine: renderLineElement,
    caseOfPath: renderPathElement,
    caseOfRect: renderRectElement,
    caseOfText: renderTextElement,
    caseOfCircle: renderCircleElement,
    caseOfPolygon: renderPolygonElement,
    caseOfTSpan: () => ec.fail<boolean>('Unexpected element TSPAN.')
};

var renderNodeVia: ud.ViaNodeAlpha<upw.Writer, void> = {
    caseOfElement: (element, writer) => upw.withLocalWriter(
        writer,
        writer => renderElement(<SVGElement>element, writer)
    ),
    caseOfText: ec.ignore,
    caseOfComment: ec.ignore
};

export function considerRenderingElement(element: Element, box: cb.Box, styles: CSSStyleDeclaration, writer: upw.Writer): boolean {
    return uv.viaSvgBravoExt(
        element,
        styles,
        writer,
        considerRenderingSvgElementVia,
        ec.alwaysFalse
    );
}

function renderNode(node: Node, writer: upw.Writer): void {
    ud.viaNodeAlpha(node, writer, renderNodeVia);
}

function renderElement(element: SVGElement, writer: upw.Writer): void {
    if (uv.isStylable(element)) {
        var styles = ud.computedStylesOutOfElement(element);
        if (us.isDisplayed(styles)) {
            uv.viaSvgBravo(
                element,
                styles,
                writer,
                renderSvgElementVia
            );
        } else {
            // do nothing, the element is hidden
        }
    } else {
        return ec.fail<void>('Non stylable SVG element.');
    }
}

function renderGElement(element: SVGGElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    upw.withLocalWriter(writer, writer => {
        applyTransforms(element, writer);
        renderChildren(element, styles, writer);
    });
}

function renderChildren(element: SVGElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    ud.useChildrenAlpha(element, writer, renderNode);
}

function renderSvgElement(element: SVGSVGElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    renderChildren(element, styles, writer);
}

function renderLineElement(element: SVGLineElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    accountForLineWidth(element, styles, writer);
    accountForLineDashness(element, styles, writer);
    var startAt = uv.toStartPositionOfLine(element);
    var endAt = uv.toEndPositionOfLine(element);
    upw.drawLine(startAt, endAt, writer);
    _finishRenderingWithCommonStylingApplied(element, styles, writer);
}

function renderCircleElement(element: SVGCircleElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    let x = uv.lengthValueOutOf(element.cx);
    let y = uv.lengthValueOutOf(element.cy);
    let r = uv.lengthValueOutOf(element.r);
    accountForLineWidth(element, styles, writer);
    accountForLineDashness(element, styles, writer);
    upw.drawCircle(x, y, r, writer);
    _finishRenderingWithCommonStylingApplied(element, styles, writer);
}

function accountForLineWidth(element: SVGElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    eo.use(uv.strokeWidthOutOf(element, styles), width => upw.lineWidthOn(width, writer));
}

function accountForLineDashness(element: SVGElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    let dashness = uv.strokeDasharrayOutOf(element, styles);
    if (eo.isSome(dashness)) {
        var raw = us.parseLengthListOrDie(dashness.some, 'Unable to parse a dash array.');
        if (raw.length > 0) {
            var values = ea.asOfLength2OrDie(
                raw,
                'Unsupported number of elements in the dash array.'
            );
            upw.lineDashnessOn({
                dashLength: us.toPixels(values[0]),
                gapLength: us.toPixels(values[1]),
                phase: 0
            }, writer);
        } else {
            upw.lineSolidnessOn(writer);
        }
    } else {
        upw.lineSolidnessOn(writer);
    }
}

function renderPathElement(element: SVGPathElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    applyTransforms(element, writer);
    var segments = ea.fromIndexed(
        element.pathSegList,
        segments => segments.numberOfItems,
        (segments, index) => segments.getItem(index)
    );
    var parts = ea.map(segments, segment => uv.viaPathSegment(
        segment,
        toStringViaSegmentPath
    ));
    accountForLineWidth(element, styles, writer);
    accountForLineDashness(element, styles, writer);
    upw.drawPath(parts.join(' '), writer);
    _finishRenderingWithCommonStylingApplied(element, styles, writer);
}

function renderPolygonElement(element: SVGPolygonElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    applyTransforms(element, writer);
    var points = ea.fromIndexed(
        element.points,
        points => points.numberOfItems,
        (points, index) => points.getItem(index)
    );
    var parts = ea.withHeadOrDefault(
        points,
        (head, rest) => ea.concatAll([
            ['M ' + head.x + ',' + head.y],
            ea.map(rest, point => 'L' + point.x + ',' + point.y),
            ['Z']
        ]),
        ['']
    );
    accountForLineWidth(element, styles, writer);
    accountForLineDashness(element, styles, writer);
    upw.drawPath(parts.join(' '), writer);
    _finishRenderingWithCommonStylingApplied(element, styles, writer);
}

function renderRectElement(element: SVGRectElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    upw.withLocalWriter(writer, writer => {
        upw.drawRectangle(uv.turnSvgRectToBox(element), writer);
        _finishRenderingWithCommonStylingApplied(element, styles, writer);
    });
}

function renderTextElement(element: SVGTextElement, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    applyTransforms(element, writer);
    renderTextLines(
        el.reverse(uvts2l.toLines(toStepsOfText(element), 0, 0)),
        eo.asSomeOrDefault(uv.textAnchorOutOf(element, styles), 'start'),
        writer
    );
}


function renderTextLines(
    lines: el.List<uvtl.Line>,
    textAnchor: string,
    writer: upw.Writer
): void {
    console.log(lines);
    el.use(
        lines,
        line => renderTextLine(
            cp.fromAlike(line),
            el.reverse(line.items),
            textAnchor,
            writer
        )
    );
}

function renderTextLine(
    at: cp.Position,
    items: el.List<uvtl.Item>,
    textAnchor: string,
    writer: upw.Writer
): void {

    var almostAlignedAt = anchorHorizontally(
        at,
        textAnchor,
        uvtl.measure(items, word => writer.doc.widthOfString(word))
    );

    var fullyAlignedAt = anchorToBaseLine(
        almostAlignedAt,
        writer.snapshot.fontSize,
        writer.options.baseLineAt
    );

    el.fold(
        items,
        fullyAlignedAt.x,
        (x, item) => uvtl.viaItem(item, {
            caseOfWord: item => {
                console.log(item.word, x, fullyAlignedAt.y);
                upw.drawText(item.word, x, fullyAlignedAt.y, writer);
                return x + writer.doc.widthOfString(item.word);
            },
            caseOfSpacing: item => x + item.spacing
        })
    );
}



function toStepsOfText(element: SVGTextElement): uvts.Step[] {
    var steps = ea.concatAll([
        toPositionSteps(element)
    ]);

    var spans = suckOutSpans(element);
    if (spans.length > 0) {
        // there can be either tspans 
        ea.appendAll(steps, ea.mapConcat(spans, toStepsOfTextSpan));
    } else {
        // or a single plain text 
        ea.append(steps, uvts.textFrom(ex.trim(element.textContent)));
    }

    return steps;
}




function toStepsOfTextSpan(span: SVGTSpanElement): uvts.Step[] {
    return ea.concatAll([
        toPositionSteps(span),
        [uvts.textFrom(ex.trim(span.textContent))]
    ]);
}

function toPositionSteps(text: SVGTextPositioningElement): uvts.Step[] {
    return ea.choose<eo.Optional<uvts.Step>, uvts.Step>(
        [
            eo.map(
                uv.singleLengthOutOfList(text.x.baseVal),
                uvts.xFrom
            ),
            eo.map(
                uv.singleLengthOutOfList(text.y.baseVal),
                uvts.yFrom
            ),
            eo.map(
                uv.singleLengthOutOfList(text.dx.baseVal),
                uvts.dxFrom
            ),
            eo.map(
                uv.singleLengthOutOfList(text.dy.baseVal),
                uvts.dyFrom
            )
        ],
        ec.id
    );
}

var appendTSpanViaNode: ud.ViaNodeAlpha<SVGTSpanElement[], SVGTSpanElement[]> = {
    caseOfElement: (element, result) => ea.append(result, uv.asTSpan(<SVGElement>element)),
    caseOfText: (_, result) => result,
    caseOfComment: (_, result) => result
};

function suckOutSpans(element: SVGTextElement): SVGTSpanElement[] {
    return ud.foldChildren(
        element, <SVGTSpanElement[]>[],
        (result, node) => ud.viaNodeAlpha(node, result, appendTSpanViaNode)
    );
}


/** AB: pdfKit anchors a piece of text by the left/top corner
    whereas SVG anchors it by the left/base-line point
    here we shifting the text up a bit to align it by the base-line
*/
function anchorToBaseLine(at: cp.Position, fontSize: number, baseLineAt: number): cp.Position {
    return cp.positionFrom(
        at.x,
        at.y - fontSize * baseLineAt
    );
}

function anchorHorizontally(at: cp.Position, anchor: string, width: number): cp.Position {
    return uv.viaTextAnchor(anchor, {
        caseOfStart: () => at,
        caseOfMiddle: () => cp.positionFrom(at.x - width / 2, at.y),
        caseOfEnd: () => cp.positionFrom(at.x - width, at.y),
        caseOfInherit: () => ec.fail<cp.Position>('Unsupported text anchor \'' + anchor + '\.')
    });
}

var applyTransformsVia: uv.ViaTransformAlpha<upw.Writer, void> = {
    caseOfUnknown: () => ec.fail<void>('Unknown transformation.'),
    caseOfMatrix: () => ec.fail<void>('Matrix transformation is not supported.'),
    caseOfScale: (transform, writer) => upw.scaleBy(
        transform.matrix.a,
        transform.matrix.d,
        writer
    ),
    caseOfSkewX: () => ec.fail<void>('SkewX transformation is not supported.'),
    caseOfSkewY: () => ec.fail<void>('SkewY transformation is not supported.'),
    caseOfRotate: (transform, writer) => upw.rotateBy(
        transform.angle,
        writer
    ),
    caseOfTranslate: (transform, writer) => upw.translateBy(
        transform.matrix.e,
        transform.matrix.f,
        writer
    )
};

export function applyTransforms<Alpha, r>(
    element: SVGTransformable,
    writer: upw.Writer
): void {

    var transforms = element.transform.baseVal;
    return el.use(
        el.reverse(
            el.fromIndexedAsReversed(
                transforms,
                transforms.numberOfItems,
                (transforms, index) => transforms.getItem(index)
            )
        ),
        transform => uv.viaTransformAlpha(
            transform,
            writer,
            applyTransformsVia
        )
    );
}


// https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
export var toStringViaSegmentPath = er.roughlyLike(uv.alwaysFailViaSegmentPathOf<string>(), but => {
    but.caseOfLineToAbs = segment => 'L ' + segment.x + ',' + segment.y;
    but.caseOfLineToRel = segment => 'l ' + segment.x + ',' + segment.y;
    but.caseOfMoveToAbs = segment => 'M ' + segment.x + ',' + segment.y;
    but.caseOfMoveToRel = segment => 'm ' + segment.x + ',' + segment.y;
    but.caseOfArcAbs = segment => 'A '
        + segment.r1 + ','
        + segment.r2 + ' '
        + segment.angle + ' '
        + (segment.largeArcFlag ? 1 : 0) + ','
        + (segment.sweepFlag ? 1 : 0) + ' '
        + segment.x + ',' + segment.y;
    but.caseOfClosepath = segment => 'Z';
    but.caseOfLineToVerticalAbs = segment => 'V ' + segment.y;
    but.caseOfLineToVerticalRel = segment => 'v ' + segment.y;
    but.caseOfLineToHorizontalAbs = segment => 'H ' + segment.x;
    but.caseOfLineToHorizontalRel = segment => 'h ' + segment.x;
    but.caseOfCurveToCubicRel = segment => 'c '
        + segment.x1 + ' ' + segment.y1 + ','
        + segment.x2 + ' ' + segment.y2 + ','
        + segment.x + '  ' + segment.y;
});
