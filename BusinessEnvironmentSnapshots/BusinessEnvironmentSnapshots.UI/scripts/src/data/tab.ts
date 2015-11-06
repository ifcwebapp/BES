import dsc = require('data/section');

export interface Tab {
    code: string;
    name: string;
    sections: dsc.Section[];
}

export function tabFrom(
    code: string,
    name: string,
    sections: dsc.Section[]
) : Tab {
    return {
        code: code,
        name: name,
        sections: sections
    };
}