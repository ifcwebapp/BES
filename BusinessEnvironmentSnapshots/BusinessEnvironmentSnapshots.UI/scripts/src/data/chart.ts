
import ec = require('essentials/core');
import eo = require('essentials/optional');
import en = require('essentials/numbers');
import ew = require('essentials/few');
import ea = require('essentials/array');
import crn = require('common/range');

import dch = require('data/chart');
import dsch = require('data/single-chart');
import dmch = require('data/multi-chart');
import dsr = require('data/series');
import dax = require('data/axes');

export import SingleChart = dsch.SingleChart;
export import MultiChart = dmch.MultiChart;

export interface Chart {
    'a chart': Chart;
}

export interface ViaChart<r> {
    caseOfSingle(chart: SingleChart): r;
    caseOfMulti(chart: MultiChart): r;
}
export function viaChart<r>(chart: Chart, via: ViaChart<r>) : r {
    var key = ec.toKeyOrDie(chart, 'Unable to get a case of a chart.');
    switch (key) {
        case 'single': return via.caseOfSingle((<any> chart)['single']);
        case 'multi': return via.caseOfMulti((<any> chart)['multi']);
        default: return ec.fail<r>('Unexpected case \'' + key + '\' of a chart.');
    }
}



export function fold<a, r>(data: dsr.Series<a>[], result: r, fold: (result: r, value: number) => r) : r {
    return ea.fold(
        data,
        result,
        (result, series) => ea.fold(
            series.values,
            result,
            (result, point) => fold(result, point.value)
        )
    );
}

export function toRange(values: ew.Few<number>) : crn.Range<number> {
    return crn.rangeFrom(
        ew.toBest(values, en.isFirstLess),
        ew.toBest(values, en.isFirstGreater)
    );
}


export function useSeries<a>(
    series: ew.Few<dsr.Series<a>>,
    haveValues: (
        index: number,
        name: string,
        readings: ew.Few<dsr.Reading>,
        type: a
    ) => void
) : void {
    ew.use(
        series,
        (series, index) => ew.withFew(
            series.values,
            data => haveValues(
                index,
                series.name,
                data,
                series.seriesType
            ),
            ec.ignore
        )
    );
}

export interface NonEmptyDataForMulti {
    chartId: string;
    series: ew.Few<dsr.Series<dsr.SeriesType>>;
    valueSpace: dch.ValueSpace;
    yaxis: dax.ValueAxis;
    areValuesInversed: boolean;
    referenceLines: number[];
};

export function withNonEmptyDataForMulti<a, r>(
    categories: string[],
    groups: dmch.SeriesGroup[],
    haveFew: (
        categories: ew.Few<string>,
        groups: ew.Few<NonEmptyDataForMulti>
    ) => r,
    haveOtherwise: (reason: string) => r
) : r {
    return ew.withFew(
        categories,
        categories => ew.withFew(
            ea.choose(
                groups,
                group => ew.withFew(
                    group.series,
                    series => ew.withFew(
                        toValues(series),
                        values => eo.fromSome({
                            chartId: group.chartId,
                            referenceLines: group.referenceLines,
                            series: series,
                            areValuesInversed: group.areValuesInversed,
                            valueSpace: toValueSpace(
                                toRange(values),
                                group.yaxis.start,
                                group.yaxis.end
                            ),
                            yaxis: group.yaxis
                        }),
                        noValues => eo.noneFrom(noValues)
                    ),
                    noSeries => eo.noneFrom(noSeries)
                )
            ),
            groups => haveFew(categories, groups),
            none => haveOtherwise('No series groups. ' + none)
        ),
        none => haveOtherwise('No categories. ' + none)
    );
}

export function withNonEmptyDataForSingle<a, r>(
    categories: string[],
    series: dsr.Series<dsr.SeriesType>[],
    minValue: number,
    maxValue: number,
    haveFew: (
        categories: ew.Few<string>,
        series: ew.Few<dsr.Series<dsr.SeriesType>>,
        values: ew.Few<number>,
        valueSpace: ValueSpace,
        seriesCount: number
    ) => r,
    haveOtherwise: (reason: string) => r
) {
    return ew.withFew(
        categories,
        categories => ew.withFew(
            series,
            series => ew.withFew(
                toValues(series),
                values => haveFew(
                    categories,
                    series,
                    values,
                    toValueSpace(toRange(values), minValue, maxValue),
                    series.length
                ),
                none => haveOtherwise('No values in series.  ' + none)
            ),
            none => haveOtherwise('No series. ' + none)
        ),
        none => haveOtherwise('No categories. ' + none)
    );
}

export function toValues<a>(series: ew.Few<dsr.Series<a>>) : number[] {
    return ea.mapConcat(series, serie => ea.choose(serie.values, reading => eo.fromNullable(reading.value)));
}

export interface ValueSpace {
    range: crn.Range<number>;
}

export function toValueSpace(range: crn.Range<number>, min: number, max: number) : ValueSpace {
    var result = {
        range: crn.rangeFrom(
            en.minOf2(range.from, min),
            en.maxOf2(range.to, max)
        )
    };
    //console.log(range, min, max, zero);
    return result;
}


export interface CategoryPoint extends dsr.Reading {
    series: string;
    category: string;
}