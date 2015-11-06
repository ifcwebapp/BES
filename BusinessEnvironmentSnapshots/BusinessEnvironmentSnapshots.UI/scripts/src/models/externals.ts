import externals = require('module');
import dcn = require('data/country');
var settings : {
    country: {
        baseApiUrl: string;
        countryCode: string;
    };
    chart: {
        baseApiUrl: string;
        chartId: string;
        countryCode: string;
    };
    main: {
        baseApiUrl: string;
        countries: {
            data: dcn.Country[]
        };
    };
    report: {
        baseApiUrl: string;
        countryCode: string;
        countryUrlTemplate: string;
    };
} = {
    country: externals.config(), 
    chart: externals.config(),
    main: externals.config(),
    report: externals.config()
};

export = settings;
 