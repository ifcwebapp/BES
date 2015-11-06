import * as dcn from 'data/country';

export type Controller = AvailableController | WorkingController | ComposingController | FinishedController;

export interface AvailableController {
    available: {
        generate: Generate;
    };
}

export function toAvailableController(generate: Generate): AvailableController {
    return {
        available: {
            generate: generate
        }
    };
}

export interface WorkingController {
    working: void;
}

export interface ComposingController {
    composing: void;
}

export interface FinishedController {
    finished: {
        generate: Generate;
        goBackUrl: string;
        country: dcn.Country;
    };
}

export function toWorkingController(): WorkingController {
    return {
        working: undefined
    };
}
export function toComposingController(): ComposingController {
    return {
        composing: undefined
    };
}

export type Generate = (model: any, e: any) => void;

export function toFinishedController(
    generate: Generate,
    country: dcn.Country,
    goBackUrl: string
) : FinishedController {
    return {
        finished: {
            generate: generate,
            goBackUrl: goBackUrl,
            country: country
        }
    };
}