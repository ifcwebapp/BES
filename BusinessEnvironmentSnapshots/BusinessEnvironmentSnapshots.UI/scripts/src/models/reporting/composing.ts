import * as ko from 'knockout';
import * as ec from 'essentials/core';
import * as ea from 'essentials/array';
import * as zp from 'models/reporting/pages';
import * as zpc from 'models/reporting/pages/chart-one';
import * as msch from 'models/chart';

export interface Root {
    pages: KnockoutObservableArray<zp.Page>;
}

function shrink(page: zpc.ChartPage, index: number, root: Root, rest: msch.Chart[], end: () => void): void {
    page.charts.beingShrunken(true);
    let blocks = page.charts.blocks();
    if (blocks.length > 1) {
        var block = blocks.pop();
        if (zpc.isChartBlock(block)) {

            rest.unshift(block.chart);
            page.charts.blocks(blocks);
            schedule(function () {
                if (page.charts.isOverflown.bound()) {
                    //page.charts.done(function() {
                        shrink(page, index, root, rest, end);
                    //});
                } else {
                    //page.charts.done(function() {
                        page.charts.beingShrunken(false);
                        regroup(root, index, rest, end);
                    //});
                }
            });

        } else {
            return ec.fail<void>('Unable to shrink the page. Moving chart section is not allowed.');
        }
    } else {
        return ec.fail<void>('Unable to shrink the page. The page has a single block that yet cannot be fit.');
    }
}

function regroup(root: Root, index: number, charts: msch.Chart[], end: () => void): void {
    if (charts.length > 0) {
        let pages = root.pages();
        ea.insert(pages, ec.id<zpc.ChartPage>({
            charts: {
                blocks: ko.observableArray(
                    ea.map(charts, chart => ec.id<zpc.ChartBlock>({
                        chart: chart
                    }))
                ),
                beingShrunken: ko.observable(false),
                done: ko.observable(undefined),
                isOverflown: {
                    bound: undefined
                }
            }
        }), index + 1);
        root.pages(pages);
        schedule(function () {
            compose(root, index + 1, end);
        });
    } else {
        return ec.fail<void>('No charts to regroup.');
    }
}

function schedule(act: () => void) {
    window.requestAnimationFrame(act);
    //setTimeout(act, 100);
}

export function compose(root: Root, index: number, end: () => void): void {
    var pages = root.pages();
    if (index < pages.length) {
        var page = pages[index];
        if (zp.isCharts(page)) {
            if (page.charts.isOverflown.bound()) {
                return shrink(page, index, root, [], end);
            } else {
                // the current page has all its content fit
                // but the next page might need to be shrunk
                return compose(root, index + 1, end);
            }
        } else {
            end();
        }
    } else {
        end();
    }
}

