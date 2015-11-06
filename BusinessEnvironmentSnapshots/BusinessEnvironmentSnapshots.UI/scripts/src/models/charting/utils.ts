import ec = require('essentials/core');
import ea = require('essentials/array');
import em = require('essentials/maps');
import eo = require('essentials/optional');
import en = require('essentials/numbers');
import ew = require('essentials/few');
import dch = require('data/chart');
import dsr = require('data/series');
import esch = require('essentials/scheduled');
import crn = require('common/range');
import ca = require('common/accessors');
import csz = require('common/size');
import csd = require('common/sides');
import visual = require('models/charting/basics/styles');
import zbx = require('models/charting/basics/axes');
import zba = require('models/charting/basics/area');
import zvlb = require('models/charting/value-label-behavior');
import ach = require('articles/chart');

export function shouldReverseCategories(orientation: ach.Orientation) : boolean {
    return ach.viaPlaced(
        ach.toCategorialPlacement(orientation), {
            caseOfHorizontally: ec.alwaysFalse,
            caseOfVertically: ec.alwaysTrue
        }
    );
}

export function addSeriesAsLine<a>(
    svg: D3.Selection,
    custom: CustomLine,
    points: a[],
    toSvgPath: (points: a[]) => string
) : D3.Selection {
    return svg
    .append('g').append('path')
    .attr('class', 'chart-line')
    .attr('d', toSvgPath(points))
    .attr(custom.line.style);
}

export function isPointUndefined<a extends { value: number; }>(point: a) : boolean {
    return point.value == null;
}

export function addPoints<a>(
    svg: D3.Selection,
    points: a[],
    toX: (point: a, index: number) => number,
    toY: (point: a, index: number) => number,
    isUndefined: (point: a) => boolean,
    custom: { shape: { toPath: typeof visual.noSymbol; style: { fill: string; } } }
) : D3.TypedSelection<a> {
    return svg
    .append('g').selectAll('path')
    .data(points)
    .enter().append('path')
    .attr('class', 'chart-point')
    .classed('as-hidden', isUndefined)
    .attr('transform', function(d, index) { return 'translate(' + toX(d, index) + ',' + toY(d, index) + ')'; })
    .attr('d', custom.shape.toPath())
    .attr(<any>custom.shape.style)
}



export function toCategorialScale(
    categories: string[],
    area: zba.Area,
    placed: ach.Placed,
    kind: ach.CategoryAxisKind
) : D3.Scale.OrdinalScale {
    var u = d3.scale.ordinal().domain(categories);

    ach.viaCategoryAxisKind(kind, {
        caseOfBands() {
            u.rangeRoundBands(ach.forPlaced(placed, {
                forHorizontally: [0, area.size.width],
                forVertically: [area.size.height, 0]
            }), 0.1)
        },
        caseOfPoints() {
            u.rangePoints(ach.forPlaced(placed, {
                forHorizontally: [0, area.size.width],
                forVertically: [area.size.height, 0]
            }))
        }
    });
    return u;
}

export function toContainerElement(element: Element) : HTMLElement {
    return <HTMLElement> element.parentNode.parentNode.parentNode.parentNode.parentNode;
}

export function toBehaviorContext(element: Element) : zvlb.ValueLabelBehaviorContext {
    return zvlb.toValueLabelBehaviorContext(
        toContainerElement(element)
    );
}

export function toCategoryPoint(
    seriesName: string,
    category: string,
    reading: dsr.Reading
) : dch.CategoryPoint {
    return {
        series: seriesName,
        additionalLabel: reading.additionalLabel,
        category: category,
        suffix: reading.suffix,
        error: reading.error,
        value: reading.value,
        valueString: reading.valueString
    };
}

export function toCategoryPoints(
    seriesName: string,
    categories: ew.Few<string>,
    data: ew.Few<dsr.Reading>
) : ew.Few<dch.CategoryPoint> {
    return ew.fuseOrDie(
        categories,
        data,
        (category, reading) => toCategoryPoint(seriesName, category, reading),
        'Unable to fuse dates with values.'
    )
}

