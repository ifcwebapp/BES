import * as ec from 'essentials/core';
import * as ex from 'essentials/text';
import * as en from 'essentials/numbers';
import * as ea from 'essentials/array';
import * as eo from 'essentials/optional';
import * as cp from 'common/position';
import * as cb from 'common/box';
import * as cn from 'common/numbers';

import { Optional, alwaysFromNoneOf, fromSome } from 'essentials/optional';
import { fail } from 'essentials/core';
import { valueOf } from 'common/accessors';

export function documentOutOfElement(element: Element): Document {
    return element.ownerDocument;
}

export function windowOutOfElement(element: Element): Window {
    return documentOutOfElement(element).defaultView;
}

export function attachAll(node: Node, nodes: Node[]) : void {
    ea.use(nodes, next => node.appendChild(next));
}

export function detachChildren(node: Node) : void {
    while (node.lastChild != null) {
        node.removeChild(node.lastChild);
    }
}

export function toChildElementOrDie(element: Element, selector: string, failure: string): Element {
    let foundElementOpt = <Element>element.querySelector(selector);
    return foundElementOpt == null ? fail<Element>(failure + ' Unable to find an element at \'' + selector + '\'.') : foundElementOpt;
}

export function toBoxOfElement(element: Element): cb.Box {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    var rect = element.getBoundingClientRect();
    var offset = toWindowScrollOffset(windowOutOfElement(element));
    return cb.boxFrom(
        rect.left + offset.x,
        rect.top + offset.y,
        rect.right - rect.left,
        rect.bottom - rect.top
    );
}

export function toWindowScrollOffset(window: Window): cp.Position {
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
    if (window.pageXOffset != null) {
        return { x: window.pageXOffset, y: window.pageYOffset };
    } else if (window.scrollX != null) {
        return { x: window.scrollX, y: window.scrollY };
    } else {
        var node = document.documentElement || document.body.parentNode;
        return {
            x: (<any>(typeof (<any>node).ScrollLeft == 'number' ? node : document.body)).ScrollLeft,
            y: (<any>(typeof (<any>node).ScrollTop == 'number' ? node : document.body)).ScrollTop
        };
    }
}

export function useChildren(node: Node, use: (child: Node) => void): void {
    for (let child = node.firstChild; child != null; child = child.nextSibling) {
        use(child);
    }
}

export function useChildrenAlpha<Alpha>(node: Node, alpha: Alpha, use: (child: Node, alpha: Alpha) => void): void {
    for (let child = node.firstChild; child != null; child = child.nextSibling) {
        use(child, alpha);
    }
}

export function displayOf(styles: CSSStyleDeclaration): string {
    return styles.display;
}

export function foldChildren<r>(node: Node, result: r, fold: (result: r, child: Node) => r): r {
    for (let child = node.firstChild; child != null; child = child.nextSibling) {
        result = fold(result, child);
    }
    return result;
}

export function foldChildrenAlpha<a, r>(node: Node, result: r, alpha: a, fold: (result: r, child: Node, alpha: a) => r): r {
    for (let child = node.firstChild; child != null; child = child.nextSibling) {
        result = fold(result, child, alpha);
    }
    return result;
}

export interface ViaNode<r> {
    caseOfElement(element: Element): r;
    caseOfText(text: Text): r;
    caseOfComment(comment: Comment): r;
}

export function viaNode<r>(node: Node, via: ViaNode<r>): r {
    switch (node.nodeType) {
        case Node.ELEMENT_NODE: return via.caseOfElement(<Element>node);
        case Node.TEXT_NODE: return via.caseOfText(<Text>node);
        case Node.COMMENT_NODE: return via.caseOfComment(<Comment>node);
        default: return fail<r>('Unexpected case \'' + node.nodeType + '\' of a DOM node type.');
    }
}

export interface ViaNodeAlpha<a, r> {
    caseOfElement(element: Element, alpha: a): r;
    caseOfText(text: Text, alpha: a): r;
    caseOfComment(comment: Comment, alpha: a): r;
}

export function viaNodeAlpha<a, r>(node: Node, alpha: a, via: ViaNodeAlpha<a, r>): r {
    switch (node.nodeType) {
        case Node.ELEMENT_NODE: return via.caseOfElement(<Element>node, alpha);
        case Node.TEXT_NODE: return via.caseOfText(<Text>node, alpha);
        case Node.COMMENT_NODE: return via.caseOfComment(<Comment>node, alpha);
        default: return fail<r>('Unexpected case \'' + node.nodeType + '\' of a DOM node type.');
    }
}

export function withAttribute<r>(
    attribute: NamedNodeMap,
    name: string,
    haveAttribute: (attribute: Attr) => r,
    haveNone: (reason: string) => r
): r {
    var attributeOpt = attribute.getNamedItem(name);
    return attributeOpt != null
        ? haveAttribute(attributeOpt)
        : haveNone('There is no attribute named \'' + name + '\'.');
}


function someValueOf<a>(value: { value: a; }): Optional<a> {
    return fromSome(valueOf(value));
}

export function toAttributeValueAt(element: Node, name: string): Optional<string> {
    return withAttribute(element.attributes, name, someValueOf, alwaysFromNoneOf<string>());
}


export function computedStylesOutOfElement(element: Element): CSSStyleDeclaration {
    return windowOutOfElement(element).getComputedStyle(element);
}
