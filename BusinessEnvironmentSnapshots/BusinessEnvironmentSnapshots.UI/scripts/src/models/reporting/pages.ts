import * as dst from 'data/statistics';
import * as zc from 'models/reporting/pages/chart-one';

export type Page = zc.ChartPage | TitlePage | StatisticsPage | TocPage;

export interface TitlePage {
    title: {
        countryName: string;
        countryCode: string;
    };
}

export interface StatisticsPage {
    statistics: {
        statistics: dst.Statistics;
        countryName: string;
    };
}

export interface TocPage {
    toc: {
        content: KnockoutObservable<SectionContent[]>;
    };
}

export interface SectionContent {
    index: number;
    name: string;
    description: string;
}

export function isCharts(page: Page): page is zc.ChartPage {
    return (<zc.ChartPage>page).charts != null;
}

export function isToc(page: Page): page is TocPage {
    return (<TocPage>page).toc != null;
}