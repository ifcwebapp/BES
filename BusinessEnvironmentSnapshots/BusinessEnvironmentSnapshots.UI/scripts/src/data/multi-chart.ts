import ew = require('essentials/few');
import dsr = require('data/series');
import dax = require('data/axes');

export interface MultiChart {
    seriesGroups: SeriesGroup[];
    categories: string[];
    title: string;
    description: string;
    note: string;
    sourceLink: string;
    sourceTitle: string;
    areValuesInversed: boolean;
    tableIndicatorColumn: string;
    tableUnitLabel: string;
} 

export interface SeriesGroup {
    chartId: string;
    series: dsr.Series<dsr.SeriesType>[];
    yaxis: dax.ValueAxis;
    referenceLines: number[];
    areValuesInversed: boolean;
}

