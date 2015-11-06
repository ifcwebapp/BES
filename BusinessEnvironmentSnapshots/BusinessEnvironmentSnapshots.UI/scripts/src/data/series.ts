import ec = require('essentials/core');
import ew = require('essentials/few');
import ea = require('essentials/array');

export interface Series<Type> {
    name: string;
    seriesType: Type;
    values: Reading[];
    serieCountryType: SerieCountryType;
}

export interface Reading {
    additionalLabel: string;
    value: number;
    valueString: string;
    error: number;
    suffix: string;
}


export const enum SeriesType { Line = 0,  Polar = 1, Column = 2, Bar = 3, Pie = 4, StackedBar = 5 }

export interface ViaSeriesType<r> {
    caseOfLine(): r;
    caseOfColumn(): r;
    caseOfPolar(): r;
    caseOfBar(): r;
    caseOfPie(): r
    caseOfStackedBar(): r;
}

export function viaSeriesType<r>(
    seriesType: SeriesType,
    via: ViaSeriesType<r>
) : r {
    switch (seriesType) {
        case SeriesType.Line       : return via.caseOfLine();
        case SeriesType.Polar      : return via.caseOfPolar();
        case SeriesType.Column     : return via.caseOfColumn();
        case SeriesType.Bar        : return via.caseOfBar();
        case SeriesType.Pie        : return via.caseOfPie();
        case SeriesType.StackedBar : return via.caseOfStackedBar();
        default                    : return ec.fail<r>('Unexpected case \'' + seriesType + '\' of a series type.');
    }
}

export const enum PortraitSeriesType { Line = 0 , Bar = 3 }
export const enum PolarSeriesType {}
export const enum PieSeriesType {}
export const enum LineSeriesType {}
export const enum StackedBlockSeriesType {}
export const enum BlockSeriesType {};
export interface ViaKnownType<r> {
    caseOfLines(
        lineSeries: ew.Few<Series<LineSeriesType>>
    ) : r;
    caseOfColumns(
        columnsSeries: ew.Few<Series<BlockSeriesType>>
    ) : r
    caseLinesAndColumns(
        lineSeries: ew.Few<Series<LineSeriesType>>,
        columnsSeries: ew.Few<Series<BlockSeriesType>>
    ) : r;
    caseOfBars(
        barSeries: ew.Few<Series<BlockSeriesType>>
    ) : r;
    caseOfLinesAndBars(
        lineSeries: ew.Few<Series<LineSeriesType>>,
        barSeries: ew.Few<Series<BlockSeriesType>>
    ) : r;
    caseOfPies(
        pieSeries: ew.Few<Series<PieSeriesType>>
    ) : r;
    caseOfPolars(
        polarSeries: ew.Few<Series<PolarSeriesType>>
    ) : r;
    caseOfStackedBars(
        stackedSeries: ew.Few<Series<StackedBlockSeriesType>>
    ) : r;
    caseOfInvalid(reason: string): r;
};

export function toOriginalSeries(
    series: Series<LineSeriesType|BlockSeriesType|PieSeriesType|PolarSeriesType|StackedBlockSeriesType|SeriesType>
) : Series<SeriesType> {
    return <any> series;
}

