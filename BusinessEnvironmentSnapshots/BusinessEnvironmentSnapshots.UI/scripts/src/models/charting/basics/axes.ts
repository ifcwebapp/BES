import ec = require('essentials/core');
import eo = require('essentials/optional');
import crn = require('common/range');
import dch = require('data/chart');
import visual = require('models/charting/basics/styles');
import us = require('ui/styles');
import zba = require('models/charting/basics/area');
import zbtw = require('models/charting/basics/text-wrapping');
import ach = require('articles/chart');

export function addValueAxis(
    valueRange: crn.Range<number>,
    area: zba.Area,
    formatValue: (value: number) => string,
    placed: ach.Placed,
    labelOpt: string,
    custom: {
        margin: typeof visual.margin;
        axis: typeof visual.axis.valueable;
    }
) : D3.Scale.LinearScale {
    
    let v = d3.scale.linear()
        .domain([valueRange.from, valueRange.to])
        .range(ach.forPlaced(placed, {
            forHorizontally: [0, area.size.width],
            forVertically: [area.size.height, 0]
        }));

    if (custom.axis.isNice) {
        v.nice();
    }
    
    let axis = d3.svg.axis().scale(v)
        .tickSize(custom.axis.tick.size)
        .tickSubdivide(true)
        .orient(ach.forPlaced(placed, {
            forHorizontally: 'bottom',
            forVertically: 'left'
        }))
        .tickFormat(formatValue);
    
    if (custom.axis.hasSubdividedTicks) {
        axis.tickSubdivide(true);
    }

    renderAxis(axis, labelOpt, area, placed, custom, ec.apply(v.range(), range => Math.abs(range[1] - range[0]) / v.ticks.length));
    
    return v;
}

export function renderAxis(
    axis: D3.Svg.Axis,
    labelOpt: string,
    area: zba.Area,
    placed: ach.Placed,
    custom: {
        margin: typeof visual.margin;
        axis: typeof visual.axis.categorial;
    },
    bandSize: number
) : D3.Selection {

    let axisSelection = area.svg
        .append('g')
        .attr('class', ach.forPlaced(placed, {
            forHorizontally: 'chart-axis as-x',
            forVertically: 'chart-axis as-y'
        }))
        .style(visual.axis.style);


    ach.viaPlaced<void>(placed, {
        caseOfHorizontally() {
            // moving the value axis to the bottom
            axisSelection.attr('transform', 'translate(0,' + (area.size.height) +  ')');
        },
        caseOfVertically() {
            // do nothing
        }
    });

    ec.use(labelOpt, label => {
        let labelSelection = axisSelection.append('g');

        ach.viaPlaced(placed, {
            caseOfHorizontally: () => {
                labelSelection.attr('transform', 'translate(' + area.size.width + ', ' + custom.axis.horizontal.label.offset + ')');
            },
            caseOfVertically: () => {
                labelSelection.attr('transform', 'rotate(90), translate(0, ' + custom.axis.vertical.label.offset + ')');
            }
        });

        labelSelection
            .append('text')
            .text(label)
            .style(visual.axis.label.style)
            .style('text-anchor', ach.forPlaced(placed, {
                forHorizontally: 'end',
                forVertically: 'start'
            }))

    });

    axis(axisSelection); // <-- rendering

    axisSelection.selectAll('line').style(visual.axis.line.style);
    axisSelection.selectAll('path').style(visual.axis.domain.style);

    eo.use(
        custom.axis.label.wrapping,
        wrapping => {
            var maxLength = eo.asSomeOrDefault(
                wrapping.maxLabelLength,
                toMaxLabelLength(placed, custom.margin, bandSize)
            );
            var textSelection = axisSelection.selectAll(".tick text");
            textSelection.style(visual.axis.label.style);
            textSelection.each(function() {
                var text = <SVGTextElement> this;
                text.setAttribute('vertical-text-anchor', ach.viaPlaced(placed, {
                    caseOfHorizontally: () => 'start',
                    caseOfVertically: () => 'middle'
                }));
                text.setAttribute('max-length', String(maxLength));
                zbtw.wrapIfNeeded(
                    text, 
                    1.2 * us.toPixels(eo.asSomeOrDefault(us.tryParseLength(
                        visual.axis.label.style['font-size'],
                        'Unable to read a font-size.'
                    ), 10))
                );
            });
        }
    );
        

    ec.apply(custom.axis.label, label => {

        let textSelection = axisSelection.selectAll('text');
        
        let transformations : string[] = [];

        if (label.angle !== 0) {
            textSelection.style('text-anchor', 'start');
            transformations.push('rotate(' + label.angle + ')');
        }

        if (label.offset.x !== 0) {
            transformations.push('translate(' + label.offset.x + ', 0)');
        }
        
        if (label.offset.y !== 0) {
            transformations.push('translate(0, ' + label.offset.y + ')');
        }

        if (transformations.length > 0) {
            textSelection.attr('transform', transformations.join(' '));
        }

    });


    return axisSelection;
}


export function toMaxLabelLength(
    placed: ach.Placed,
    margin: typeof visual.margin,
    bandSize: number
) : number {
    return ach.viaPlaced(placed, {
        caseOfHorizontally() { 
            return bandSize;
        },
        caseOfVertically() {
            return margin.left - 10;
        }
    });
}

export function renderCategorialAxis(
    u: D3.Scale.OrdinalScale,
    area: zba.Area,
    placed: ach.Placed,
    custom: {
        margin: typeof visual.margin;
        axis: typeof visual.axis.categorial;
    }
) : void {

    let uAxis = d3.svg.axis().scale(u)
        .tickSize(ach.forPlaced(placed, {
            forHorizontally: custom.axis.tick.size,
            forVertically: custom.axis.tick.size
        }))
        .orient(ach.forPlaced(placed, {
            forHorizontally: 'bottom',
            forVertically: 'left'
        }));
    
    if (custom.axis.hasSubdividedTicks) {
        uAxis.tickSubdivide(true)
    }

    renderAxis(uAxis, undefined, area, placed, custom, u.rangeBand());
}


export function addGrouppedCategoryAxis(
    categories: string[],
    seriesCount: number,
    area: zba.Area,
    placed: ach.Placed,
    custom: {
        axis: typeof visual.axis.categorial;
        margin: typeof visual.margin;
    }
) : [D3.Scale.OrdinalScale, D3.Scale.OrdinalScale] {

    let ub0 = d3.scale.ordinal()
        .domain(categories)
        .rangeRoundBands(
            ach.forPlaced(placed, {
                forHorizontally: [0, area.size.width],
                forVertically: [area.size.height, 0]
            }),
            0.1
        );

    let ub1 = d3.scale.ordinal()
        .domain(d3.range(seriesCount))
        .rangeRoundBands([0, ub0.rangeBand()]);

    let uAxis = d3.svg.axis()
        .scale(ub0)
        .tickSize(custom.axis.tick.size)
        .orient(ach.forPlaced(placed, {
            forHorizontally: 'bottom',
            forVertically: 'left'
        }));
    
    renderAxis(uAxis, undefined, area, placed, custom, ub0.rangeBand());

    return [ub0, ub1];
}
 