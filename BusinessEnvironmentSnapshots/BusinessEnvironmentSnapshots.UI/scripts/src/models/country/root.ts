import ex = require('essentials/text');
import en = require('essentials/numbers');
import eo = require('essentials/optional');
import em = require('essentials/maps');
import erq = require('essentials/request');
import er = require('essentials/runtime');
import ko = require('knockout');
import xkobk = require('extras/knockout/bindings/know');
import ea = require('essentials/array');
import ef = require('essentials/futures');
import ew = require('essentials/few');
import eur = require('essentials/url');
import ec = require('essentials/core');
import dst = require('data/statistics');
import drp = require('data/repository');
import dcn = require('data/country');
import dtb = require('data/tab');
import dr = require('data/requested');
import pu = require('parts/uncertain');
import mtb = require('models/tab');
import mrb = require('models/root-base');
import mnv = require('models/navigation');
import mb = require('models/basics');
import mcu = require('models/charting/utils');
import externals = require('models/externals');
import defaults = require('models/defaults');
import mcrb = require('models/chart-root-base');

xkobk.enableKnowBinding(ko.bindingHandlers);

var settings = externals.country;

function toQuery() {
    return eur.withFragment(
        window.location.hash,
        fragment => eur.parseQueryStringParametersOrDie(
            fragment,
            'Unable to parse the \'' + fragment + '\' as fragment query string parameters.'
        ),
        em.alwaysToMapOf<string>()
    );
}


var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function toRoot(countries: dcn.Country[], tabsData: ew.Few<dtb.Tab>) {

    var tabs = ea.map(tabsData, mtb.toTab);
    var query = toQuery();
    var tabAt = em.withAt(query, 'tab', value => en.toIntegerOrDie(value, 'Unable to read the `tab` parameter.'), ec.always(defaults.tabAt));

    var activeTab = ko.observable(tabs[tabAt]);
    ef.all(
        ea.map(
            tabs,
            tab => mtb.willLoadTab(
                tab,
                settings.countryCode,
                repository
            )
        ),
        ec.ignore
    );
    var country = ea.toFirstThatOrDie(
        countries,
        country => country.code === settings.countryCode,
        'Unable to find a country with the \'' + settings.countryCode + '\' code.'
    );

    var navigation = mnv.toNavigation(
        countries,
        country,
        countryOpt => countryOpt != null ? countryOpt.code : '',
        (countryOpt) => {
            if (countryOpt != null) {
                window.location.pathname = mb.toCountryUrl(settings.baseApiUrl, countryOpt.code);
            } else {
                window.location.pathname = ex.stripTailIfAny(settings.baseApiUrl, '/', ex.areStringEqual)
            }
        }
    );

    var root: ExclusiveRoot = mcrb.toChartRootBase(
        country.name,
        saveImage => ec.id<ExclusiveRoot>({
            country: country,
            saveImage: saveImage,
            navigation: navigation,
            tabs: tabs,
            activate: (tab: mtb.Tab) => {
                activeTab(tab);
            },
            activeTab: activeTab,
            isTabActive: (tab: mtb.Tab) => {
                return activeTab().code === tab.code;
            },
            toNextTabOpt: () => {
                return ea.withFirstAfterLike(
                    tabs,
                    activeTab(),
                    ec.areSame,
                    ec.id,
                    none => <mtb.Tab>null
                );
            },
            toPreviousTabOpt: () => {
                return ea.withFirstBeforeLike(
                    tabs,
                    activeTab(),
                    ec.areSame,
                    ec.id,
                    none => <mtb.Tab>null
                )
            },
            shouldDisplayViewChartLink: true,
            toChartUrl: (chartId: string) => mb.toCountryUrl(settings.baseApiUrl, settings.countryCode) + '/' + chartId,
            formatStatValue: mcu.formatValue
        })
    );
    return er.merge<mrb.RootBase, ExclusiveRoot, InclusiveRoot>(mrb.rootBase, root);
}

interface ExclusiveRoot extends mcrb.ChartRootBase {
    activate(tab: mtb.Tab): void;
    activeTab: KnockoutObservable<mtb.Tab>;
    country: dcn.Country;
    isTabActive(tab: mtb.Tab): boolean;
    navigation: mnv.Navigation<dcn.Country>;
    tabs: mtb.Tab[];
    toNextTabOpt(): mtb.Tab;
    toPreviousTabOpt(): mtb.Tab;
    formatStatValue: (valueOpt: number, suffixOpt: string) => string
}
interface InclusiveRoot extends ExclusiveRoot, mrb.RootBase {
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
                    var root = toRoot(countries, tabs);
                    ko.applyBindings(root);
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
);