export function viaKnownType<r>(
    series: ew.Few<Series<SeriesType>>,
    via: ViaKnownType<r>
) : r {
    var dispersed = ea.fold<
        Series<SeriesType>, [
            Series<LineSeriesType>[],
            Series<PolarSeriesType>[],
            Series<BlockSeriesType>[],
            Series<BlockSeriesType>[],
            Series<PieSeriesType>[],
            Series<StackedBlockSeriesType>[]
        ]>(
            series,
            [[], [], [], [], [], []],
            (result, value) => viaSeriesType(
                value.seriesType, {
                    caseOfLine      () { result[0].push(<any> value); return result; },
                    caseOfPolar     () { result[1].push(<any> value); return result; },
                    caseOfColumn    () { result[2].push(<any> value); return result; },
                    caseOfBar       () { result[3].push(<any> value); return result; },
                    caseOfPie       () { result[4].push(<any> value); return result; },
                    caseOfStackedBar() { result[5].push(<any> value); return result; }
                }
            )
        );

    var polars  = dispersed[1];
    var lines   = dispersed[0];
    var columns = dispersed[2];
    var bars    = dispersed[3];
    var pies    = dispersed[4];
    var stacked = dispersed[5];

    
    return ew.withFew(
        polars,
        polars => ea.withNoneOf5(
            columns, lines, bars, pies, stacked,
            () => via.caseOfPolars(polars),
            toReason => via.caseOfInvalid('Unexpected mix with polar type series. ' + toReason(ec.always('column type series'), ec.always('line type series'), ec.always('bar type series'), ec.always('pie type series'), ec.always('stacked bar type series')))
        ),
        none => ew.withFew(
            pies,
            pies => ea.withNoneOf4(
                columns, lines, bars, stacked,
                () => via.caseOfPies(pies),
                toReason => via.caseOfInvalid('Unexpected mix with pie type series. ' + toReason(ec.always('column type series'), ec.always('line type series'), ec.always('bar type series'), ec.always('stacked bar type series')))
            ),
            none => ew.withFew(
                stacked,
                stacked => ea.withNoneOf3(
                    columns, lines, bars,
                    () => via.caseOfStackedBars(stacked),
                    toReason => via.caseOfInvalid('Unexpected mix with stacked bar type series. ' + toReason(ec.always('column type series'), ec.always('line type series'), ec.always('bar type series')))
                ),
                none => ew.withFew(
                    bars,
                    bars => ew.withFew(
                        lines,
                        lines => via.caseOfLinesAndBars(lines, bars),
                        none => ew.withFew(
                            columns,
                            columns => via.caseOfInvalid('Unable to mix bar and column type series.'),
                            none => via.caseOfBars(bars)
                        )
                    ),
                    none => ew.withFew(
                        lines, 
                        lines => ew.withFew(
                            columns,
                            columns => via.caseLinesAndColumns(lines, columns),
                            none => via.caseOfLines(lines)
                        ),
                        none => ew.withFew(
                            columns,
                            columns => via.caseOfColumns(columns),
                            none => via.caseOfInvalid('There are no series of known types.')
                        )
                    )
                )
            )
        )
    );
}


export const enum SerieCountryType {
    NotCountry = 0,
    Country    = 1,
    Comparator = 2,
    Region     = 3,
    World      = 4,
    DashedCountry = 5,
    DashedRegion = 6
}

export interface ViaSerieCountryType<r> {
    caseOfNotCountry(type: SerieCountryType): r;
    caseOfCountry   (type: SerieCountryType): r;
    caseOfComparator(type: SerieCountryType): r;
    caseOfRegion    (type: SerieCountryType): r;
    caseOfWorld     (type: SerieCountryType): r;
    caseOfDashedCountry(type: SerieCountryType): r;
    caseOfDashedRegion(type: SerieCountryType): r;
}

export function viaSerieCountryType<r>(
    type: SerieCountryType,
    via: ViaSerieCountryType<r>
) : r {
    switch (type) {
        case SerieCountryType.NotCountry    : return via.caseOfNotCountry(type);
        case SerieCountryType.Country       : return via.caseOfCountry   (type);
        case SerieCountryType.Comparator    : return via.caseOfComparator(type);
        case SerieCountryType.Region        : return via.caseOfRegion    (type);
        case SerieCountryType.World         : return via.caseOfWorld     (type);
        case SerieCountryType.DashedCountry : return via.caseOfDashedCountry(type);
        case SerieCountryType.DashedRegion  : return via.caseOfDashedRegion(type);
        default: return ec.fail<r>('Unexpected case \'' + type + '\' of a serie country type.');
    }
}

export function toReversedValuesSeries<a>(series: ew.Few<Series<a>>) : ew.Few<Series<a>> {
    return ew.map(series, serie => ec.id<Series<a>>({
        name: serie.name,
        serieCountryType: serie.serieCountryType,
        seriesType: serie.seriesType,
        values: ea.toReversed(serie.values)
    }));
}