import * as eo from 'essentials/optional';
import * as cb from 'common/box';
import * as ec from 'essentials/core';
import * as er from 'essentials/runtime';
import * as el from 'essentials/list';
import * as cp from 'common/position';
import * as ex from 'essentials/text';
import * as zs from 'ui/pdf/states';

function revertLink(snapshot: zs.Snapshot, state: zs.LinkState): void {
    snapshot.link = state.link;
}

export var fonts = {
    regular: 'Helvetica',
    bold: 'Helvetica-Bold',
    italic: 'Helvetica-Oblique',
    boldItalic: 'Helvetica-BoldOblique'
};

function toFontName(isBold: boolean, isItalic: boolean): string {
    return isBold
        ? isItalic ? fonts.boldItalic : fonts.bold
        : isItalic ? fonts.italic : fonts.regular;
}

export function setLink(link: eo.Optional<string>, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.LinkState>({
        link: writer.snapshot.link
    }));
    writer.snapshot.link = link;
}

export interface WriterOptions {
    baseLineAt: number;
    normalLineHeightToFontSizeRatio: number;
    defaultPosition: cp.Position;
    fontSizeFactor: number;
}

export interface Writer {
    doc: PDFDocument;
    options: WriterOptions;
    snapshot: zs.Snapshot;
    states: el.List<zs.State>;
}

export function toWriter(
    doc: PDFDocument,
    snapshot: zs.Snapshot,
    options: WriterOptions
): Writer {
    var result = {
        doc: doc,
        states: el.toListOf<zs.State>(),
        options: options,
        snapshot: snapshot
    };
    initialize(result);
    return result;
}

function initialize(writer: Writer): void {
    writer.doc.fontSize(writer.snapshot.fontSize);
    writer.doc.font(toFontName(writer.snapshot.isBold, writer.snapshot.isItalic));
    writer.doc.lineWidth(writer.snapshot.lineWidth);
    writer.doc.fillColor(writer.snapshot.fillColor);
    writer.doc.strokeColor(writer.snapshot.strokeColor);
    writer.doc._doOpacity(writer.snapshot.fillOpacity, writer.snapshot.strokeOpacity);
    writer.doc.translate(writer.snapshot.x, writer.snapshot.y);
    writer.doc.rotate(writer.snapshot.a);
}

export function addPage(writer: Writer): void {
    writer.doc.addPage({ margin: 0 });
}

export function withLocalWriter<r>(writer: Writer, haveWriter: (writer: Writer) => r): r {
    //console.group();
    //console.log(JSON.stringify(writer.snapshot), JSON.stringify(writer.states));
    // keep the states before they get overriden
    var savedStates = writer.states;
    // let the writer mutate as much as it wants
    var result = haveWriter(writer);
    // revert to the state before the mutation
    rewind(writer, savedStates);
    //console.log(JSON.stringify(writer.snapshot), JSON.stringify(writer.states));
    //console.groupEnd();
    return result;
}

function rewind(writer: Writer, last: el.List<zs.State>) {
    var rest = writer.states;
    while (last !== rest) {
        var head = el.headOfOrDie(rest, 'There are no states to rewind.');
        revertState(writer.doc, writer.snapshot, head.value);
        rest = head.rest;
    }
    writer.states = rest;
}

