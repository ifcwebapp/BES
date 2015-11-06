import ko = require('knockout');

export function enableKnowBinding(handlers: KnockoutBindingHandlers) : void {
    handlers['know'] = handlers['know'] || {
        update(element: Element, toData: () => any, allAccessors: any, viewModel: any, bindingContext: any) {
            var data = ko.unwrap(toData());
            var known = bindingContext.$known = bindingContext.$known || {};
            ko.utils.extend(known, data);
        }
    };
}