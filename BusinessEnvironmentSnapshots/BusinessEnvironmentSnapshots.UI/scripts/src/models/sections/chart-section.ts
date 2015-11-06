import ec = require('essentials/core');
import ea = require('essentials/array');
import ef = require('essentials/futures');
import ko = require('knockout');
import drp = require('data/repository');
import dsc = require('data/section');
import pr = require('parts/uncertain');
import msch = require('models/chart');
import mchc = require('models/charting/coming-chart');

export type HeldRelaxedChart = KnockoutObservable<pr.Uncertain<mchc.ComingChart, msch.Chart>>;

export interface ChartSection {
    name: string;
    description: string;
    heldCharts: HeldRelaxedChart[];
    hasNonEmptyCharts(): boolean;
}

export function chartSectionFrom(
    name: string,
    description: string,
    heldCharts: HeldRelaxedChart[]
) : ChartSection {
    return {
        name: name,
        description: description,
        heldCharts: heldCharts,
        hasNonEmptyCharts() {
            return ea.fold(heldCharts, false, (result, heldChart) => {
                return result || !pr.isEmpty(heldChart());
            });
        }
    };
}

export function toChartSection(
    data: dsc.Section
) : ChartSection {
    return chartSectionFrom(
        data.name,
        data.description,
        ea.map(
            data.chartIds,
            chartId => msch.toRelaxedChart(chartId)
        )
    );
}

export function willLoadSection(
    section: ChartSection,
    countryCode: string,
    repository: drp.Repository
) : ef.Once<HeldRelaxedChart[]> {
    return ef.all(
        ea.map(
            section.heldCharts,
            heldChart => ef.map(
                msch.willConsiderTransformingToLoadedChart(
                    heldChart(),
                    countryCode,
                    repository
                ),
                relaxed => {
                    heldChart(relaxed);
                    return heldChart;
                }
            )
        ),
        ec.id
    );
}
