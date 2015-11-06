import * as ko from 'knockout';
import * as ea from 'essentials/array';
import * as $ from 'jquery';
import * as msv from 'models/saving';
import { usePdfDocument } from 'ui/pdf';
import * as un2p from 'ui/node2pdf';
import * as ud from 'ui/dom';
import * as upw from 'ui/pdf/writer';
import * as el from 'essentials/list';
import * as cb from 'common/box';
import * as ec from 'essentials/core';
import * as mcu from 'models/charting/utils';

var shouldSave = ko.observable(false);
var root = {
    shouldSave: shouldSave,
    formatStatValue: mcu.formatValue,
    generate(_: any, e: any): void {

        var targetSize = msv.pdfSize;
        usePdfDocument(
            msv.toDefaultOptions(targetSize),
            doc => {
                msv.writeReport(doc, targetSize, e.currentTarget);
            },
            blob => {
                if (shouldSave()) {
                    msv.download(String(new Date().getTime()) + '.pdf', blob);
                } else {
                    msv.display(e.currentTarget.parentElement, blob, String(new Date().getTime()) + '.pdf');
                }
            }
        );
    }
};

ko.applyBindings(root);

