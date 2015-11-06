import msv = require('models/saving');

export interface ChartRootBase {
    shouldDisplayViewChartLink: boolean,
    toChartUrl(chartId: string): string,
    saveImage(viewModel: any, e: any): void;
}

export function toChartRootBase<a extends ChartRootBase>(
    countryName: string,
    haveDefaults: (
        saveImage: typeof msv.saveImage
    ) => a
) : a {
    return haveDefaults(
        msv.saveImage
    );
}