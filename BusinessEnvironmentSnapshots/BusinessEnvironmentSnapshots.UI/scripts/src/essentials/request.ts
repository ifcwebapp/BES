import em = require('essentials/maps');
import ef = require('essentials/futures');
import $ = require('jquery');

export interface Request {
    <a, r>(url: string, input: a, verb: string) : ef.Once<r>;
}

export function request<a, r>(url: string, input: a, verb: string) : ef.Once<r> {
    var resultTobe = ef.toLatterOf<r>();
    var settings : JQueryAjaxSettings = {
        data: input,
        type: verb,
        url: url,
        dataType: 'json',
        success(data, status, xhr) {
            resultTobe(data);
        }
    };
    $.ajax(settings);
    return resultTobe();
};

export function toQueryString(values: em.Map<string>) : string {
    return em.toArrayUnsafe(values, (value, key) => key + '=' + encodeURIComponent(value)).join('&');
}

