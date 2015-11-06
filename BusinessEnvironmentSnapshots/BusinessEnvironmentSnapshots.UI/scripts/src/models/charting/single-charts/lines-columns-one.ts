import * as ew from 'essentials/few';
import * as dsr from 'data/series';
import * as dch from 'data/chart';
import * as zcb from 'models/charting/chart-base';
import * as zu from 'models/charting/utils';
import * as visual from 'models/charting/basics/styles';


export class LinesAndColumnsChart extends zcb.SingleChartBase<dsr.SeriesType> {
    constructor(
        chartId: string,
        countryCode: string,
        title: string,
        description: string,
        sourceLink: string,
        sourceTitle: string,
        categories: ew.Few<string>,
        note: string,
        tableIndicatorColumn: string,
        tableUnitLabel: string,
        private lineSeries: ew.Few<dsr.Series<dsr.LineSeriesType>>,
        private columnSeries: ew.Few<dsr.Series<dsr.BlockSeriesType>>,
        valueSpace: dch.ValueSpace,
        valueSuffixOpt: string,
        valueAxisLabelOpt: string,
        areValuesInversed: boolean,
        custom: typeof visual
    ) {
        super(
            chartId,
            countryCode,
            title,
            description,
            sourceLink,
            sourceTitle,
            categories,
            note,
            tableIndicatorColumn,
            tableUnitLabel,
            ew.concat(
                ew.map(lineSeries, dsr.toOriginalSeries),
                ew.map(columnSeries, dsr.toOriginalSeries)
            ),
            valueSpace,
            dsr.toOriginalSeries,
            valueSuffixOpt,
            valueAxisLabelOpt,
            areValuesInversed,
            custom
        );
    }

    renderChart(element: HTMLElement): void {
        zu.renderLinesAndColumnsChart(
            element,
            this.valueSuffixOpt,
            this.categories,
            this.lineSeries,
            this.columnSeries,
            this.valueSpace,
            this.valueAxisLabelOpt,
            this.custom
        );
    }
}