function revertState(doc: PDFDocument, snapshot: zs.Snapshot, state: zs.State): void {
    if (zs.isFillState(state)) {
        doc.fillColor(
            snapshot.fillColor = state.fillColor
        );
        doc.fillOpacity(
            snapshot.fillOpacity = state.fillOpacity
        );
    } else if (zs.isStrokeState(state)) {
        doc.strokeColor(
            snapshot.strokeColor = state.strokeColor
        );
        doc.strokeOpacity(
            snapshot.strokeOpacity = state.strokeOpacity
        );
    } else if (zs.isLineWidth(state)) {
        doc.lineWidth(
            snapshot.lineWidth = state.lineWidth
        );
    } else if (zs.isFillAndStroke(state)) {
        doc.fillColor(
            snapshot.fillColor = state.fillColor
        );
        doc.strokeColor(
            snapshot.strokeColor = state.strokeColor
        );
        doc._doOpacity(
            snapshot.fillOpacity = state.fillOpacity,
            snapshot.strokeOpacity = state.strokeOpacity
        );
    } else if (zs.isTranslateByState(state)) {
        revertTranslateBy(doc, snapshot, state);
    } else if (zs.isRotateByState(state)) {
        revertRotateBy(doc, snapshot, state);
    } else if (zs.isFontSizeState(state)) {
        doc.fontSize(snapshot.fontSize = state.fontSize);
    } else if (zs.isScaleByState(state)) {
        revertScaleBy(doc, snapshot, state);
    } else if (zs.isLinkState(state)) {
        revertLink(snapshot, state);
    } else if (zs.isFontStyleState(state)) {
        revertFontStyle(doc, snapshot, state);
    } else if (zs.isLetterSpacingState(state)) {
        revertLetterSpacing(snapshot, state);
    } else if (zs.isWordSpacingState(state)) {
        revertWordSpacing(snapshot, state);
    } else if (zs.isLineDashnessState(state)) {
        var dashness = state.lineDashness;
        if (eo.isSome(dashness)) {
            doc.dash(
                dashness.some.dashLength, {
                    space: dashness.some.gapLength,
                    phase: dashness.some.phase
                }
            );
        } else {
            doc.undash();
        }
    } else {
    }
}

export function letterSpacingOn(value: eo.Optional<number>, writer: Writer) : void {
    writer.states = el.add(writer.states, ec.id<zs.LetterSpacingState>({
        letterSpacing: writer.snapshot.letterSpacing
    }));
    writer.snapshot.letterSpacing = value;
}

function revertLetterSpacing(snapshot: zs.Snapshot, state: zs.LetterSpacingState): void {
    snapshot.letterSpacing = state.letterSpacing;
}

export function wordSpacingOn(value: eo.Optional<number>, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.WordSpacingState>({
        wordSpacing: writer.snapshot.wordSpacing
    }));
    writer.snapshot.wordSpacing = value;
}

function revertWordSpacing(snapshot: zs.Snapshot, state: zs.WordSpacingState): void {
    snapshot.wordSpacing = state.wordSpacing;
}

export function fontStyleOn(isBold: boolean, isItalic: boolean, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.FontStyleState>({
        isBold: writer.snapshot.isBold,
        isItalic: writer.snapshot.isItalic
    }));
    writer.doc.font(toFontName(isBold, isItalic));
}

function revertFontStyle(doc: PDFDocument, snapshot: zs.Snapshot, state: zs.FontStyleState): void {
    doc.font(toFontName(
        snapshot.isBold = state.isBold,
        snapshot.isItalic = state.isItalic
    ));
}

function accountForTextOptions(snapshot: zs.Snapshot, options: PDFTextOptions): void {
    accountForLink(snapshot, options);
    accountForCharacterSpacing(snapshot, options);
}

function accountForCharacterSpacing(snapshot: zs.Snapshot, options: PDFTextOptions) : void {
    var letterSpacing = snapshot.letterSpacing;
    if (eo.isSome(letterSpacing)) {
        options.characterSpacing = letterSpacing.some;
    }
    var wordSpacing = snapshot.wordSpacing;
    if (eo.isSome(wordSpacing)) { 
        options.wordSpacing = wordSpacing.some;
    }
}

function accountForLink(snapshot: zs.Snapshot, options: PDFTextOptions): void {
    var link = snapshot.link;
    if (eo.isSome(link)) {
        options.link = link.some;
    }
}

export function drawRectangle(box: cb.Box, writer: Writer): void {
    writer.doc.rect(box.x, box.y, box.width, box.height);
}

export function drawLine(startAt: cp.Position, endAt: cp.Position, writer: Writer): void {
    writer.doc.moveTo(startAt.x, startAt.y);
    writer.doc.lineTo(endAt.x, endAt.y);
}

export function drawCircle(x: number, y: number, r: number, writer: Writer): void {
    writer.doc.circle(x, y, r);
}

export function drawPath(path: string, writer: Writer): void {
    writer.doc.path(path);
}

export function drawImage(dataUrl: string, x: number, y: number, width: number, height: number, writer: Writer): void {
    writer.doc.image(dataUrl, x, y, { width: width, height: height });
}

export function setFill(color: string, opacity: number, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.FillState>({
        fillColor: writer.snapshot.fillColor,
        fillOpacity: writer.snapshot.fillOpacity
    }));
    writer.doc.fillColor(writer.snapshot.fillColor = color);
    writer.doc._doOpacity(writer.snapshot.fillOpacity = opacity, undefined);
}