export function addXYLine(
    index: number,
    svg: D3.Selection,
    points: ew.Few<dch.CategoryPoint>,
    line: D3.Svg.Line<dch.CategoryPoint>,
    toCustom: (index: number) => typeof visual.series.country
) : D3.TypedSelection<dch.CategoryPoint> {
    addSeriesAsLine(
        svg,
        toCustom(index),
        points,
        line
    );
    var pointsSelection = addPoints(
        svg,
        points,
        line.x(),
        line.y(),
        isPointUndefined,
        toCustom(index)
    );
    return pointsSelection;
}


export function renderBlockChart(
    element: Element,
    valueSuffixOpt: string,
    orientation: ach.Orientation,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.BlockSeriesType>>,
    valueSpace: dch.ValueSpace,
    area: zba.Area,
    valueAxisLabalOpt: string,
    areValuesInversed: boolean,
    custom: typeof visual
) : void {
    var behaviorContext = toBehaviorContext(element);
    var placement = ach.toPlacement(orientation);
    
    var u = zbx.addGrouppedCategoryAxis(
        categories,
        series.length,
        area, placement.categorial,
        { margin: custom.margin, axis: custom.axis.categorial }
    );

    var valueRange = areValuesInversed
        ? crn.invert(toRangeForBlocks(valueSpace))
        : toRangeForBlocks(valueSpace);

    var v = zbx.addValueAxis(
        valueRange,
        area,
        value => formatValue(value, valueSuffixOpt),
        placement.valueable,
        valueAxisLabalOpt,
        { margin: custom.margin, axis: custom.axis.valueable }
    );
    
        
    var blocksSelection = addBlocks(
        v, u,
        categories,
        series,
        area,
        placement,
        custom
    );

     zvlb.enableValueLabelBehavior(
        blocksSelection,
        behaviorContext,
        valueSuffixOpt,
        formatCategoryPoint,
        ec.id,
        ec.id
    );
}



export function toRangeForBlocks(valueSpace: dch.ValueSpace): crn.Range<number> {
    var range = valueSpace.range;
    return crn.rangeFrom(range.from, range.to);
}

export interface StackedCategoryPoint extends dch.CategoryPoint {
    from: number;
    to: number;
}

export function toStackedCategoryPoint(
    seriesName: string,
    category: string,
    reading: dsr.Reading,
    from: number,
    to: number
) : StackedCategoryPoint {
    return {
        additionalLabel: reading.additionalLabel,
        error: reading.error,
        value: reading.value,
        valueString: reading.valueString,
        suffix: reading.suffix,
        series: seriesName,
        category: category,
        from: from,
        to: to
    };
}

