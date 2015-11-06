export function enableOverflownBinding(handlers: KnockoutBindingHandlers): void {
    handlers['overflown'] = handlers['overflown'] || {
        init(element: HTMLElement, toObserved: () => { bound: () => boolean; }) {
            var observed = toObserved();
            observed.bound = function() {
                var clientHeight = element.clientHeight;
                var scrollHeight = element.scrollHeight;
                var result = clientHeight < scrollHeight;
                return result; // || element.clientWidth < element.scrollWidth;
            };
        }
    };
}