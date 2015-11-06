import * as d3 from 'd3';
import * as ko from 'knockout';
import * as ea from 'essentials/array';
import * as $ from 'jquery';
import * as msv from 'models/saving';
import { usePdfDocument } from 'ui/pdf';
import * as un2p from 'ui/node2pdf';
import * as ud from 'ui/dom';
import * as upw from 'ui/pdf/writer';
import * as en from 'essentials/numbers';
import * as el from 'essentials/list';
import * as cb from 'common/box';
import * as ec from 'essentials/core';
import * as mcu from 'models/charting/utils';
import * as uv from 'ui/svg';
import * as mcbtw from 'models/charting/basics/text-wrapping';

var value = ko.observable('');
var width = ko.observable('50');
var alignment = ko.observable('left');

value.subscribe(value => {
    setTimeout(function () {
        run(value, width());
    }, 0);
});

alignment.subscribe(() => {
    setTimeout(function () {
        run(value(), width());
    }, 0);
});

width.subscribe(width => {
    setTimeout(function () {
        run(value(), width);
    }, 0);
});

function run(value: string, widthAsText: string): void {
    var svg = <SVGSVGElement>document.body.querySelector('svg');
    var text = <SVGTextElement>svg.querySelector('text');
    var width = en.toIntegerOrDie(widthAsText, 'Unable to get the width.');
    // var x = uv.xOf(text);
    mcbtw.wrap(text, value.split(' '), width, svg, 15);
}



var root = {
    value: value,
    width: width,
    alignment: alignment
};

ko.applyBindings(root);

setTimeout(function () { value('hey, that\'s a really long story'); }, 0);