export function strokeOn(color: string, opacity: number, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.StrokeState>({
        strokeColor: writer.snapshot.strokeColor,
        strokeOpacity: writer.snapshot.strokeOpacity
    }));
    writer.doc.strokeColor(writer.snapshot.strokeColor = color);
    writer.doc._doOpacity(undefined, writer.snapshot.strokeOpacity = opacity);
}

export function lineWidthOn(value: number, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.LineWidthState>({
        lineWidth: writer.snapshot.lineWidth
    }));
    writer.doc.lineWidth(writer.snapshot.lineWidth = value);
}

export function fillAndStrokeOn(
    fillColor: string,
    fillOpacity: number,
    strokeColor: string,
    strokeOpacity: number,
    writer: Writer
): void {
    writer.states = el.add(writer.states, <zs.FillAndStrokeState>{
        fillColor: writer.snapshot.fillColor,
        fillOpacity: writer.snapshot.fillOpacity,
        strokeColor: writer.snapshot.strokeColor,
        strokeOpacity: writer.snapshot.strokeOpacity
    });
    writer.doc.fillColor(writer.snapshot.fillColor = fillColor);
    writer.doc.strokeColor(writer.snapshot.strokeColor = strokeColor);
    writer.doc._doOpacity(
        writer.snapshot.fillOpacity = fillOpacity,
        writer.snapshot.strokeOpacity = strokeOpacity
    );
}

export function scaleBy(sx: number, sy: number, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.ScaleByState>({
        sx: writer.snapshot.sx,
        sy: writer.snapshot.sy
    }));
    writer.snapshot.sx *= sx;
    writer.snapshot.sy *= sy;
    writer.doc.save();
    writer.doc.scale(sx, sy);
}

function revertScaleBy(doc: PDFDocument, snapshot: zs.Snapshot, state: zs.ScaleByState): void {
    doc.restore();
    snapshot.sx = state.sx;
    snapshot.sy = state.sy;
}

export function translateBy(x: number, y: number, writer: Writer): void {

    writer.states = el.add(writer.states, ec.id<zs.TranslateByState>({
        x: writer.snapshot.x,
        y: writer.snapshot.y
    }));
    writer.snapshot.x += x;
    writer.snapshot.y += y;
    writer.doc.save();
    writer.doc.translate(x, y);
}

function revertTranslateBy(doc: PDFDocument, snapshot: zs.Snapshot, state: zs.TranslateByState): void {
    doc.restore();
    snapshot.x = state.x;
    snapshot.y = state.y;
}

export function rotateBy(a: number, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.RotateByState>({
        a: writer.snapshot.a
    }));
    writer.snapshot.a += a;
    writer.doc.save();
    writer.doc.rotate(a);
}

function revertRotateBy(doc: PDFDocument, snapshot: zs.Snapshot, state: zs.RotateByState): void {
    doc.restore();
    snapshot.a = state.a;
}

/** Renders a stroked object (no fill). */
export function strokeDocument(writer: Writer): void {
    // AB: it is impossible to account for the opacity using this method
    // so instead of passing a color, we use a separate call to `strokeColor`
    writer.doc.stroke();
}

/** Renders both a filled and stroked object. */
export function fillAndStrokeDocument(writer: Writer): void {
    writer.doc.fillAndStroke();
}

/** Renders a filled object (no stroke) using the color that was set before using `fillColor`. */
export function fillDocument(writer: Writer): void {
    // AB: it is impossible to account for the opacity using this method
    // so instead of passing a color, we use a separate call to `fillColor`
    writer.doc.fill();
}

export function fontSizeOn(value: number, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.FontSizeState>({
        fontSize: writer.snapshot.fontSize
    }));
    writer.doc.fontSize(writer.snapshot.fontSize = value);
}

export function lineDashnessOn(dashness: zs.Dashness, writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.LineDashnessState>({
        lineDashness: writer.snapshot.lineDashness
    }));
    writer.doc.dash(
        dashness.dashLength, {
            space: dashness.gapLength,
            phase: dashness.phase
        }
    );
    writer.snapshot.lineDashness = eo.fromSome(dashness);
}

