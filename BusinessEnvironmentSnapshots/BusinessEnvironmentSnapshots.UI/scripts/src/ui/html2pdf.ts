import * as uh from 'ui/html';
import * as ud from 'ui/dom';
import * as ut from 'ui/tricks';
import * as ea from 'essentials/array';
import * as eo from 'essentials/optional';
import * as en from 'essentials/numbers';
import * as ec from 'essentials/core';
import * as ex from 'essentials/text';
import * as us from 'ui/styles';
import * as upw from 'ui/pdf/writer';
import * as cp from 'common/position';
import * as cb from 'common/box';
import * as cs from 'common/sides';


export type RenderNode = (node: Node, parentBox: cb.Box, styles: CSSStyleDeclaration, writer: upw.Writer, options: Options) => void;

var considerRenderingElementVia: uh.ViaHtmlEcho<cb.Box, CSSStyleDeclaration, upw.Writer, Options, RenderNode, void> = {
    caseOfDiv: renderDivElement,
    caseOfAnchor: renderAnchorElement,
    caseOfTable: renderTableElement,
    caseOfImage: renderImageElement
};

export function renderTextNode(
    text: Text,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options
): void {
    ex.withTrimmedNonBlank(text.textContent, trimmed => {
        withTextBeingRendered(trimmed, box, styles, writer, upw.drawTextExt, options);
    }, ec.ignore);
}

export function considerRenderingElement(
    element: Element,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options,
    renderNode: RenderNode,
    haveOther: (element: Element, box: cb.Box, styles: CSSStyleDeclaration, writer: upw.Writer, options: Options, renderNode: RenderNode) => void
): void {
    return uh.viaHtmlDelta(
        element,
        box, styles, writer, options, renderNode,
        considerRenderingElementVia,
        haveOther
    );
}

function renderAnchorElement(
    element: HTMLAnchorElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options,
    renderNode: RenderNode
): void {
    upw.setLink(eo.someFrom(element.href), writer);
    _renderGenericElement(
        element,
        box, styles,
        writer, options,
        renderNode
    );
}


function renderImageElement(
    element: HTMLImageElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options
): void {
    upw.drawImage(
        ut.toPngDataUrlOfImage(element),
        box.x,
        box.y,
        box.width,// * rx,
        box.height,// * ry,
        writer
    );
}

function renderDivElement(
    element: HTMLDivElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options,
    renderNode: RenderNode
): void {
    _renderGenericElement(element, box, styles, writer, options, renderNode);
}

function _renderGenericElement(
    element: HTMLElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options,
    renderNode: RenderNode
): void {
    accountForBackground(box, styles, writer);
    accountForBorder(box, styles, writer);
    return ud.useChildren(
        element,
        node => upw.withLocalWriter(
            writer,
            writer => renderNode(node, box, styles, writer, options)
        )
    );
}

function renderTableElement(
    element: HTMLTableElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options
): void {
    return ea.use(
        uh.toArrayFromHtmlCollection(element.tBodies),
        body => renderTableBodyElement(<HTMLTableSectionElement>body, box, styles, writer, options)
    );
}

function renderTableBodyElement(
    element: HTMLTableSectionElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options
): void {
    return ea.use(
        uh.toArrayFromHtmlCollection(element.rows),
        element => uh.viaTableBodyChild<void>(
            element, {
                caseOfTableRow: element => renderTableRowElement(element, writer, options)
            },
            element => ec.fail<void>('Unexpected element \'' + element.tagName + '\' in a tbody element.')
        )
    );
}

function renderTableRowElement(
    element: HTMLTableRowElement,
    writer: upw.Writer,
    options: Options
): void {
    var styles = ud.computedStylesOutOfElement(element);
    var backroundColor = us.tryParseColor(styles.backgroundColor);
    if (eo.isSome(backroundColor)) {
        accountForBackground(options.toBoxOfElement(element), styles, writer);
    }
    return ea.use(
        uh.toArrayFromHtmlCollection(element.cells),
        element => {
            var box = options.toBoxOfElement(element);
            var styles = ud.computedStylesOutOfElement(element);
            return upw.withLocalWriter(writer, writer => uh.viaTableRowChild(
                element, {
                    caseOfTableData: element => renderTableDataElement(element, box, styles, writer, options),
                    caseOfTableHeader: element => renderTableHeaderElement(element, box, styles, writer, options)
                },
                element => ec.fail<void>('Unexpected elment \'' + element.tagName + '\' in a tr element')
            ));
        }
    );
}

function renderTableDataElement(
    element: HTMLTableDataCellElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options
): void {
    renderTableCellElement(element, box, styles, writer, options);
}

function renderTableHeaderElement(
    element: HTMLTableHeaderCellElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options
): void {
    renderTableCellElement(element, box, styles, writer, options);
}

function renderTableCellElement(
    element: HTMLTableHeaderCellElement,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: Options
): void {

    accountForBackground(box, styles, writer);
    accountForBorder(box, styles, writer);

    ex.withTrimmedNonBlank(
        element.textContent,
        trimmed => {
            withTextBeingRendered(trimmed, box, styles, writer, upw.drawTextExt, options);
        },
        ec.ignore
    );

}

