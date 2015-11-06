import eo = require('essentials/optional');
import ec = require('essentials/core');
import ew = require('essentials/few');
import er = require('essentials/runtime');
import visual = require('models/charting/basics/styles');
import dchi = require('data/chart-id');
import dch = require('data/chart');
import dsr = require('data/series');

var no = {
    margin: { top: 0, right: 0, bottom: 0, left: 0 }
};

var standard = {
    base: visual,
    polar: er.mostlyLike(visual, but => {
        but.margin = no.margin;
    }),
    line: er.mostlyLike(visual, but => {
    }),
    bar: er.mostlyLike(visual, but => {
        but.margin.left = 70;
        but.margin.right = 10;
    }),
    column: er.mostlyLike(visual, but => {
    }),
    pie: er.mostlyLike(visual, but => {
        but.margin = no.margin;
    })
}

export function toVisuals(series: dsr.Series<dsr.SeriesType>[]) {
    return er.roughlyLike(
        dchi.toForChartId(ew.withFew(
            series,
            series => dsr.viaKnownType(series, toVisualsViaKnownType),
            none => visual
        )),
        but => {
            but.forFirmsExpectedToPayBribes = er.mostlyLike(standard.bar, but => {
                but.height = 400;
            });
            but.forProtectingMinorityInvestorsIndices = er.mostlyLike(standard.bar, but => {
                but.margin.left = 150;
            });
            but.forStrengthOfInsolvencyFrameworkIndices = er.mostlyLike(standard.bar, but => {
                but.margin.left = 90;
            });
            but.forMostProblematicFactors = er.mostlyLike(standard.bar, but => {
                but.height = 450;
                but.margin.left = 170;
            });
            but.forDoingBusinessRanking = er.mostlyLike(standard.bar, but => {
                but.axis.valueable.isNice = false;
            });
            but.forAccessingIndustrialLand = er.mostlyLike(standard.bar, but => {
                but.margin.left = 100;
            });
            but.forBiggestRegionalConstraintToFutureInvestment = er.mostlyLike(standard.bar, but => {
                but.margin.left = 150;
            });
            but.forCreditToPrivateSector = er.mostlyLike(standard.line, but => {
                but.margin.left = 55;
                but.axis.valueable.vertical.label.offset = 45;
            });
            but.forEnterpriseSurveysTopObstacles = er.mostlyLike(standard.line, but => {
                but.margin.bottom = 100;
                but.height += 50;
                but.axis.categorial.label.offset.x = 7;
                but.axis.categorial.label.offset.y = -10;
                but.axis.categorial.label.angle = 90;
                but.axis.categorial.label.wrapping = eo.fromSome({
                    maxLabelLength: eo.fromSome(but.margin.bottom)
                });
            });
            but.forWorldwideGovernanceIndicators = er.mostlyLike(standard.bar, but => {
                but.margin.left = 150;
            });
            but.forElectricityOutages = er.mostlyLike(standard.column, but => {
                but.margin.bottom = 40;
                but.axis.categorial.label.offset.y += 10;
            });
            but.forManagementTimeSpentWithRequirementsOfRegulation = er.mostlyLike(standard.column, but => {
                but.margin.bottom = 55;
            });
            but.forDistanceToFrontierByIndicator = er.mostlyLike(standard.line, but => {
                but.height = 150;
                but.margin.bottom = 5;
            });
            but.forReformsValidatedByDoingBusiness = er.mostlyLike(standard.column, but => {
                but.margin.top = 5;
                but.height += 50;
                but.margin.bottom = 120;
                but.axis.categorial.label.offset.x = 7;
                but.axis.categorial.label.offset.y -= 10;
                but.axis.categorial.label.angle = 90;
                but.axis.categorial.label.wrapping = eo.fromSome({
                    maxLabelLength: eo.fromSome(but.margin.bottom)
                });
            });
        }
    );   
}

var toVisualsViaKnownType : dsr.ViaKnownType<typeof standard.base> = {
    caseLinesAndColumns: ec.always(standard.column),
    caseOfBars: ec.always(standard.bar),
    caseOfColumns: ec.always(standard.column),
    caseOfInvalid: ec.always(standard.base),
    caseOfLines: ec.always(standard.line),
    caseOfLinesAndBars: ec.always(standard.bar),
    caseOfPies: ec.always(standard.pie),
    caseOfPolars: ec.always(standard.polar),
    caseOfStackedBars: ec.always(standard.bar)
};
export function toVisual(
    chartId: string,
    series: dsr.Series<dsr.SeriesType>[],
    valueSuffix: string
) : typeof standard.base {
    return dchi.forChartId(chartId, toVisuals(series));
}