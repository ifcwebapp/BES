import dch = require('data/chart');
import visual = require('models/charting/basics/styles');
import mchb = require('models/charting/chart-base');

export class UnfinishedChart extends mchb.ChartBase {
    render(element: HTMLElement): void {
    }
}

export function toUndevelopedChart(
    chartId: string,
    countryCode: string,
    data: dch.SingleChart,
    custom: typeof visual
) : UnfinishedChart {
    return new UnfinishedChart(
        chartId,
        countryCode,
        data.title,
        data.description,
        data.sourceLink,
        data.sourceTitle,
        custom
    );
}
