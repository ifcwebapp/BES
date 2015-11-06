import em = require('essentials/maps');
import ew = require('essentials/few');
import dsr = require('data/series');
import crn = require('common/range');
import dch = require('data/chart');
import mchu = require('models/charting/utils');
import uds = require('ui/dom/style');
import visual = require('models/charting/basics/styles');
import zac = require('models/charting/any-chart');
import ach = require('articles/chart');
export class ChartBase implements zac.AnyChart {
    constructor(
        public id: string,
        public countryCode: string,
        public title: string,
        public description: string,
        public sourceLink: string,
        public sourceTitle: string,
        public custom: typeof visual
    ) {
    }
}


export class SingleChartBase<a> extends ChartBase {
    constructor(
        id: string,
        countryCode: string,
        title: string,
        description: string,
        sourceLink: string,
        sourceTitle: string,
        public categories: ew.Few<string>,
        public note: string,
        public tableIndicatorColumn: string,
        public tableUnitLabel: string,
        public series: ew.Few<dsr.Series<a>>,
        public valueSpace: dch.ValueSpace,
        private toKnonwSeries: (series: dsr.Series<a>) => dsr.Series<dsr.SeriesType>,
        public valueSuffixOpt: string,
        public valueAxisLabelOpt: string,
        public areValuesInversed: boolean,
        custom: typeof visual
    ) {
        super(id, countryCode, title, description, sourceLink, sourceTitle, custom);
    }

    renderLegend(element: HTMLElement): void {
        ew.withFew(
            this.series,
            series => mchu.renderLegend(element, this.categories, ew.map(series, this.toKnonwSeries)),
            none => uds.displayNoneOn(element)
        );
    }
}

export class SingleOrientedChartBase<a> extends SingleChartBase<a> {
    constructor(
        id: string,
        countryCode: string,
        title: string,
        description: string,
        sourceLink: string,
        sourceTitle: string,
        categories: ew.Few<string>,
        note: string,
        tableIndicatorColumn: string,
        tableUnitLabel: string,
        series: ew.Few<dsr.Series<a>>,
        space: dch.ValueSpace,
        public orientation: ach.Orientation,
        toKnonwSeries: (series: dsr.Series<a>) => dsr.Series<dsr.SeriesType>,
        valueSuffixOpt: string,
        valueAxisLabelOpt: string,
        areValuesInversed: boolean,
        custom: typeof visual
    ) {
        super(
            id,
            countryCode,
            title,
            description,
            sourceLink,
            sourceTitle,
            categories,
            note,
            tableIndicatorColumn,
            tableUnitLabel,
            series,
            space,
            toKnonwSeries,
            valueSuffixOpt,
            valueAxisLabelOpt,
            areValuesInversed,
            custom
        );
    }
}
