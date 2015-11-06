import er = require('essentials/runtime');
import eo = require('essentials/optional');
import ew = require('essentials/few');
import drp = require('data/repository');
import dch = require('data/chart');
import dsr = require('data/series');
import ko = require('knockout');
import ef = require('essentials/futures');
import ec = require('essentials/core');
import dr = require('data/requested');
import dchi = require('data/chart-id');
import pu = require('parts/uncertain');
import mchc = require('models/charting/coming-chart');
import mchu = require('models/charting/unfinished-chart');
import mchm = require('models/charting/multi-chart');
import mchac = require('models/charting/any-chart');
import mchw = require('models/charting/whatever-chart');
import xkobv = require('extras/knockout/bindings/variant');
import mchz = require('models/charting/customizations');
import visual = require('models/charting/basics/styles');

xkobv.enableVariantBinding(ko.bindingHandlers);

export interface Chart {
    'a chart': Chart;
}

export type UncertainChart = pu.Uncertain<mchc.ComingChart, Chart>;
export type HeldRelaxedChart = KnockoutObservable<UncertainChart>;

export function fromSingleChart(chart: mchw.ChartBase) : Chart {
    return <any> {
        'single-chart': chart
    };
}

export function fromMultiChart(chart: mchm.MultiChart): Chart {
    return <any> {
        'multi-chart': chart
    };
}

export function fromUndevelopedChart(chart: mchu.UnfinishedChart) : Chart {
    return <any> {
        'undeveloped-chart': chart
    };
}

export interface ViaChart<r> {
    caseOfSingle(chart: mchw.ChartBase): r;
    caseOfMulti(chart: mchm.MultiChart): r;
    caseOfUndeveloped(chart: mchu.UnfinishedChart): r;
}
export function viaChart<r>(chart: Chart,  via: ViaChart<r>) : r {
    var key = ec.toKeyOrDie(chart, 'Unable to get the tag of a chart.');
    switch(key)  {
        case 'single-chart': return via.caseOfSingle((<any> chart)['single-chart']);
        case 'multi-chart': return via.caseOfMulti((<any> chart)['multi-chart']);
        case 'undeveloped-chart': return via.caseOfUndeveloped((<any> chart)['undeveloped-chart']);
        default: return ec.fail<r>('Unexpected case \'' + key + '\' of a chart.');
    }
}

export function asAnyChart(chart: Chart) : mchac.AnyChart {
    return viaChart<mchac.AnyChart>(chart, {
        caseOfSingle: ec.id,
        caseOfMulti: ec.id,
        caseOfUndeveloped: ec.id
    });
}

export function toRelaxedChart(
    chartId: string
) : HeldRelaxedChart  {
    return ko.observable(
        pu.fromComing<mchc.ComingChart, Chart>(
            mchc.unloadedChartFrom(chartId)
        )
    );
}

export function toUncertainChart(
    chartId: string,
    countryCode: string,
    data: dch.Chart
) : pu.Uncertain<mchc.ComingChart, Chart> {
    return dch.viaChart(data, {
        caseOfSingle: data => dch.withNonEmptyDataForSingle(
            data.xaxis.categories,
            data.series,
            data.yaxis.start,
            data.yaxis.end,
            (categories, series, values, valueSpace) => eo.outOf(
                eo.map(
                    mchw.toWhateverChart(
                        chartId,
                        countryCode,
                        data,
                        series,
                        categories,
                        valueSpace,
                        mchz.toVisual(chartId, data.series, data.yaxis.valueSuffix)
                    ),
                    fromSingleChart
                ),
                some => pu.fromAvailable<mchc.ComingChart, Chart>(some),
                none => pu.fromAvailable<mchc.ComingChart, Chart>(
                    fromUndevelopedChart(
                        mchu.toUndevelopedChart(chartId,  countryCode, data, visual)
                    )
                )
            ),
            empty => pu.fromEmpty<mchc.ComingChart, Chart>(empty)
        ),
        caseOfMulti: data => dch.withNonEmptyDataForMulti(
            data.categories,
            data.seriesGroups,
            (categories, groups) => pu.fromAvailable<mchc.ComingChart, Chart>(
                fromMultiChart(
                    new mchm.MultiChart(
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
                        groups,
                        mchz.toVisual
                    )
                )
            ),
            empty => pu.fromEmpty<mchc.ComingChart, Chart>(empty)
        )
    });
}

export function willConsiderTransformingToLoadedChart(
    uncertain: UncertainChart,
    countryCode: string,
    repository: drp.Repository
) : ef.Once<UncertainChart> {
    return pu.viaUncertain(
        uncertain, {
            caseOfComing(unloaded, unsertain) {
                return ef.map(
                    repository.requestChart(unloaded.chartId, countryCode),
                    data => dr.outOfRequested(
                        data,
                        data => toUncertainChart(unloaded.chartId, countryCode, data),
                        problem => pu.fromFailed<mchc.ComingChart, Chart>(
                            problem
                        )
                    )
                );
            },
            caseOfEmpty: ef.second,
            caseOfFailed: ef.second,
            caseOfAvailable: ef.second
        }
    );
}

