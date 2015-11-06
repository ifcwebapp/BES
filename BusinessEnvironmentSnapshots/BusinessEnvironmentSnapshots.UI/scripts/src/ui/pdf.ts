import el = require('essentials/list');
import PDFDocument = require('pdf-kit');
import blobStream = require('blob-stream');
import upw = require('ui/pdf/writer');
import * as eo from 'essentials/optional';
import * as cp from 'common/position';

export type Size = [number, number];

export type Converter = {
    toX(x: number): number;
    toY(y: number): number;
}

export function toConverter(source: Size, target: Size) : Converter {
    var widthRatio = target[0] / source[0];
    var heightRatio = target[1] / source[1];
    return {
        toX(x: number) {
            return x * widthRatio;
        },
        toY(y: number) {
            return y * heightRatio;
        }
    };
}

export function usePdfDocument(
    options: PDFDocumentOptions,
    write: (doc: PDFDocument) => void,
    useBlob: (blob: Blob) => void
): void {
    var precision = 10; // <-- seems to be working for PDF
    var doc: PDFDocument = new PDFDocument(options, value => toNormalizedNumber(value, precision));
    var stream = doc.pipe(blobStream());
    write(doc);
    doc.end();
    stream.on('finish', function () {
        useBlob(stream.toBlob('application/pdf'));
    });
}

/** AB: specifically for placing text pdfKit doesn't like
    long exponential numbers: "-2.9104490066698708e-14" 
    (which work no problem with translating though) */
export function toNormalizedNumber(value: number, precision: number): number {
    let result = Number(value.toFixed(precision));
    return result;
}