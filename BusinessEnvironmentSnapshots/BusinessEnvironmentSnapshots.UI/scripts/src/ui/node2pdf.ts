import * as ec from 'essentials/core';
import * as upw from 'ui/pdf/writer';
import * as uh2p from 'ui/html2pdf';
import * as uv2p from 'ui/svg2pdf';
import * as ud from 'ui/dom';
import * as cb from 'common/box';
import * as us from 'ui/styles';


export function renderNode(
    node: Node,
    parentBox: cb.Box,
    parentStyles: CSSStyleDeclaration,
    writer: upw.Writer,
    options: uh2p.Options
): void {
    return ud.viaNode(node, {
        caseOfElement: element => renderElement(element, writer, options, renderNode),
        caseOfText: text => uh2p.renderTextNode(text, parentBox, parentStyles, writer, options),
        caseOfComment: ec.ignore
    })
}

function renderElement(
    element: Element,
    writer: upw.Writer,
    options: uh2p.Options,
    renderNode: (
        node: Node,
        parentBox: cb.Box,
        parentStyles: CSSStyleDeclaration,
        writer: upw.Writer,
        options: uh2p.Options
    ) => void
): void {

    var styles = ud.computedStylesOutOfElement(element);
    if (us.isDisplayed(styles)) {
        var box = options.toBoxOfElement(element);
        uh2p.considerRenderingElement(
            element,
            box,
            styles,
            writer,
            options,
            renderNode,
            () => {
                if (element.tagName.toLowerCase() === 'svg') {
                    upw.withLocalWriter(writer, writer => {
                        upw.translateBy(box.x, box.y, writer);
                        uv2p.considerRenderingElement(element, box, styles, writer);
                    });
                } else {
                    return ec.fail<void>('Unable to render an element. Unsupported tag \'' + element.tagName + '\'.');
                }
            }
        );
    }
}

