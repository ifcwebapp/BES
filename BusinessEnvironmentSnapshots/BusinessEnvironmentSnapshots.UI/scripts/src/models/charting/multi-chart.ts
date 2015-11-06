import ec = require('essentials/core');
import ea = require('essentials/array');
import ew = require('essentials/few');
import dch = require('data/chart');
import dsr = require('data/series');
import mchu = require('models/charting/utils');
import mchb = require('models/charting/chart-base');
import zac = require('models/charting/any-chart');
import zba = require('models/charting/basics/area');
import visual = require('models/charting/basics/styles');
import ach = require('articles/chart');
import eo = require('essentials/optional');

export class MultiChart implements zac.AnyChart {
    
    constructor(
        public id: string,
        public countryCode: string,
        public title: string,
        public description: string,
        public sourceLink: string,
        public sourceTitle: string,
        public categories: ew.Few<string>,
        public note: string,
        public tableIndicatorColumn: string,
        public tableUnitLabel: string,
        public groups: ew.Few<dch.NonEmptyDataForMulti>,
        public toVisual: (chartId: string, series: dsr.Series<dsr.SeriesType>[], valueSuffix: string) => typeof visual
    ) {
    }

    renderChart(element: HTMLElement, seriesGroupIndex: number): void {
        var group = this.groups[seriesGroupIndex];
        var custom = this.toVisual(group.chartId, group.series, group.yaxis.valueSuffix);
        zba.withArea(
            element,
            custom,
            false,
            (outer, inner, textHeight) => {
                dsr.viaKnownType<void>(group.series, {
                    caseLinesAndColumns: ec.ignore,
                    caseOfBars: series => mchu.renderBlockChart(
                        element,
                        group.yaxis.valueSuffix,
                        ach.Orientation.Portrait,
                        this.categories,
                        series,
                        group.valueSpace,
                        inner,
                        group.yaxis.title,
                        group.areValuesInversed,
                        custom
                    ),
                    caseOfColumns: series => mchu.renderBlockChart(
                        element,
                        group.yaxis.valueSuffix,
                        ach.Orientation.Landscape,
                        this.categories,
                        series,
                        group.valueSpace,
                        inner,
                        group.yaxis.title,
                        group.areValuesInversed,
                        custom
                    ),
                    caseOfInvalid: ec.ignore,
                    caseOfLines: series => mchu.hackRenderLinePart(
                        element,
                        group.yaxis.valueSuffix,
                        this.categories,
                        series,
                        group.valueSpace,
                        inner,
                        group.yaxis.title,
                        group.referenceLines,
                        custom
                    ),
                    caseOfLinesAndBars: ec.ignore,
                    caseOfPies: ec.ignore,
                    caseOfPolars: ec.ignore,
                    caseOfStackedBars: ec.ignore
                });
            }
        );
        
    }

    renderLegend(element: HTMLElement): void {
        mchu.renderLegend(
            element,
            this.categories,
            ew.mapConcat(
                this.groups,
                group => group.series
            )
        );
    }
}
