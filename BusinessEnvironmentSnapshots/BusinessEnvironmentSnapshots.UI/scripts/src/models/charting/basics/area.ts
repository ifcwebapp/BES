import csz = require('common/size');
import visual = require('models/charting/basics/styles');

export interface Area {
    svg: D3.Selection;
    size: csz.Size;
}

export function withArea<r>(
    element: Element,
    custom: typeof visual,
    shouldBeCentered: boolean,
    haveSvg: (
        outer: Area,
        inner: Area,
        textHeight: number
    ) => r
) : r {
    var textHeight = 12;
    var bounds = element.getBoundingClientRect();
    var width = bounds.right - bounds.left;
    var height = custom.height;
    var svg = d3.select(element)
        .append('svg')
            .attr('width', width)
            .attr('height', height);
    var outerSize = csz.sizeFrom(width, height);
    var margin = custom.margin;
    var innerSize = csz.sizeFrom(
        toWidth(outerSize, margin),
        toHeight(outerSize, margin)
    );
    var outer = {
        svg: svg,
        size: outerSize
    };
    var inner = {
        svg: svg.append('g')
            .attr('transform', shouldBeCentered ? 'translate(' + innerSize.width / 2 + ',' + innerSize.height / 2 + ')' : 'translate(' + margin.left + ',' + margin.top + ')'),
        size: innerSize
    };
    return haveSvg(
        outer,
        inner,
        textHeight
    );
}

function toWidth(size: csz.Size, margin: { left: number; right: number; }) : number {
    return size.width - margin.left - margin.right;
}

function toHeight(size: csz.Size, margin: { top: number; bottom: number; }) : number {
    return size.height - margin.top - margin.bottom;
}
