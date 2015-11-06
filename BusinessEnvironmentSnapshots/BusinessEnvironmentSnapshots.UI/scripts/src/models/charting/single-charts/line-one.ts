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

export class LineChart
    extends mchb.SingleChartBase<dsr.LineSeriesType>
{
    renderChart(element: HTMLElement): void {
        renderLineChart(element, this.valueSuffixOpt, this.categories, this.series, this.valueSpace, this.valueAxisLabelOpt, this.custom);
    }
}

export function renderLineChart(
    element: Element,
    valueSuffixOpt: string,
    categories: ew.Few<string>,
    series: ew.Few<dsr.Series<dsr.LineSeriesType>>,
    valueSpace: dch.ValueSpace,
    valueAxisLabelOpt: string,
    custom: typeof visual
): void {
    zba.withArea(element, custom, false, (outer, inner, textHeight) => {
        mchu.renderLineChart(
            element,
            valueSuffixOpt,
            categories,
            series,
            valueSpace,
            inner,
            valueAxisLabelOpt,
            custom
        );
    });
}