function withTextBeingRendered(
    trimmed: string,
    box: cb.Box,
    styles: CSSStyleDeclaration,
    writer: upw.Writer,
    drawText: (value: string, x: number, y: number, options: PDFTextOptions, writer: upw.Writer) => void,
    writerOptions: Options
): void {

    return upw.withLocalWriter(writer, writer => {
        accountForColor(styles, writer);
        accountForFont(styles, writer);
        var sanitized = normalizeWhitespaces(trimmed);
        var value = isUpperCase(styles) ? sanitized.toUpperCase() : sanitized;
        var padding = cs.map(us.toPadding(styles), us.toPixels);
        var x = box.x + padding.left;
        var y = box.y + padding.top + accountForLineHeight(styles, writer);
        var avaliableWidth = box.width - padding.left - padding.right;
        var availableHeight = box.height - padding.top - padding.bottom;
        var align = upw.forTextAlign(upw.parseTextAlignWithFlowDirection(
            styles.textAlign,
            writerOptions.textFlowDirection
        ), upw.stringForTextAlign);
        var textOptions: PDFTextOptions = {
            width: avaliableWidth,
            height: availableHeight,
            align,
            underline: us.isUnderlined(styles)
        };
        drawText(
            value,
            x, y,
            textOptions,
            writer
        );
        upw.fillAndStrokeDocument(writer);
    });

}

function accountForFont(styles: CSSStyleDeclaration, writer: upw.Writer): void {
    accountForFontSize(styles, writer);
    accountForFontStyle(styles, writer);
}

function normalizeWhitespaces(value: string): string {
    return value.replace(/\s+/ig, ' ');
}

var isBoldForFontWeight: us.ForFontWeight<{ (): boolean; }> = {
    caseOfLighter: () => ec.fail<boolean>('Unable to tell whether \'lighter\' is bold. Relative font-weight is not supported.'),
    caseOfBolder: () => ec.fail<boolean>('Unable to tell whether \'bolder\' is bold. Relative font-weight is not supported.'),
    caseOf100: ec.alwaysFalse,
    caseOf200: ec.alwaysFalse,
    caseOf300: ec.alwaysFalse,
    caseOfNormal: ec.alwaysFalse,
    caseOf400: ec.alwaysFalse,
    caseOf500: ec.alwaysFalse,
    caseOf600: ec.alwaysTrue,
    caseOf700: ec.alwaysTrue,
    caseOfBold: ec.alwaysTrue,
    caseOf800: ec.alwaysTrue,
    caseOf900: ec.alwaysTrue,

}

function isItalic(value: string): boolean {
    return value === 'italic' || value === 'oblique';
}

function accountForFontStyle(styles: CSSStyleDeclaration, writer: upw.Writer): void {
    var weight = us.fontWeightOutOf(styles);
    upw.fontStyleOn(
        eo.isSome(weight) ? us.forFontWeight(weight.some, isBoldForFontWeight)() : false,
        isItalic(us.fontStyleOutOf(styles)),
        writer
    );
}

function accountForFontSize(styles: CSSStyleDeclaration, writer: upw.Writer): void {
    var size = us.fontSizeOutOf(styles);
    if (eo.isSome(size)) {
        upw.fontSizeOn(
            us.toPixels(size.some) * writer.options.fontSizeFactor,
            writer
        );
    }
}

function isUpperCase(styles: CSSStyleDeclaration): boolean {
    var decoration = us.textTransformationOutOf(styles);
    if (decoration === 'uppercase') {
        return true;
    } else if (decoration === 'none') {
        return false;
    } else {
        return ec.fail<boolean>('Unexpected text decoration \'' + decoration + '\'.');
    }
}



function accountForLineHeight(styles: CSSStyleDeclaration, writer: upw.Writer): number {
    var lineHeight = us.toEffectiveLineHeight(styles, writer.options.normalLineHeightToFontSizeRatio);
    if (eo.isSome(lineHeight)) {
        return en.maxOf2(0, us.toPixels(lineHeight.some) - writer.doc.currentLineHeight()) / 2
    } else {
        return 0;
    }
}

function accountForColor(styles: CSSStyleDeclaration, writer: upw.Writer): void {
    var color = us.tryParseColor(styles.color);
    if (eo.isSome(color)) {
        upw.setFill(
            us.formatColorAsHex6(color.some),
            color.some.opacity,
            writer
        );
    }
}

function accountForBackground(box: cb.Box, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    var backgroundColor = us.tryParseColor(styles.backgroundColor);
    if (eo.isSome(backgroundColor)) {
        upw.withLocalWriter(writer, writer => {
            upw.setFill(us.formatColorAsHex6(backgroundColor.some), backgroundColor.some.opacity, writer);
            upw.drawRectangle(box, writer);
            upw.fillDocument(writer);
        });
    }
}

function accountForBorder(box: cb.Box, styles: CSSStyleDeclaration, writer: upw.Writer): void {
    upw.withLocalWriter(writer, writer => {
        considerDrawingLine(box, styles, us.borderTopAccessor, cb.topLineAccessor, writer);
        considerDrawingLine(box, styles, us.borderRightAccessor, cb.rightLineAccessor, writer);
        considerDrawingLine(box, styles, us.borderBottomAccessor, cb.bottonLineAccessor, writer);
        considerDrawingLine(box, styles, us.borderLeftAccessor, cb.leftLineAccessor, writer);
    });
}

function considerDrawingLine(
    box: cb.Box,
    styles: CSSStyleDeclaration,
    borderAccessor: us.BorderAccessor,
    lineAccessor: cp.LineAccessor<cb.Box>,
    writer: upw.Writer
): void {
    us.withBorder(styles, borderAccessor, (color, style, width) => {
        if (width > 0 && eo.isSome(color) && eo.isSome(style)) {
            upw.strokeOn(us.formatColorAsHex6(color.some), color.some.opacity, writer);
            upw.drawLine(
                lineAccessor.toStartAt(box),
                lineAccessor.toEndAt(box),
                writer
            );
            upw.strokeDocument(writer);
        }
    });
}

export interface Options {
    textFlowDirection: upw.TextFlowDirection;
    toBoxOfElement(element: Element): cb.Box;
}