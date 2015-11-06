import ko = require('knockout');
import ec = require('essentials/core');
import ea = require('essentials/array');
import externals = require('models/externals');
import mch = require('models/chart');
import drp = require('data/repository');
import erq = require('essentials/request');
import dr = require('data/requested');
import dch = require('data/chart');
import dcn = require('data/country');
import eo = require('essentials/optional');
import ef = require('essentials/futures');
import er = require('essentials/runtime');
import mrb = require('models/root-base');
import mcrb = require('models/chart-root-base');
import mb = require('models/basics');
import mccc = require('models/charting/coming-chart');
import pu = require('parts/uncertain');
var settings = externals.chart;

var repository = drp.toRepository(
    erq.request,
    settings.baseApiUrl
);
var chartId = settings.chartId;

var data = {
    chart: ef.map(
        repository.requestChart(settings.chartId, settings.countryCode),
        dr.toOptional
    ),
    countries: ef.map(
        repository.requestCountries(),
        dr.toOptional
    )
};

ef.both(
    data.chart, data.countries,
    (chart, country) => eo.withBothOrDie(
        chart, country,
        (chart, countries) => {
            var country = ea.toFirstThatOrDie(countries, country => country.code === settings.countryCode, 'Unable to find a \'' + settings.countryCode + '\' country.');
            var root = mcrb.toChartRootBase(
                country.name,
                (saveImage) => ec.id<ExclusiveRoot>({
                    saveImage,
                    toChartUrl: (chartId: string) => mb.toCountryUrl(settings.baseApiUrl, settings.countryCode) + '/' + chartId,
                    chart: mch.toUncertainChart(chartId, settings.countryCode, chart),
                    shouldDisplayViewChartLink: true
                })
            );
            ko.applyBindings(er.merge<mrb.RootBase, ExclusiveRoot, InclusiveRoot>(mrb.rootBase, root));
        },
        'Unable to get data.'
    )
)


interface InclusiveRoot extends mrb.RootBase, ExclusiveRoot {
}

interface ExclusiveRoot extends mcrb.ChartRootBase {
    chart: pu.Uncertain<mccc.ComingChart, mch.Chart>;
}