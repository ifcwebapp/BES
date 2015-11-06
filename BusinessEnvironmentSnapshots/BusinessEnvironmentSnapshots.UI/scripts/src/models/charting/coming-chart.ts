/** A chart to be loaded. */
export interface ComingChart {
    chartId: string
}

/** Creates a chart to be loaded. */
export function unloadedChartFrom(
    chartId: string
) : ComingChart {
    return {
        chartId: chartId
    };
}