import * as $ from 'jquery';
import * as ex from 'essentials/text';
import * as en from 'essentials/numbers';
import * as eo from 'essentials/optional';
import * as em from 'essentials/maps';
import * as erq from 'essentials/request';
import * as er from 'essentials/runtime';
import * as ko from 'knockout';
import * as xkobk from 'extras/knockout/bindings/know';
import * as xkobo from 'extras/knockout/bindings/overflown';
import * as ea from 'essentials/array';
import * as ef from 'essentials/futures';
import * as ew from 'essentials/few';
import * as eur from 'essentials/url';
import * as ec from 'essentials/core';
import * as dst from 'data/statistics';
import * as drp from 'data/repository';
import * as dcn from 'data/country';
import * as dtb from 'data/tab';
import * as dr from 'data/requested';
import * as pu from 'parts/uncertain';
import * as mtb from 'models/tab';
import * as mrb from 'models/root-base';
import * as mnv from 'models/navigation';
import * as msc from 'models/section';
import * as mb from 'models/basics';
import * as mcu from 'models/charting/utils';
import * as up from 'ui/pdf';
import * as msch from 'models/chart';
import * as msv from 'models/saving';
import * as mchc from 'models/charting/coming-chart';
import * as externals from 'models/externals';
import * as defaults from 'models/defaults';
import * as mcrb from 'models/chart-root-base';
import * as zp from 'models/reporting/pages';
import * as zpc from 'models/reporting/pages/chart-one';
import * as zc from 'models/reporting/composing';
import * as zt from 'models/reporting/controller';

xkobk.enableKnowBinding(ko.bindingHandlers);
xkobo.enableOverflownBinding(ko.bindingHandlers);

var settings = externals.report;

export interface ChartSection {
    name: string;
    description: string;
    charts: msch.Chart[];
}

function willBeRoot(countries: dcn.Country[], tabsData: ew.Few<dtb.Tab>): ef.Once<InclusiveRoot> {

    var country = ea.toFirstThatOrDie(
        countries,
        country => country.code === settings.countryCode,
        'Unable to find a country with the \'' + settings.countryCode + '\' code.'
    );

    var tabs = ea.map(tabsData, mtb.toTab);
    return ef.all(
        willLoadTabs(tabs),
        () => {
            var controller = ko.observable<zt.Controller>();
            controller(zt.toComposingController());

            var sections = ea.fold(
                tabs,
                <ChartSection[]>[],
                (result, tab) => ea.fold(
                    tab.sections,
                    result,
                    (result, section) => msc.outOfSection(
                        section,
                        section => {
                            var charts = ea.choose(
                                section.heldCharts,
                                held => pu.viaUncertain(held(), {
                                    caseOfAvailable: chart => eo.fromSome(chart),
                                    caseOfEmpty: () => eo.noneFrom(''),
                                    caseOfFailed: () => eo.noneFrom(''),
                                    caseOfComing: () => ec.fail<eo.Optional<msch.Chart>>('A chart is still loading.')
                                })
                            );
                            return charts.length > 0 ? ea.append(result, {
                                name: section.name,
                                description: section.description,
                                charts: charts
                            }) : result;
                        },
                        section => result,
                        section => result
                    )
                )
            );

            var pages: KnockoutObservableArray<zp.Page> = ko.observableArray(ea.concatAll<zp.Page>([
                [
                    ec.id<zp.TitlePage>({
                        title: {
                            countryCode: country.code,
                            countryName: country.name
                        }
                    }),
                    ec.id<zp.TocPage>({
                        toc: {
                            content: ko.observable([])
                        }
                    }),
                    ec.id<zp.StatisticsPage>({
                        statistics: {
                            statistics: statisticsOutOfTabs(tabs),
                            countryName: country.name
                        }
                    })
                ],
                ea.map(sections, section => ec.id<zpc.ChartPage>({
                    charts: {
                        blocks: ko.observableArray(ea.concatAll<zpc.Block>([
                            [ec.id<zpc.SectionBlock>({
                                section: {
                                    name: section.name,
                                    description: section.description
                                }
                            })],
                            ea.map(section.charts, chart => ec.id<zpc.ChartBlock>({
                                chart: chart
                            }))
                        ])),
                        beingShrunken: ko.observable(false),
                        done: ko.observable(undefined),
                        isOverflown: {
                            bound: undefined
                        }
                    }
                }))
            ]));

            var root: ExclusiveRoot = mcrb.toChartRootBase(
                country.name,
                saveImage => ec.id<ExclusiveRoot>({
                    pages: pages,
                    controller: controller,
                    saveImage,
                    country: country,
                    shouldDisplayViewChartLink: false,
                    toChartUrl: (chartId: string) => mb.toCountryUrl(settings.baseApiUrl, settings.countryCode) + '/' + chartId,
                    formatStatValue: mcu.formatValue
                })
            );
            return er.merge<mrb.RootBase, ExclusiveRoot, InclusiveRoot>(mrb.rootBase, root);
        }
    );
}


