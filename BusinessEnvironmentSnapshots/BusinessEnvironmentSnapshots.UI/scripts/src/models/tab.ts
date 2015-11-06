import ea = require('essentials/array');
import ef = require('essentials/futures');
import ec = require('essentials/core');
import dr = require('data/requested');
import drp = require('data/repository');
import dtb = require('data/tab');
import msc = require('models/section');

export interface Tab {
    index: number;
    code: string;
    name: string;
    sections: msc.Section[];
} 

export function tabFrom(
    index: number,
    code: string,
    name: string,
    sections: msc.Section[]
) : Tab {
    return {
        index: index,
        code : code,
        name: name,
        sections: sections
    };
}

export function willLoadTab(
    tab: Tab,
    countryCode: string,
    repository: drp.Repository
) : ef.Once<void> {
    return ef.ignore(
        ef.all(
            ea.map(
                tab.sections,
                section => msc.willLoadSection(
                    section, 
                    countryCode,
                    repository
                )
            ),
            ec.id
        )
    );
}

export function toTab(
    tab: dtb.Tab,
    index: number
) : Tab {
    return tabFrom(
        index,
        tab.code,
        tab.name,
        ea.map(
            tab.sections,
            data => msc.toSection(tab.code, data)
        )
    );
}