export function renderStackedBarChart(
    element: Element,
    valueSuffixOpt: string,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.StackedBlockSeriesType>>,
    orientation: ach.Orientation,
    area: zba.Area,
    valueAxisLabalOpt: string,
    custom: typeof visual    
): void {
    
    var behaviorContext = toBehaviorContext(element);
    var points = ew.map(categories, (category, categoryIndex) => ew.fold(
        series,
        serie => {
            var reading = serie.values[categoryIndex];
            return {
                last: reading.value || 0,
                values: ew.fromOne(
                    toStackedCategoryPoint(
                        serie.name,
                        category,
                        reading,
                        0,
                        reading.value || 0
                    )
                )
            };
        },
        (result, serie) => {
            var last = result.last;
            var reading = serie.values[categoryIndex];
            var current = last + reading.value || 0;
            result.values.push(
                toStackedCategoryPoint(
                    serie.name,
                    category,
                    reading,
                    last,
                    current
                )
            );
            result.last = current;
            return result
        }
    ).values);

    var max = ew.toBestMapped(points, slices => ew.toBestMapped(slices, ca.toOf, en.isFirstGreater), en.isFirstGreater);
    var placement = ach.toPlacement(orientation);
    var u = toCategorialScale(
        categories,
        area,
        placement.categorial,
        ach.CategoryAxisKind.Bands
    );
    zbx.renderCategorialAxis(
        u, area,
        placement.categorial,
        { margin: custom.margin, axis: custom.axis.categorial }
    );
    var v = zbx.addValueAxis(
        crn.rangeFrom(0, max),
        area,
        value => formatValue(value, valueSuffixOpt),
        placement.valueable,
        valueAxisLabalOpt,
        { margin: custom.margin, axis: custom.axis.valueable }
    );

    var stack = area.svg.selectAll('.chart-stack')
        .data(categories)
        .enter().append('g')
        .attr('class', 'chart-stack')
        .attr('transform', category => ach.forPlaced(placement.categorial, {
            forHorizontally: 'translate(' + u(category) + ', 0)',
            forVertically: 'translate(0, ' + u(category) + ')'
        }));

    var blocksSelection = stack.selectAll('rect.chart-bar')
        .data((category, index) => ea.filter(
            points[index],
            point => point.value != null
        ))
        .enter().append('rect')
        .attr('class', 'chart-bar')
        .attr('x', point => ach.forPlaced(placement.categorial, { forHorizontally: 0,           forVertically: v(point.from) }))
        .attr('y', point => ach.forPlaced(placement.categorial, { forHorizontally: v(point.to), forVertically: 0 }))
        .attr('width', point => ach.forPlaced(placement.categorial, { forHorizontally: u.rangeBand(), forVertically: v(point.to) - v(point.from) }))
        .attr('height', point => ach.forPlaced(placement.categorial, { forHorizontally: v(point.from) - v(point.to), forVertically: u.rangeBand() }))
        .style('fill', (point, index) => custom.series.fit[series.length][index].area.style.fill);

    zvlb.enableValueLabelBehavior(
        blocksSelection,
        behaviorContext,
        valueSuffixOpt,
        formatCategoryPoint,
        ec.id,
        ec.id
    );
}  



export function formatNullableValue(valueOpt: number, suffixOpt: string) : string {
    return valueOpt != null ? formatValue(valueOpt, suffixOpt) : undefined;
}

export function formatNullableValueString(valueStringOpt: string, suffixOpt: string): string {
    return valueStringOpt != null ? formatValueString(valueStringOpt, suffixOpt) : undefined;
}

var formatNumber = d3.format(',');
var formatPercent = d3.format(',%');
export function formatValue(value: number, suffixOpt: string) : string {
    return suffixOpt != null
        ? suffixOpt === '%'
            ? formatPercent(value / 100)
            : formatNumber(value) + suffixOpt
        : formatNumber(value);
}

export function formatValueString(valueString: string, suffixOpt: string): string {
    return suffixOpt != null
        ? valueString + suffixOpt
        : valueString;
}

export function formatCategoryPoint(
    point: dch.CategoryPoint,
    valueSuffixOpt: string
) : string {
    return point.series
        + ': ' + formatValueString(point.valueString, point.suffix || valueSuffixOpt) + (point.error ? ' (+/- ' + point.error + ')' : '')
        + ' in ' + point.category + (point.additionalLabel ? ' (' + point.additionalLabel + ')' : '');

}