function statisticsOutOfTabs(tabs: mtb.Tab[]): dst.Statistics {
    return eo.asSomeOrDie(ea.pick(tabs, tab => ea.pick(tab.sections, section => msc.outOfSection(
        section,
        () => eo.noneFrom(''),
        () => eo.noneFrom(''),
        templated => templated.discriminator === 'Key Statistics'
            ? eo.fromSome<dst.Statistics>(templated.data[templated.discriminator])
            : eo.noneFrom('')
    ))), 'Unable to find statistics.');
}

function willLoadTabs(tabs: mtb.Tab[]) {
    return ea.map(
        tabs,
        tab => mtb.willLoadTab(
            tab,
            settings.countryCode,
            repository
        )
    );
}

interface ExclusiveRoot extends mcrb.ChartRootBase {
    controller: KnockoutObservable<zt.Controller>;
    country: dcn.Country;
    pages: KnockoutObservableArray<zp.Page>;
    formatStatValue: (valueOpt: number, suffixOpt: string) => string
}

interface InclusiveRoot extends ExclusiveRoot, mrb.RootBase {
}

function generateOver(county: dcn.Country, controller: KnockoutObservable<zt.Controller>) {
    return function generate(model: any, e: any): void {
        var containerElement = $(e.currentTarget).parents('body')[0]; // <-- must be before overwritting controller (next line)
        controller(zt.toWorkingController());
        setTimeout(function () {
            var targetSize = msv.pdfSize;
            up.usePdfDocument(
                msv.toDefaultOptions(targetSize),
                doc => {
                    msv.writeReport(doc, targetSize, containerElement);
                },
                blob => {
                    msv.download(county.name + '.pdf', blob);
                    controller(
                        zt.toFinishedController(
                            generateOver(county, controller),
                            county,
                            mb.toCountryUrl2(settings.countryUrlTemplate, county.code)
                        )
                    );
                }
            );
        }, 0);
    };
}

function generateTableOfContent(pages: KnockoutObservableArray<zp.Page>): void {
    var all = pages();
    var toc = eo.asSomeOrDie(ea.pick(all, page => zp.isToc(page) ? eo.fromSome(page) : eo.noneFrom('Not a TOC page.')), 'Unable to find a TOC page.');
    var content = ea.fold(
        all,
        <zp.SectionContent[]>[],
        (result, page, index) => zp.isCharts(page)
            ? ea.withHeadOrDefault(
                page.charts.blocks(),
                (first, rest) => zpc.isChartBlock(first)
                    ? result : ea.append(
                        result, {
                            name: first.section.name,
                            description: first.section.description,
                            index: index
                        }
                    ),
                result
            ) : result
    );
    toc.toc.content(content);
}

var repository = drp.toRepository(
    erq.request,
    settings.baseApiUrl
);

ef.both(
    repository.requestCountries(),
    repository.requestTabs(settings.countryCode),
    (countries, tabs) => {
        return dr.withBoth(
            countries, tabs,
            (countries, tabs) => ew.withFew(
                tabs,
                tabs => {
                    ef.map(
                        willBeRoot(countries, tabs),
                        root => {
                            ko.applyBindings(root);
                            requestAnimationFrame(function () {
                                zc.compose(root, 3, function () {
                                    root.controller(
                                        zt.toAvailableController(
                                            generateOver(root.country, root.controller)
                                        )
                                    );
                                    generateTableOfContent(root.pages);
                                });
                            });
                        }
                    );
                    return ef.voidTobe;
                }, reason => {
                    window.console.error('There are no tabs. ' + reason);
                    return ef.voidTobe;
                }
            ),
            problems => {
                ea.use(problems, problem => {
                    window.console.error(problem);
                });
                return ef.voidTobe;
            }
        );
    }
)


