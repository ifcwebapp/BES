import ko = require('knockout');
import ec = require('essentials/core');
import ea = require('essentials/array');
import dr = require('data/requested');
import drp = require('data/repository');
import ef = require('essentials/futures');
import dpj = require('data/project');

export interface ProjectSection {
    projects: KnockoutObservable<dpj.Project[]>;
    name: string;
    description: string;
    projectType: string;
}

export function toProjectsSection(
    projectType: string,
    name: string,
    description: string,
    projects: dpj.Project[]
) : ProjectSection {
    return {
        name: name,
        description: description,
        projects: ko.observable(projects),
        projectType: projectType
    };
}

export function willLoadSection(section: ProjectSection, countryCode: string, repository: drp.Repository): ef.Once<void> {
    return ef.map(
        repository.requestProjects(countryCode),
        requested => dr.outOfRequested(
            requested,
            projects => {
                section.projects(ea.filter(projects, project => project.projectType === section.projectType))
            },
            none => ec.fail<void>('Unable to get the projects from the server. ' + none)
        )
    );
}