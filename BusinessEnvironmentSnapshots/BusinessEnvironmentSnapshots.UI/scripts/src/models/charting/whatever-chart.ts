import esch = require('essentials/scheduled');
import edt = require('essentials/dates');
import ew = require('essentials/few');
import ea = require('essentials/array');
import enu = require('essentials/numbers');
import em = require('essentials/maps');
import ec = require('essentials/core');
import eo = require('essentials/optional');
import csz = require('common/size');
import crn = require('common/range');
import d3 = require('d3');
import ca = require('common/accessors');
import dch = require('data/chart');
import dsr = require('data/series');
import zu = require('models/charting/utils');
import zcb = require('models/charting/chart-base');
import zsck = require('models/charting/single-charts/block-one');
import zscp = require('models/charting/single-charts/pie-one');
import zscr = require('models/charting/single-charts/polar-one');
import zscl = require('models/charting/single-charts/line-one');
import zsclc = require('models/charting/single-charts/lines-columns-one');
import zscsb = require('models/charting/single-charts/stacked-bar-one');
import zvlb = require('models/charting/value-label-behavior');
import visual = require('models/charting/basics/styles');
import ach = require('articles/chart');

export type ChartBase = zcb.ChartBase;

export function toWhateverChart(
    chartId: string,
    countryCode: string,
    data: dch.SingleChart,
    series: ew.Few<dsr.Series<dsr.SeriesType>>,
    categories: ew.Few<string>,
    valueSpace: dch.ValueSpace,
    custom: typeof visual
) : eo.Optional<zcb.ChartBase> {
    return dsr.viaKnownType<eo.Optional<zcb.ChartBase>>(series, {
        caseLinesAndColumns(lineSeries, columnSeries) {
            return eo.fromSome(
                new zsclc.LinesAndColumnsChart(
                    chartId,
                    countryCode,
                    data.title,
                    data.description,
                    data.sourceLink,
                    data.sourceTitle,
                    categories,
                    data.note,
                    data.tableIndicatorColumn,
                    data.tableUnitLabel,
                    lineSeries,
                    columnSeries,
                    valueSpace,
                    data.yaxis.valueSuffix,
                    data.yaxis.title,
                    data.areValuesInversed,
                    custom
                )
            );
        },
        caseOfBars(series) {
            return eo.fromSome(
                new zsck.BlockChart(
                    chartId,
                    countryCode,
                    data.title,
                    data.description,
                    data.sourceLink,
                    data.sourceTitle,
                    categories,
                    data.note,
                    data.tableIndicatorColumn,
                    data.tableUnitLabel,
                    series,
                    valueSpace,
                    ach.Orientation.Portrait,
                    dsr.toOriginalSeries,
                    data.yaxis.valueSuffix,
                    data.yaxis.title,
                    data.areValuesInversed,
                    custom
                )
            );
        },
        caseOfColumns(series) {
            return eo.fromSome(
                new zsck.BlockChart(
                    chartId,
                    countryCode,
                    data.title,
                    data.description,
                    data.sourceLink,
                    data.sourceTitle,
                    categories,
                    data.note,
                    data.tableIndicatorColumn,
                    data.tableUnitLabel,
                    series,
                    valueSpace,
                    ach.Orientation.Landscape,
                    dsr.toOriginalSeries,
                    data.yaxis.valueSuffix,
                    data.yaxis.title,
                    data.areValuesInversed,
                    custom
                )
            );
        },
        caseOfLines(series) {
            return eo.fromSome(
                new zscl.LineChart(
                    chartId,
                    countryCode,
                    data.title,
                    data.description,
                    data.sourceLink,
                    data.sourceTitle,
                    categories,
                    data.note,
                    data.tableIndicatorColumn,
                    data.tableUnitLabel,
                    series,
                    valueSpace,
                    dsr.toOriginalSeries,
                    data.yaxis.valueSuffix,
                    data.yaxis.title,
                    data.areValuesInversed,
                    custom
                )
            );
        },
        caseOfLinesAndBars() {
            return eo.fromNoneOf<zcb.ChartBase>('Lines and bars charts are work in progress.');
        },
        caseOfPies(series) {
            return eo.fromSome(
                new zscp.PieChart(
                    chartId,
                    countryCode,
                    data.title,
                    data.description,
                    data.sourceLink,
                    data.sourceTitle,
                    categories,
                    data.note,
                    data.tableIndicatorColumn,
                    data.tableUnitLabel,
                    series,
                    valueSpace,
                    dsr.toOriginalSeries,
                    data.yaxis.valueSuffix,
                    data.yaxis.title,
                    data.areValuesInversed,
                    custom
                )
            );
        },
        caseOfPolars(series) {
            return eo.fromSome(
                new zscr.PolarChart(
                    chartId,
                    countryCode,
                    data.title,
                    data.description,
                    data.sourceLink,
                    data.sourceTitle,
                    categories,
                    data.note,
                    data.tableIndicatorColumn,
                    data.tableUnitLabel,
                    series,
                    valueSpace,
                    dsr.toOriginalSeries,
                    data.yaxis.valueSuffix,
                    data.yaxis.title,
                    data.areValuesInversed,
                    custom
                )
            );
        },
        caseOfStackedBars(series) {
            return eo.fromSome(
                new zscsb.StackedBlockChart(
                    chartId,
                    countryCode,
                    data.title,
                    data.description,
                    data.sourceLink,
                    data.sourceTitle,
                    categories,
                    data.note,
                    data.tableIndicatorColumn,
                    data.tableUnitLabel,
                    series,
                    valueSpace,
                    ach.Orientation.Portrait,
                    dsr.toOriginalSeries,
                    data.yaxis.valueSuffix,
                    data.yaxis.title,
                    data.areValuesInversed,
                    custom
                )
            );
        },
        caseOfInvalid(reason) {
            return eo.fromNoneOf<zcb.ChartBase>(reason);
        }
    });
}
