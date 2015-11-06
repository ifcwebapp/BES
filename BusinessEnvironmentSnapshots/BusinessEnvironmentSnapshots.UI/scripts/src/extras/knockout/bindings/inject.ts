import ko = require('knockout');

export function enableInjectBinding(bindingHandlers: KnockoutBindingHandlers) : void {
    bindingHandlers['inject'] = bindingHandlers['inject'] || {
        init(element: Element, valueAccessor: any, allAccessors: any, viewModel: any) {
            var take = ko.unwrap<any>(valueAccessor());
            take.call(viewModel, element);
        }
    };
}