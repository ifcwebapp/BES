import ec = require('essentials/core');
import ea = require('essentials/array');
import dsc = require('data/section');
import ef = require('essentials/futures');
import drp = require('data/repository');
import mscc = require('models/sections/chart-section');
import mscp = require('models/sections/project-section');
import msct = require('models/sections/templated-section');

export interface Section {
    'some section': Section;
}

export function fromChartSection(section: mscc.ChartSection) : Section {
    return <any>{
        'chart': section
    };
}

export function fromProjectSection(section: mscp.ProjectSection) : Section {
    return <any>{
        'project': section
    };
}

export function fromTemplatedSection(section: msct.TemplatedSection): Section {
    return <any> {
        'templated': section
    };
}

export function outOfSection<r>(
    section: Section,
    haveChart: (section: mscc.ChartSection) => r,
    haveProject: (section: mscp.ProjectSection) => r,
    haveTemplated: (section: msct.TemplatedSection) => r
) : r {
    var key = ec.toKeyOrDie(section, 'Unable to get a case of a section.');
    switch(key) {
        case 'chart': return haveChart((<any> section)['chart']);
        case 'project': return haveProject((<any> section)['project']);
        case 'templated': return haveTemplated((<any> section)['templated']);
        default: return ec.fail<r>('Unexpected case \'' + key + '\' of a section.');
    }
}

export function willLoadSection(
    section: Section,
    countryCode: string,
    repository: drp.Repository
) : ef.Once<void> {
    return outOfSection(
        section,
        chart => ef.ignore(mscc.willLoadSection(chart, countryCode, repository)),
        project => ef.ignore(mscp.willLoadSection(project, countryCode, repository)),
        ef.alwaysWillBeVoid
    );
}

export function toSection(tabCode: string, data: dsc.Section) : Section {
    
    var toProjects = () => fromProjectSection(mscp.toProjectsSection(data.sectionType, data.name, data.description, []));
    var toTemplated = () => fromTemplatedSection(msct.toTemplatedSection(data.name, data.description, data.sectionType, data.data));

    return viaSectionType(data.sectionType, {
        caseOfChart() {
            return fromChartSection(mscc.toChartSection(data));
        },
        caseOfBank: toProjects,
        caseOfIfc: toProjects,
        caseOfKnowledgeProduct: toProjects,
        caseOfDocuments: toTemplated,
        caseOfOtherResources: toTemplated,
        caseOfKeyStatistics: toTemplated
    });
}


export interface ViaSectionType<r> {
    caseOfDocuments(): r;
    caseOfOtherResources(): r;
    caseOfKnowledgeProduct(): r;
    caseOfIfc(): r;
    caseOfBank(): r;
    caseOfChart(): r;
    caseOfKeyStatistics(): r;
}

export function viaSectionType<r>(
    sectionType: string,
    via: ViaSectionType<r>
) : r {
    switch(sectionType) {
        case 'Document': return via.caseOfDocuments();
        case 'Other': return via.caseOfOtherResources();
        case 'Knowledge Product': return via.caseOfKnowledgeProduct();
        case 'IFC': return via.caseOfIfc();
        case 'Bank': return via.caseOfBank();
        case 'chart': return via.caseOfChart();
        case 'Key Statistics': return via.caseOfKeyStatistics();
        default: return ec.fail<r>('Unexpected case \'' + sectionType + '\' of a section type.');
    }
}