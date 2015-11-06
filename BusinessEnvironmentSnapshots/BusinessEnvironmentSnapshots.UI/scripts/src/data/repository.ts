import eo = require('essentials/optional');
import er = require('essentials/request');
import ef = require('essentials/futures');
import dst = require('data/statistics');
import dch = require('data/chart');
import dtb = require('data/tab');
import dcn = require('data/country');
import dpj = require('data/project');
import dr = require('data/requested');

export interface Repository {
    requestChart(chartId: string, countryCode: string) : ef.Once<dr.Requested<dch.Chart>>;
    requestTabs(countryCode: string) : ef.Once<dr.Requested<dtb.Tab[]>>;
    requestStatistics(countryCode: string): ef.Once<dr.Requested<eo.Optional<dst.Statistics>>>;
    requestCountries(): ef.Once<dr.Requested<dcn.Country[]>>;
    requestProjects(countryCode: string): ef.Once<dr.Requested<dpj.Project[]>>;
}

export function toRepository(request: er.Request, baseUrl: string) : Repository {
    var result : Repository = {
        requestChart(chartId, countryCode) {
            var query = er.toQueryString({
                'id': chartId,
                'countryCode': countryCode
            });
            return request<void, dr.Requested<dch.Chart>>(baseUrl + 'api/chart?' + query, undefined, 'GET');
        },
        requestTabs(countryCode) {
            var query = er.toQueryString({
                'countryCode': countryCode
            });
            return request<void, dr.Requested<dtb.Tab[]>>(baseUrl + 'api/tabs?' + query, undefined, 'GET');
        },
        requestStatistics(countryCode) {
            var query = er.toQueryString({
                'countryCode': countryCode
            });
            return request<void, dr.Requested<eo.Optional<dst.Statistics>>>(baseUrl + 'api/statistics?' + query, undefined, 'GET');
        },
        requestCountries() {
            return request<void, dr.Requested<dcn.Country[]>>(baseUrl + 'api/countries', undefined, 'GET');
        },
        requestProjects(countryCode) {
            var query = er.toQueryString({
                'countryCode': countryCode
            });
            return request<void, dr.Requested<dpj.Project[]>>(baseUrl + 'api/projects?' + query, undefined, 'GET');
        }
    };
    return result;
}