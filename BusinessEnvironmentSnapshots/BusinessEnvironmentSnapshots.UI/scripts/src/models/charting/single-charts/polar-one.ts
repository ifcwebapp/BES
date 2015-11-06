import d3 = require('d3');
import ko = require('knockout');
import em = require('essentials/maps');
import en = require('essentials/numbers');
import ca = require('common/accessors');
import crn = require('common/range');
import ew = require('essentials/few');
import ec = require('essentials/core');
import ea = require('essentials/array');
import mchb = require('models/charting/chart-base');
import dch = require('data/chart');
import dsr = require('data/series');
import xkobte = require('extras/knockout/bindings/inject');
import mchu = require('models/charting/utils');
import visual = require('models/charting/basics/styles');
import mchvlb = require('models/charting/value-label-behavior');
import zba = require('models/charting/basics/area');
import * as mcbtw from 'models/charting/basics/text-wrapping';
xkobte.enableInjectBinding(ko.bindingHandlers);

export class PolarChart
    extends mchb.SingleChartBase<dsr.PolarSeriesType>
{
    renderChart(element: HTMLElement): void {
        renderPolarChart(element, this.valueSuffixOpt, this.categories, this.series, this.valueSpace, this.custom);
    }
}

export function renderPolarChart(
    element: Element,
    valueSuffixOpt: string,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.PolarSeriesType>>,
    valueSpace: dch.ValueSpace,
    custom: typeof visual
) : void {
    zba.withArea(element, custom, true, (outer, inner, textHeight) => {

        var behaviorContext = mchu.toBehaviorContext(element);

        var svg = inner.svg;
        
        var radius = inner.size.height / 2 - textHeight * 3;

        var count = categories.length;
        renderBackdrop(svg, radius);
        var labelsSelection = renderLabels(svg, categories, radius, textHeight, inner.size.width / 2 - radius);
        renderRadialAxes(svg, radius, count);

        var r = d3.scale.linear()
        .domain([0, valueSpace.range.to])
        .range([0, radius]);

        var line = d3.svg.line.radial()
        .defined(data => data.value != null)
        .radius(data => r(data.value))
        .angle(data => data.angle + Math.PI / 2);
            
        ew.use(
            series,
            (serie, serieIndex) => {

                var seriesContainer = svg
                .append('g')
                .attr('class', 'chart-series');
                    
                var points = ea.map(
                    close(serie.values),
                    (reading, index) => ({
                        series: serie.name,
                        category: categories[index],
                        error: reading.error,
                        additionalLabel: reading.additionalLabel,
                        value: reading.value,
                        valueString: reading.valueString,
                        angle: Math.PI * 2 * index / count,
                        suffix: reading.suffix
                    })
                );

                var valuesContainer = seriesContainer
                .append('path')
                .datum(points)
                .attr('class', 'chart-line')
                .attr('d', line)
                .attr(custom.series.fit[series.length][serieIndex].line.style);
    
                var pointsSelection = mchu.addPoints(
                    svg,
                    points,
                    point => r(point.value) * Math.cos(point.angle),
                    point => r(point.value) * Math.sin(point.angle),
                    mchu.isPointUndefined,
                    custom.series.fit[series.length][serieIndex]
                );
                mchvlb.enableValueLabelBehavior(
                    pointsSelection,
                    behaviorContext,
                    valueSuffixOpt,
                    mchu.formatCategoryPoint,
                    ec.id,
                    ec.id
                );
            }
        );

        
    });
}

function renderBackdrop(selection: D3.Selection, radius: number) : void {
    selection
        .append('circle')
        .attr('class', 'chart-backdrop')
        .attr('r', radius)
        .style(
            visual.charts.radial.backdrop.style
        );
}

function renderLabels(selection: D3.Selection, categories: string[], radius: number, textHeight: number, maxLength: number) : void {

    var count = categories.length;
    var textSelection = selection
    .append('g').attr('class', 'chart-categories')
    .selectAll('g.chart-category')
    .data(
        ea.map(
            categories,
            (category, index) => {
                var angle = Math.PI * 2 * index / count;
                return {
                    name: category,
                    angle: angle
                };
            }
        )
    )
    .enter()
    .append('text');
        
    textSelection
    .attr('class', 'chart-category')
    .attr('x', (data, index) => radius * Math.cos(data.angle)
        // AB: extra spacing between text and a circle
        + 3 * Math.cos(data.angle)
    )
    .attr('y', (data, index) => radius * Math.sin(data.angle)
        // AB: bottom text needs to be pushed further down up to as far as its own height, so it lays outside the circle
        + textHeight * (Math.sin(data.angle)/2 + 1/2)
            // AB: upper text has to be a tad higher
            - 2
    )
    .attr(
        'text-anchor',
        (data, index) => ec.apply(
            toAngle(index, count),
            at => 90 < at && at < 270 ? 'end' : null
        )
    )
    .attr(
        'max-length',
        (data, index) => ec.apply(
            toAngle(index, count),
            angle => maxLength + radius * (1 - Math.abs(Math.cos(en.toRadian(angle))))
        )
    )
    .attr(
        'vertical-text-anchor',
        (data, index) => ec.apply(
            toAngle(index, count),
            at => 360 - 15 <= at && at < 360 || 0 <= at && at < 15 || 180 - 15 <= at && at < 180 + 15
                ? 'middle'
                : 0 + 15 <= at && at < 180 - 15 
                    ? 'start'
                    : 'end'
        )
    )
    .text(data => data.name);

    textSelection.use(function (element: SVGTextElement) {
        mcbtw.wrapIfNeeded(element, 12 * 1.2);
    });

}

function toAngle(index:number, count: number) : number {
    return 360 * index /count;
}

function renderRadialAxes(selection: D3.Selection, radius: number, count: number) : void {
    selection
        .append('g').attr('class', 'chart-axis as-radial')
        .selectAll('g')
        .data(d3.range(0, 360, 360 / count))
        .enter().append('g')
        .attr('transform', angle => 'rotate(' + (- angle) + ')')
        .append('line')
        .style(visual.charts.radial.axis.style)
        .attr('x2', radius);
}

export function close<a>(values: a[]) : a[] {
    return ea.withHeadOrDefault(values, (first, rest) => ea.prepend(first, ea.append(rest, first)), values);
}