export function addBlocks(
    v: D3.Scale.LinearScale,
    u: [D3.Scale.OrdinalScale, D3.Scale.OrdinalScale],
    categories: string[],
    series: ew.Few<dsr.Series<dsr.BlockSeriesType>>,
    area: zba.Area,
    placement: ach.Placement,
    custom: typeof visual
) : D3.TypedSelection<dch.CategoryPoint> {
    
    var domain : [number, number] = <any> v.domain();
    var zero = domain[1] > domain[0]
        ? domain[0] < 0 ? domain[0] : 0
        : domain[0];

    var group = area.svg.selectAll('.chart-group')
    .data(categories)
    .enter().append('g')
    .attr('class', 'chart-group')
    .attr('transform', category => ach.forPlaced(placement.categorial, {
        forHorizontally: 'translate(' + u[0](category) + ', 0)',
        forVertically: 'translate(0, ' + u[0](category) + ')'
    }));
                    
    var blocksSelection = group
    .append('g')
    .selectAll('rect.chart-bar')
    .data((category, categoryIndex) => ew.map(
        series,
        serie => toCategoryPoint(
            serie.name,
            category,
            serie.values[categoryIndex]
        )
    ))
    .enter().append('rect')
    .attr('class', 'chart-bar')
    .classed('as-hidden', point => point.value == null)

    ach.viaPlaced(placement.categorial, {
        caseOfHorizontally() {
            blocksSelection
            .attr('x', (data, index) => u[1](index))
            .attr('width', data      => u[1].rangeBand())
            .attr('y', (data, index) => data.value > zero ? v(data.value) : v(zero))
            .attr('height', data     => area.size.height - v(data.value))
        },
        caseOfVertically() {
            blocksSelection
            .attr('y'     , (data, index) => u[1](index))
            .attr('height', data          => u[1].rangeBand())
            .attr('x'     , data => {
                var d = v(data.value);
                var z = v(zero);
                return d < z ? d : z;
            })
            .attr('width' , data => {
                var z = v(zero);
                var d = v(data.value);
                return d < z ? z - d : d - z;
            })
        }
    });
    blocksSelection.attr('fill', (data, index) => custom.series.fit[series.length][index].area.style.fill)
    return blocksSelection;
}

export function renderLegend(
    element: HTMLElement,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.SeriesType>>
) : void {
    var size = csz.sizeFrom(50, 20);

    dsr.viaKnownType<void>(series, {
        caseLinesAndColumns: (lineSeries, blockSeries) => {
            addLineLegend(
                d3.select(element).append('div').attr('class', 'chart-legend-serie-group').node(),
                lineSeries,
                size,
                (_, index) => String(index),
                toLineStyles(lineSeries, visual)
            );
            addBlockLegend(
                d3.select(element).append('div').attr('class', 'chart-legend-serie-group').node(),
                blockSeries,
                size,
                (_, index) => String(index),
                ca.nameOf,
                visual.series.fit[blockSeries.length]
            );
        },
        caseOfBars: series => addBlockLegend(element, series, size, ca.nameOf, ca.nameOf, visual.series.fit[series.length]),
        caseOfColumns: series => addBlockLegend(element, series, size, ca.nameOf, ca.nameOf, visual.series.fit[series.length]),
        caseOfInvalid: ec.alwaysFailOf<void>(),
        caseOfLines: series => addLineLegend(element, series, size, ca.nameOf, toLineStyles(series, visual)),
        caseOfLinesAndBars: (lineSeries, blockSeries) => {
            addLineLegend(
                d3.select(element).append('div').attr('class', 'chart-legend-serie-group').node(),
                lineSeries,
                size,
                (_, index) => String(index),
                toLineStyles(lineSeries, visual)
            );
            addBlockLegend(
                d3.select(element).append('div').attr('class', 'chart-legend-serie-group').node(),
                blockSeries,
                size,
                (_, index) => String(index),
                ca.nameOf,
                visual.series.fit[blockSeries.length]
            );
        },
        caseOfPies: series => addBlockLegend(
            element,
            categories,
            size,
            (category, index) => String(index),
            ec.first,
            visual.series.fit[categories.length]
        ),
        caseOfPolars: series => addLineLegend(element, series, size, ca.nameOf, visual.series.fit[series.length]),
        caseOfStackedBars: series => addBlockLegend(element, series, size, ca.nameOf, ca.nameOf, visual.series.fit[series.length])
    });

}
type CustomBlock = { area: { style: Object; }; };
type CustomLine = { line: { style: Object; }; };
type CustomShapedLine = {
    line: {
        style: Object;
    };
    shape: {
        shouldShowInLegend: boolean;
        toPath: () => (data: any, index: number) => string;
        style: Object;
    };
};

