import dsr = require('data/series');
import dax = require('data/axes');
import Series = dsr.Series;
import Reading = dsr.Reading;

export interface SingleChart {
    title: string;
    description: string;
    note: string;
    sourceTitle: string;
    sourceLink: string;
    xaxis: {
        categories: string[];
        title: string;
    };
    yaxis: dax.ValueAxis;
    tooltip: {
        valueSuffix: string;
    };
    series: Series<dsr.SeriesType>[];
    areValuesInversed: boolean;
    tableIndicatorColumn: string;
    tableUnitLabel: string;
}
