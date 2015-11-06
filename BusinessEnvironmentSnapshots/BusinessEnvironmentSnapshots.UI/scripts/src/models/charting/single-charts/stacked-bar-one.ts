import en = require('essentials/numbers');
import ea = require('essentials/array');
import ew = require('essentials/few');
import ec = require('essentials/core');
import crn = require('common/range');
import ca = require('common/accessors');
import dch = require('data/chart');
import dsr = require('data/series');
import mchb = require('models/charting/chart-base');
import zu = require('models/charting/utils');
import mchvlb = require('models/charting/value-label-behavior');
import visual = require('models/charting/basics/styles');
import zba = require('models/charting/basics/area');

export class StackedBlockChart
    extends mchb.SingleOrientedChartBase<dsr.StackedBlockSeriesType>
{
    renderChart(element: HTMLElement): void {
        zba.withArea(element, this.custom, false, (outer, inner, textHeight) => {
            var shouldReverseCategories = zu.shouldReverseCategories(this.orientation);
            zu.renderStackedBarChart(
                element,
                this.valueSuffixOpt,
                shouldReverseCategories ? ew.toReversed(this.categories) : this.categories,
                shouldReverseCategories ? dsr.toReversedValuesSeries(this.series) : this.series,
                this.orientation,
                inner,
                this.valueAxisLabelOpt,
                this.custom
            );
        });
    }
}

