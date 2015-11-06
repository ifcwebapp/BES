import * as eo from 'essentials/optional';
import * as ko from 'knockout';
import * as mcbtw from 'models/charting/basics/text-wrapping';

function tryWrapping(_: any, e: any): any {
    if (e.target.tagName === 'text') {
        var text = <SVGTextElement>e.target;
        console.log(text.getAttribute('vertical-text-anchor'));
        mcbtw.wrapIfNeeded(text, 15);
    }
}

var root = {
    tryWrapping
};

ko.applyBindings(root);