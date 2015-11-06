import esch = require('essentials/scheduled');
import edt = require('essentials/dates');
import ew = require('essentials/few');
import ea = require('essentials/array');
import enu = require('essentials/numbers');
import em = require('essentials/maps');
import ec = require('essentials/core');
import csz = require('common/size');
import crn = require('common/range');
import d3 = require('d3');
import ca = require('common/accessors');
import dch = require('data/chart');
import dsr = require('data/series');
import mchb = require('models/charting/chart-base');
import mchu = require('models/charting/utils');
import visual = require('models/charting/basics/styles');
import mchvlb = require('models/charting/value-label-behavior');
import zba = require('models/charting/basics/area');

export class PieChart
    extends mchb.SingleChartBase<dsr.PieSeriesType>
{
    renderChart(element: HTMLElement): void {
        renderPieChart(element, this.valueSuffixOpt, this.categories, this.series, this.valueSpace, this.custom);
    }
}

export function renderPieChart(
    element: Element,
    valueSuffixOpt: string,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.PieSeriesType>>,
    valueSpace: dch.ValueSpace,
    custom: typeof visual
): void {
    zba.withArea(element, custom, true, (outer, inner, textHeight) => {

        var behaviorContext = mchu.toBehaviorContext(element);
        // http://bl.ocks.org/mbostock/3887235
        
        var radius = inner.size.height / 2 - textHeight;
        var color = d3.scale.ordinal().range(categories);

        var arc = d3.svg.arc()
            .outerRadius(radius)
            .innerRadius(radius * 0.5);

        var pie = d3.layout.pie()
            .sort(null)
            .value(point => point.value);

        dch.useSeries(
            series,
            (index, name, data) => {
                
                var arcsSelection = inner
                .svg.selectAll('g')
                .data(pie(mchu.toCategoryPoints(name, categories, data)))
                .enter().append('g');

                arcsSelection.append('path')
                .attr('d', arc)
                .attr('class', 'chart-arc')
                .stylePer((point, index) => custom.series.fit[categories.length][index].area.style);

                arcsSelection.append('text')
                .attr('transform', function(d) { return 'translate(' + arc.centroid(d) + ')'; })
                .attr('dy', '.35em')
                .style('text-anchor', 'middle')
                .text(function(point, index) { return mchu.formatNullableValue(point.data.value, point.data.suffix || valueSuffixOpt); });

                mchvlb.enableValueLabelBehavior(
                    arcsSelection,
                    behaviorContext,
                    valueSuffixOpt,
                    (point, valueSuffixOpt) => {
                        return mchu.formatCategoryPoint(point.data, valueSuffixOpt);
                    },
                    element => d3.select(element).select('text').node(),
                    element => d3.select(element).select('path').node()
                );
            }
        );

        

    });
}