export function lineSolidnessOn(writer: Writer): void {
    writer.states = el.add(writer.states, ec.id<zs.LineDashnessState>({
        lineDashness: writer.snapshot.lineDashness
    }));
    writer.doc.undash();
    writer.snapshot.lineDashness = eo.noneFrom('Line is solid.');
}

/** @param text Should be a trimmed single line. */
export function drawText(text: string, x: number, y: number, writer: Writer): void {
    var options: PDFTextOptions = {};
    accountForTextOptions(writer.snapshot, options);
    writer.doc._fragment(text, x, y, options);
}

export const enum TextFlowDirection { LeftToRight, RightToLeft }
export interface ForTextFlowDirection<r> {
    forLeftToRight: r;
    forRightToLeft: r;
}
export function forTextFlowDirection<r>(
    direction: TextFlowDirection,
    result: ForTextFlowDirection<r>
): r {
    switch (direction) {
        case TextFlowDirection.LeftToRight: return result.forLeftToRight;
        case TextFlowDirection.RightToLeft: return result.forRightToLeft;
        default: return ec.fail<r>('Unexpected case \'' + direction + '\' of a text flow direction.');
    }
}
export const enum TextAlign { Left, Right, Center, Justify }
export interface ForTextAlign<r> {
    forLeft: r;
    forRight: r;
    forCenter: r;
    forJustify: r;
}
export function forTextAlign<r>(align: TextAlign, result: ForTextAlign<r>): r {
    switch (align) {
        case TextAlign.Left: return result.forLeft;
        case TextAlign.Right: return result.forRight;
        case TextAlign.Center: return result.forCenter;
        case TextAlign.Justify: return result.forJustify;
        default: return ec.fail<r>('Unexpected case \'' + align + '\' of a text align.');
    }
}
export interface ViaTextAlign<r> {
    caseOfLeft(): r;
    caseOfRight(): r;
    caseOfCenter(): r;
    caseOfJustify(): r;
}
export function viaTextAlign<r>(
    align: TextAlign,
    via: ViaTextAlign<r>
): r {
    switch (align) {
        case TextAlign.Left: return via.caseOfLeft();
        case TextAlign.Right: return via.caseOfRight();
        case TextAlign.Center: return via.caseOfCenter();
        case TextAlign.Justify: return via.caseOfJustify();
        default: return ec.fail<r>('Unexpected case \'' + align + '\' of a text align.');
    }
}
export var stringForTextAlign: ForTextAlign<string> = {
    forCenter: 'center',
    forJustify: 'justify',
    forLeft: 'left',
    forRight: 'right'
};

export function parseTextAlign(value: string): TextAlign {
    switch (value) {
        case 'left': return TextAlign.Left;
        case 'right': return TextAlign.Right;
        case 'center': return TextAlign.Center;
        case 'justify': return TextAlign.Justify;
        default: return ec.fail<TextAlign>('Unexpected value \'' + value + '\' for a text align.');
    }
}

var startTextAlignForTextFlowDirection: ForTextFlowDirection<TextAlign> = {
    forLeftToRight: TextAlign.Left,
    forRightToLeft: TextAlign.Right
};

var endTextAlignForTextFlowDirection: ForTextFlowDirection<TextAlign> = {
    forLeftToRight: TextAlign.Right,
    forRightToLeft: TextAlign.Left
}

export function parseTextAlignWithFlowDirection(
    value: string,
    direction: TextFlowDirection
): TextAlign {
    switch (value) {
        case 'start': return forTextFlowDirection(direction, startTextAlignForTextFlowDirection);
        case 'end': return forTextFlowDirection(direction, endTextAlignForTextFlowDirection);
        case 'left': return TextAlign.Left;
        case 'right': return TextAlign.Right;
        case 'center': return TextAlign.Center;
        case 'justify': return TextAlign.Justify;
        default: return ec.fail<TextAlign>('Unexpected value \'' + value + '\' for a text align.');
    }
}


export function drawTextExt(
    text: string,
    x: number, y: number,
    options: PDFTextOptions,
    writer: Writer
): void {
    accountForTextOptions(writer.snapshot, options);
    writer.doc.text(text, x, y, options);
}

export function drawTextLink(
    text: string,
    x: number, y: number,
    url: string,
    options: PDFTextOptions,
    writer: Writer
): void {
    writer.doc.text(
        text, x, y,
        er.roughlyLike<PDFTextOptions>(
            options,
            but => {
                but.link = url;
                but.underline = true;
            }
        )
    );
}