function addLineLegend<a> (
    element:  Element,
    series: ew.Few<dsr.Series<a>>,
    size: csz.Size,
    toKey: (serie: dsr.Series<a>, index: number) => string,
    customs: CustomShapedLine[]
) : void {
    var containerSelection = addSerieLegendContainers(
        element,
        series,
        toKey
    );
    addLineSerieLegendCluses(containerSelection, size, index => customs[index]);
    addSerieLegendTexts(containerSelection, ca.nameOf);
}

function addBlockLegend<a>(
    element:  Element,
    series: ew.Few<a>,
    size: csz.Size,
    toKey: (value: a, index: number) => string,
    toText: (value: a, index: number) => string,
    customs: CustomBlock[]
) : void {
    var selection = addSerieLegendContainers(
        element,
        series,
        toKey
    );
    addBlockSerieLegedClues(selection, size, index => customs[index]);
    addSerieLegendTexts(selection, toText);
}

function addBlockSerieLegedClues<a>(
    containerSelection: D3.TypedSelection<a>,
    size: csz.Size,
    toCustom: (index: number) => CustomBlock
) {
    var halfWidth = size.width / 2;
    var clueSelection = containerSelection
        .append('div') // <-- AB: required for saving images from IE, we use this container's innerHTML instead of missing outerHTML of svg in IE
        .attr('class', 'chart-legend-serie-clue')
        .append('svg')
        .attr('width', size.width)
        .attr('height', size.height)
        .append('g')
        .attr('transform', 'translate(' + (halfWidth) + ',' + (size.height / 2) + ')');

    clueSelection.append('rect')
    .attr('x', -7)
    .attr('y', -7)
    .attr('width', 14)
    .attr('height', 14)
    .stylePer((_, index) => toCustom(index).area.style);
}

function addSerieLegendTexts<a>(
    containerSelection: D3.TypedSelection<a>,
    toText: (value: a, index: number) => string
) : void {
    containerSelection
    .append('div')
    .attr('class', 'chart-legend-serie-text')
    .text(toText);
}

function addLineSerieLegendCluses<a>(
    containerSelection: D3.TypedSelection<dsr.Series<a>>,
    size: csz.Size,
    toCustom: (index: number) => CustomShapedLine
) : void {
    var halfWidth = size.width / 2;
    var clueSelection = containerSelection
        .append('div')  // <-- AB: required for saving images from IE, we use this container's innerHTML instead of missing outerHTML of svg in IE
        .attr('class', 'chart-legend-serie-clue')
        .append('svg')
        .attr('width', size.width)
        .attr('height', size.height)
        .append('g')
        .attr('transform', 'translate(' + (halfWidth) + ',' + (size.height / 2) + ')');
    
    var lineSpan = halfWidth - 3;
    clueSelection
    .append('line')
    .attr('x1', -lineSpan)
    .attr('x2', lineSpan)
    .attr('y1', 0).attr('y2', 0)
    .stylePer((_, index) => toCustom(index).line.style);

    clueSelection
    .append('path')
    .attr('d', (data, index) => toCustom(index).shape.toPath()(data, index))
    .attr('transform', 'scale(1.5, 1.5)')
    .style('visibility', (data, index) => toCustom(index).shape.shouldShowInLegend ? 'visible' : 'hidden')
    .stylePer((_, index) => toCustom(index).shape.style);
}

function addSerieLegendContainers<a>(
    element: Element,
    series: ew.Few<a>,
    toKey: (value: a, index: number) => string
) : D3.TypedSelection<a> {
    
    d3
    .select(element)
    .selectAll('.chart-legend-serie')
    .data(series, toKey)
    .enter().append('div')
    .attr('class', 'chart-legend-serie');

    return <any>d3.select(element).selectAll('.chart-legend-serie');
}

