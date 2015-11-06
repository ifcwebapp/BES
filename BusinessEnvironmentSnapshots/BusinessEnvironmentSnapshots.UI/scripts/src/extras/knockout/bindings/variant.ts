import ec = require('essentials/core');
import ko = require('knockout');
import em = require('essentials/maps');

interface Options<a> {
    data: a | KnockoutObservable<a>;
    names: em.Map<string>;
}



export function enableVariantBinding(bindingHandlers:  KnockoutBindingHandlers) : void {
    ko.virtualElements.allowedBindings['variant'] = true;
    bindingHandlers['variant'] = bindingHandlers['variant'] || {

        init(element: Element, valueAccessor: () => Options<any>, allAccessors: any, viewModel: any, bindingContext: any) {
            return redirectVariantBindingToTemplateBinding(
                bindingHandlers,
                'init',
                element,
                valueAccessor,
                allAccessors,
                viewModel,
                bindingContext
            );
        },

        update(element: Element, valueAccessor: () => Options<any>, allAccessors: any, viewModel: any, bindingContext: any) {
            return redirectVariantBindingToTemplateBinding(
                bindingHandlers,
                'update',
                element,
                valueAccessor,
                allAccessors,
                viewModel,
                bindingContext
            );
        }
    };
} 

function redirectVariantBindingToTemplateBinding(
    bindingHandlers: KnockoutBindingHandlers,
    method: string,
    element: Element,
    valueAccessor: () => Options<any>,
    allAccessors: any,
    viewModel: any,
    bindingContext: any
) : void {
    var options = ko.unwrap(valueAccessor());
    var data = ko.unwrap(options.data);
    var key = ec.toKeyOrDie(data, 'Unable to get a case of a variant.');
    var templateName = em.atOrDie(options.names, key, 'Unable to get a template name for the \'' + key + '\' case of a variant.');
    
    return (<any> bindingHandlers['template'])[method].call(
        this,
        element,
        () => ({ data: data[key], name: templateName }),
        allAccessors,
        viewModel,
        bindingContext
    );
}