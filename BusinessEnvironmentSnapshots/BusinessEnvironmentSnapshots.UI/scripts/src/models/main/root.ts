import ko = require('knockout');
import d3 = require('d3');
import ex = require('essentials/text');
import ec = require('essentials/core');
import eo = require('essentials/optional');
import em = require('essentials/maps');
import en = require('essentials/numbers');
import erq = require('essentials/request');
import ea = require('essentials/array');
import ef = require('essentials/futures');
import ew = require('essentials/few');
import er = require('essentials/runtime');
import eur = require('essentials/url');
import drp = require('data/repository');
import dcn = require('data/country');
import dr = require('data/requested');
import pu = require('parts/uncertain');
import mnv = require('models/navigation');
import externals = require('models/externals');
import mrb = require('models/root-base');
import xkobk = require('extras/knockout/bindings/know');
import defaults = require('models/defaults');

var settings = externals.main;

xkobk.enableKnowBinding(ko.bindingHandlers);

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

function toRoot(countries: dcn.Country[]) : InclusiveRoot {

    var query = toQuery();
    
    var originalPath = window.location.pathname;
    var navigation = mnv.toNavigation(
        countries,
        undefined,
        countryOpt => countryOpt != null ? countryOpt.code : '',
        country => {
            if (country != null) {
                window.location.pathname = ex.stripTailIfAny(originalPath, '/', ex.areStringEqual) + '/country/' + country.code;
            } else {
                window.location.pathname = ex.stripTailIfAny(originalPath, '/', ex.areStringEqual);
            }
        }
    );

    var root : ExclusiveRoot = {
        navigation: navigation
    };

    return er.merge<mrb.RootBase, ExclusiveRoot, InclusiveRoot>(mrb.rootBase, root);
}

interface InclusiveRoot extends mrb.RootBase, ExclusiveRoot {
}

interface ExclusiveRoot {
    navigation: mnv.Navigation<dcn.Country>;
}

ko.applyBindings(toRoot(settings.countries.data));
