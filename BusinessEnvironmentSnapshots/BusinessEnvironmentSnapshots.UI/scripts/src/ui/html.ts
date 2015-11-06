import * as ud from 'ui/dom';
import * as ea from 'essentials/array';
import * as ec from 'essentials/core';


export function toArrayFromHtmlCollection(elements: HTMLCollection) {
    return ea.fromIndexed(elements, elements => elements.length, (elements, at) => elements.item(at));
}


export interface ViaHtmlEcho<Alpha, Bravo, Charlie, Delta, Echo, r> {
    caseOfDiv(element: HTMLDivElement, alpha: Alpha, bravo: Bravo, charlie: Charlie, delta: Delta, echo: Echo): r;
    caseOfAnchor(element: HTMLAnchorElement, alpha: Alpha, bravo: Bravo, charlie: Charlie, delta: Delta, echo: Echo): r;
    caseOfTable(element: HTMLTableElement, alpha: Alpha, bravo: Bravo, charlie: Charlie, delta: Delta, echo: Echo): r;
    caseOfImage(element: HTMLImageElement, alpha: Alpha, bravo: Bravo, charlie: Charlie, delta: Delta, echo: Echo): r;
}

export function viaHtmlDelta<Alpha, Bravo, Charlie, Delta, Echo, r>(
    element: Element,
    alpha: Alpha, bravo: Bravo, charlie: Charlie, delta: Delta, echo: Echo,
    via: ViaHtmlEcho<Alpha, Bravo, Charlie, Delta, Echo, r>,
    haveOther: (element: Element, alpha: Alpha, bravo: Bravo, charlie: Charlie, delta: Delta, echo: Echo) => r
): r {
    switch (element.tagName.toLowerCase()) {
        case 'div': return via.caseOfDiv(<HTMLDivElement> element, alpha, bravo, charlie, delta, echo);
        case 'a': return via.caseOfAnchor(<HTMLAnchorElement> element, alpha, bravo, charlie, delta, echo);
        case 'table': return via.caseOfTable(<HTMLTableElement> element, alpha, bravo, charlie, delta, echo);
        case 'img': return via.caseOfImage(<HTMLImageElement> element, alpha, bravo, charlie, delta, echo);
        default: return haveOther(element, alpha, bravo, charlie, delta, echo);
    }
}



export interface ViaTableBodyChild<r> {
    caseOfTableRow(element: HTMLTableRowElement): r;
}
export function viaTableBodyChild<r>(
    element: Element,
    via: ViaTableBodyChild<r>,
    haveOther: (element: Element) => r
): r {
    switch(element.tagName.toLowerCase()) {
        case 'tr': return via.caseOfTableRow(<HTMLTableRowElement>element);
        default: return haveOther(element);
    }
}

export interface ViaTableRowChild<r> {
    caseOfTableData(element: HTMLTableDataCellElement): r;
    caseOfTableHeader(element: HTMLTableHeaderCellElement): r;
}

export function viaTableRowChild<r>(
    element: Element,
    via: ViaTableRowChild<r>,
    haveOther: (element: Element) => r
) : r {
    switch(element.tagName.toLowerCase()) {
        case 'td': return via.caseOfTableData(<HTMLTableDataCellElement>element);
        case 'th': return  via.caseOfTableHeader(<HTMLTableHeaderCellElement>element);
        default: return haveOther(element);
    }
}