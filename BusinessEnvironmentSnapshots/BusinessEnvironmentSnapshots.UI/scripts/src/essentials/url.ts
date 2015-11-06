import ec = require('essentials/core');
import ea = require('essentials/array');
import em = require('essentials/maps');
import etx = require('essentials/text');

export function parseQueryStringParametersOrDie(value: string, failure: string) : em.Map<string> {
    return ea.fold(
        value.split('&'),
        em.toMapOf<string>(),
        (result, chunk) => ea.withUpTo2(
            chunk.split('='),
            name => em.addUnsafe(
                result,
                ec.emptyString,
                name
            ),
            (name, value) => em.addUnsafe(
                result,
                decodeURIComponent(value),
                name
            ),
            otherwise => ec.fail<em.Map<string>>(failure + ' Unable to parse a key-value pair. ' + otherwise)
        )
    );
}


function withRightPart<r>(delimiter: string, value: string, havePart: (value: string) => r, haveNone: (reason: string) => r) : r {
    return ea.withUpTo2(
        value.split(delimiter),
        havePart,
        (beforeHash, afterHash) => havePart(afterHash),
        haveNone
    );
}

export function withFragment<r>(value: string, haveFragment: (value: string) => r, haveNone: (reason: string) => r) : r {
    return withRightPart('#', value, haveFragment, haveNone);
}

export function withFragmentOrDefault<r>(value: string, haveFragment: (value: string) => r, defaultResult: r) : r {
    return withRightPart('#', value, haveFragment, ec.always(defaultResult));
}

export function withSearch<r>(value: string, haveSearch: (value: string) => r, haveNone: (reason: string) => r) : r {
    return withRightPart('?', value, haveSearch, haveNone);
}