export function renderLineChart(
    element: Element,
    valueSuffixOpt: string,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.LineSeriesType>>,
    valueSpace: dch.ValueSpace,
    area: zba.Area,
    valueAxisLabalOpt: string,
    custom: typeof visual
) : void {
    var behaviorContext = toBehaviorContext(element);
        // https://github.com/mbostock/d3/wiki/SVG-Shapes
        // https://github.com/mbostock/d3/wiki/SVG-Axes
                
    var v = zbx.addValueAxis(
        valueSpace.range,
        area,
        value => formatValue(value, valueSuffixOpt),
        ach.Placed.Vertically,
        valueAxisLabalOpt,
        { margin: custom.margin, axis: custom.axis.valueable }
    );

    var u = toCategorialScale(
        categories,
        area,
        ach.Placed.Horizontally,
        ach.CategoryAxisKind.Points
    ); 

    zbx.renderCategorialAxis(
        u, area,
        ach.Placed.Horizontally,
        { margin: custom.margin, axis: custom.axis.categorial }
    );

    var line = d3.svg.line<dch.CategoryPoint>()
        .interpolate('linear')
        .defined(point => point.value != null)
        .x(point => u(point.category))
        .y(point => v(point.value));

    renderLineSeries(
        categories,
        valueSuffixOpt,
        series,
        line,
        area,
        behaviorContext,
        noReferenceLine,
        custom
    );
}

var noReferenceLine : number[] = [];


export function renderLinesAndColumnsChart(
    element: Element,
    valueSuffixOpt: string,
    categories: ew.Few<string>,
    lineSeries: ew.Few<dsr.Series<dsr.LineSeriesType>>,
    columnSeries: ew.Few<dsr.Series<dsr.BlockSeriesType>>,
    valueSpace: dch.ValueSpace,
    valueAxisLabalOpt: string,
    custom: typeof visual
): void {
    zba.withArea(element, custom, false, (outer, inner, textHeight) => {

        var behaviorContext = toBehaviorContext(element);
        var orientation = ach.Orientation.Landscape;
        var placement = ach.toPlacement(orientation);
        var u = zbx.addGrouppedCategoryAxis(categories, columnSeries.length, inner, placement.categorial, { margin: custom.margin, axis: custom.axis.categorial });
        var v = zbx.addValueAxis(
            valueSpace.range,
            inner,
            value => formatValue(value, valueSuffixOpt),
            placement.valueable,
            valueAxisLabalOpt,
            {
                margin: custom.margin,
                axis: custom.axis.valueable
            }
        );

        var lineU = (category: string) : number => u[0](category) + u[0].rangeBand() / 2;
        var line = d3.svg.line<dch.CategoryPoint>()
            .interpolate('linear')
            .x(point => lineU(point.category))
            .y(point => v(point.value));

        dch.useSeries(
            columnSeries,
            (index, name, data, type) => {
                var blocksSelection = addBlocks(
                    v, u,
                    categories,
                    columnSeries,
                    inner,
                    placement,
                    custom
                );
                zvlb.enableValueLabelBehavior(
                    blocksSelection,
                    behaviorContext,
                    valueSuffixOpt,
                    formatCategoryPoint,
                    ec.id, ec.id
                );
            }
        );

        var customs = toLineStyles(lineSeries, custom);
        dch.useSeries(
            lineSeries,
            (index, name, data, type) => {
                var pointsSelection = addXYLine(
                    index,
                    inner.svg,
                    toCategoryPoints(name, categories, data),
                    line,
                    index => customs[index]
                );
                zvlb.enableValueLabelBehavior(
                    pointsSelection,
                    behaviorContext,
                    valueSuffixOpt,
                    formatCategoryPoint,
                    ec.id, ec.id
                );
            }
        );
    });
}

