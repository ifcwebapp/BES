import * as ea from 'essentials/array';
import $ = require('jquery');
import html2canvas = require('html2canvas-svg');
import * as eo from 'essentials/optional';
import el = require('essentials/list');
import ec = require('essentials/core');
import ef = require('essentials/futures');
import em = require('essentials/maps');
import mch = require('models/chart');
import mchac = require('models/charting/any-chart');
import * as up from 'ui/pdf';
import * as un2p from 'ui/node2pdf';
import ud = require('ui/dom');
import uv = require('ui/svg');
import upw = require('ui/pdf/writer');
import ups = require('ui/pdf/states');

export function saveImage(chart: mchac.AnyChart, e: any): void {
    var element = $(e.target).parents('.chart-container').find('.chart-data')[0];
    console.log(chart);
    html2canvas(element, {
        onrendered: function (canvas) {
            var blob = dataURItoBlob(canvas.toDataURL("image/png", 0.5))
            download(toFileNameOfChart(chart, 'png'), blob);
        },
        logging: true
    });
}


export function toFileNameOfChart(chart: mchac.AnyChart, extension: string): string {
    return chart.id + '-' + chart.countryCode + '.' + extension;
}


function downloadForIe(name: string, blob: Blob): void {
    // https://msdn.microsoft.com/en-us/library/hh772298(v=vs.85).aspx
    // https://msdn.microsoft.com/en-us/library/hh779016(v=vs.85).aspx
    //var blob = new Blob([dataURItoBlob(dataUrl)]);
    window.navigator.msSaveOrOpenBlob(blob, name);
}

function dataURItoBlob(dataURI: string): Blob {
    // http://stackoverflow.com/a/12300351/139667
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var blob = new Blob([ia], { type: mimeString });
    return blob;
}

function downloadForGeneric(name: string, blob: Blob): void {
    var a = document.createElement("a");
    (<any>a).download = name;
    var url = URL.createObjectURL(blob); // isIeUnder11() ? 'javascript: document.write(\'<img src="' + dataUrl + '">\');' : ;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function displayGeneric(element: HTMLElement, blob: Blob): void {
    var iframeElement = document.createElement('iframe');
    var style = iframeElement.style
    style.position = 'fixed';
    style.top = '50%';
    style.left = '0px';
    style.bottom = '0px';
    style.right = '0px';
    style.width = '100%';
    style.height = '100%';
    iframeElement.src = URL.createObjectURL(blob);
    element.appendChild(iframeElement);
}

interface ForBrowser<a> {
    forGeneric: a;
    forIe: a;
}

function forBrowser<r>(result: ForBrowser<r>): r {
    var ie = (<any>document).documentMode;
    if (ie != null) {
        return result.forIe;
    } else {
        return result.forGeneric;
    }
}

var downloadForBrowser: ForBrowser<{ (name: string, blob: Blob): void; }> = {
    forGeneric: downloadForGeneric,
    forIe: downloadForIe
};

export var download = forBrowser(downloadForBrowser);

var displayForBrowser: ForBrowser<{ (element: HTMLElement, blob: Blob, name: string): void; }> = {
    forGeneric: (element, blob, name) => displayGeneric(element, blob),
    forIe: (element, blob, name) => downloadForIe(name, blob)
}

export var display = forBrowser(displayForBrowser);

export function toDefaultOptions(size: up.Size): PDFDocumentOptions {
    console.warn('AB: TODO: Add meta information to generated PDF.');
    return {
        compress: false,
        size: size,
        layout: 'portrait',
        margin: 0,
        info: {
            Producer: '',
            Creator: '',
            CreationDate: new Date(),
            Title: '',
            Author: '',
            Keywords: '',
            ModDate: new Date(),
            Subject: ''
        }
    };
}

export var pdfSize = <up.Size>[8.5 * 72, 11 * 72]; // <-- AB: letter size

export function toDefaultSnapshot(): ups.Snapshot {
    return {
        x: 0,
        y: 0,
        a: 0,
        sx: 1,
        sy: 1,
        letterSpacing: eo.noneFrom('No special character spacing is required.'),
        wordSpacing: eo.noneFrom('No special word spcing is require.'),
        isBold: false,
        isItalic: false,
        link: eo.noneFrom('There is no link.'),
        fontSize: 10,
        fillColor: 'black',
        fillOpacity: 1,
        lineWidth: 1,
        lineDashness: eo.noneFrom('Line is solid.'),
        strokeColor: 'black',
        strokeOpacity: 1
    };
}

export function toDefaultWriterOptions(): upw.WriterOptions {
    return {
        baseLineAt: 0.71,
        defaultPosition: { x: 0, y: 0 },
        normalLineHeightToFontSizeRatio: 1.6,
        fontSizeFactor: 0.95
    };
}

export function toWriter(doc: PDFDocument): upw.Writer {
    return upw.toWriter(
        doc,
        toDefaultSnapshot(),
        toDefaultWriterOptions()
    );
}

export function writeReport(doc: PDFDocument, targetSize: up.Size, containerElement: HTMLElement) : void {
    ea.use(pageElementOutOf(containerElement), element => {
        doc.addPage({ size: targetSize });
        upw.withLocalWriter(toWriter(doc), writer => {
            var pageBox = ud.toBoxOfElement(element);
            var styles = ud.computedStylesOutOfElement(element);
            upw.scaleBy(targetSize[0] / pageBox.width, targetSize[1] / pageBox.height, writer);
            ud.useChildren(element, node => un2p.renderNode(
                node,
                pageBox,
                styles,
                writer,
                {
                    toBoxOfElement: element => {
                        var result = ud.toBoxOfElement(element);
                        result.x -= pageBox.x;
                        result.y -= pageBox.y;
                        return result;
                    },
                    textFlowDirection: upw.TextFlowDirection.LeftToRight
                }
            ));
        });
    });
}

function pageElementOutOf(containerElement: HTMLElement): Element[] {
    var result = $(containerElement).find('.report-page');
    return result.length < 1 ? ec.fail<Element[]>('Unable to get any page element.') : <any>result;
}
