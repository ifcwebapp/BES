import ea = require('essentials/array');
import ew = require('essentials/few');
import ec = require('essentials/core');
import crn = require('common/range');
import ca = require('common/accessors');
import dch = require('data/chart');
import dsr = require('data/series');
import zcb = require('models/charting/chart-base');
import zu = require('models/charting/utils');
import zvlb = require('models/charting/value-label-behavior');
import visual = require('models/charting/basics/styles');
import ach = require('articles/chart');
import zba = require('models/charting/basics/area');

export class BlockChart
    extends zcb.SingleOrientedChartBase<dsr.BlockSeriesType>
{
    renderChart(element: HTMLElement): void {
        renderBlockChart(
            element,
            this.valueSuffixOpt,
            this.categories,
            this.series,
            this.valueSpace,
            this.orientation,
            this.valueAxisLabelOpt,
            this.areValuesInversed,
            this.custom
        );
    }
}

export function renderBlockChart<a>(
    element: Element,
    valueSuffixOpt: string,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.BlockSeriesType>>,
    valueSpace: dch.ValueSpace,
    orientation: ach.Orientation,
    valueAxisLabelOpt: string,
    areValuesInversed: boolean,
    custom: typeof visual
): void {
    var shouldReverseCategories = zu.shouldReverseCategories(orientation);
    zba.withArea(element, custom, false, (outer, inner, textHeight) => {
        zu.renderBlockChart(
            element,
            valueSuffixOpt,
            orientation,
            shouldReverseCategories ? ew.toReversed(categories) : categories,
            shouldReverseCategories ? dsr.toReversedValuesSeries(series) : series,
            valueSpace,
            inner,
            valueAxisLabelOpt,
            areValuesInversed,
            custom
        );
    });
} 