export function hackRenderLinePart(
    element: Element,
    valueSuffixOpt: string,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.LineSeriesType>>,
    valueSpace: dch.ValueSpace,
    area: zba.Area,
    valueAxisLabalOpt: string,
    referenceLines: number[],
    custom: typeof visual
) : void {

    var behaviorContext = toBehaviorContext(element);

    var v = zbx.addValueAxis(
        valueSpace.range,
        area,
        value => formatValue(value, valueSuffixOpt),
        ach.Placed.Vertically,
        valueAxisLabalOpt,
        { axis: custom.axis.valueable, margin: custom.margin }
    );

    var u = toCategorialScale(
        categories,
        area,
        ach.Placed.Horizontally,
        ach.CategoryAxisKind.Bands
    );

    var line = d3.svg.line<dch.CategoryPoint>()
        .interpolate('linear')
        .x(point => u(point.category) + u.rangeBand() / 2)
        .y(point => v(point.value));

    renderLineSeries(
        categories,
        valueSuffixOpt,
        series,
        line,
        area,
        behaviorContext,
        referenceLines,
        custom
    );
}

export function toLineStyles(series: ew.Few<dsr.Series<dsr.LineSeriesType>>, custom: typeof visual) {
    var first = {
        customs: [custom.series.comparators[0]],
        comparatorCount: 1
    };
    return ew.fold(
        series,
        serie => dsr.viaSerieCountryType(serie.serieCountryType, ec.apply(ec.always(first), toFirstComparator => ({
                caseOfNotCountry: toFirstComparator,
                caseOfCountry   : () => <typeof first> {
                    customs: [custom.series.country],
                    comparatorCount: 0
                },
                caseOfComparator: toFirstComparator,
                caseOfRegion    : () => <typeof first> {
                    customs: [custom.series.region],
                    comparatorCount: 0
                },
                caseOfWorld     : toFirstComparator,
                caseOfDashedCountry: () => <typeof first> {
                    customs: [custom.series.dashed.country],
                    comparatorCount: 0
                },
                caseOfDashedRegion: () => <typeof first> {
                    customs: [custom.series.dashed.region],
                    comparatorCount: 0
                }
            })
        )),
        (result, serie) => dsr.viaSerieCountryType(
            serie.serieCountryType,
            ec.apply(
                () => {
                    result.customs.push(custom.series.comparators[result.comparatorCount ++]);
                    return result;
                },
                addComparator => ({
                    caseOfNotCountry: addComparator,
                    caseOfCountry: () => {
                        result.customs.push(custom.series.country);
                        return result;
                    },
                    caseOfDashedCountry: () => {
                        result.customs.push(custom.series.dashed.country);
                        return result;
                    },
                    caseOfComparator: addComparator,
                    caseOfRegion: () => {
                        result.customs.push(custom.series.region);
                        return result;
                    },
                    caseOfDashedRegion: () => {
                        result.customs.push(custom.series.dashed.region);
                        return result;
                    },
                    caseOfWorld: addComparator
                })
            )
        )
    ).customs;
}

export function renderLineSeries(
    categories: ew.Few<string>,
    valueSuffixOpt: string,
    series: ew.Few<dsr.Series<dsr.LineSeriesType>>,
    line: D3.Svg.Line<dch.CategoryPoint>,
    area: zba.Area,
    behaviorContext: zvlb.ValueLabelBehaviorContext,
    referenceLines: number[],
    custom: typeof visual
) : void {

    ea.use(referenceLines, referenceLine => {
        let refLineSelection = area.svg.append('g').attr('class', 'chart-reference-line');
        refLineSelection.attr('transform', 'translate(0, ' + line.y()(<dch.CategoryPoint> { value: referenceLine }) + ')');
        refLineSelection.append('line').attr('x1', 0).attr('x2', area.size.width).style(custom.referenceLine.styles);
    });

    var customs = toLineStyles(series, custom);
    dch.useSeries(
        series,
        (index, name, data) => {
            var pointsSelection = addXYLine(
                index,
                area.svg,
                toCategoryPoints(name, categories, data),
                line,
                index => customs[index]
            );
            zvlb.enableValueLabelBehavior(
                pointsSelection,
                behaviorContext,
                valueSuffixOpt,
                formatCategoryPoint,
                ec.id, ec.id
            );
        }
    );
}


export var phonies = {
    categoryPoint: <dch.CategoryPoint> undefined
};