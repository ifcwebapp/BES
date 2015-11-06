import * as msch from 'models/chart';

export type Block = ChartBlock | SectionBlock;

export interface ChartBlock {
    chart: msch.Chart;
}

export interface SectionBlock {
    section: {
        name: string;
        description: string;
    };
}

export function isChartBlock(block: Block) : block is ChartBlock {
    return (<ChartBlock> block).chart != null;
}

export interface ChartPage {
    charts: {
        blocks: KnockoutObservableArray<Block>;
        beingShrunken: KnockoutObservable<boolean>;
        done: KnockoutObservable<{ (): void; }>;
        isOverflown: {
            bound: () => boolean;
        };
    };
}