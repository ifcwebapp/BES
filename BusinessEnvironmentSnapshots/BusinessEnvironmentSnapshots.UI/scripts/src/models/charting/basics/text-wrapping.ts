import d3 = require('d3');
import * as uv from 'ui/svg';
import * as ud from 'ui/dom';
import * as ec from 'essentials/core';
import * as eo from 'essentials/optional';
import * as en from 'essentials/numbers';
import * as ea from 'essentials/array';
import * as zvta from 'models/charting/basics/vertical-text-anchor';


export function maxLengthOutOf(text: SVGTextElement) : eo.Optional<number> {
    return eo.map(
        eo.fromNullable(text.getAttribute('max-length')),
        some => en.toFloatOrDie(some, 'Unable to read a max-lenth attribute.')
    );
}

export function wrapIfNeeded(text: SVGTextElement, lineHeight: number) : void {
    var maxLength = maxLengthOutOf(text);
    if (eo.isSome(maxLength)) {
        wrap(
            text,
            text.textContent.split(' '),
            maxLength.some,
            text.ownerSVGElement,
            lineHeight
        );
    }
}

export function wrap(text: SVGTextElement, words: string[], width: number, svg: SVGSVGElement, lineHeight: number): void {
    var verticalTextAnchor = eo.asSomeOrDefault(
        zvta.verticalTextAnchorOutOf(text),
        zvta.VerticalTextAnchor.Start
    );
    var spaceWidth = toLetterWidth(' ', text); // <-- DON'T MOVE!!! Side effect: adds a text node which needs to be detached.
    var measureds = ea.map(words, word => <Measured>{
        width: toLetterWidth(word, text),
        word: word
    });
    ud.detachChildren(text);
    attachWrapped(
        measureds,
        uv.lengthOutOf(text.x),
        uv.lengthOutOf(text.y),
        text,
        width, spaceWidth, lineHeight,
        verticalTextAnchor
    );
}

function toLetterWidth(letter: string, text: SVGTextElement): number {
    text.textContent = '_' + letter + '_';
    var gross = text.getComputedTextLength();
    text.textContent = '__';
    var vat = text.getComputedTextLength();
    return gross - vat;
}

interface Measured {
    word: string;
    width: number;
}

function attachWrapped(
    words: Measured[],
    x: number,
    y: number,
    text: SVGTextElement,
    maxWidth: number,
    spaceWidth: number,
    lineHeight: number,
    verticalTextAnchor: zvta.VerticalTextAnchor
): void {
    ea.fold(words, { linesCount: 0, wordsInLineCount: 0, lineWidth: 0 }, (result, measured) => {
        var span = uv.createElement(document, 'tspan');
        span.textContent = measured.word;
        text.appendChild(span);
        if (result.wordsInLineCount > 0) {
            spaceWord(span, spaceWidth);
            let lineWidth = result.lineWidth + measured.width + spaceWidth;
            if (isFirstGreater(lineWidth, maxWidth)) {
                // moving the word to the next line
                revokeWordSpacing(span);
                returnCarriage(span, x);
                feedLine(span, lineHeight);
                result.linesCount += 1;
                var offset = zvta.forVerticalTextAnchor(verticalTextAnchor, {
                    caseOfStart: 0.0,
                    caseOfMiddle: (result.linesCount - 1) * lineHeight / 2,
                    caseOfEnd: (result.linesCount - 1) * lineHeight
                });

                uv.lengthOn(
                    uv.toLength(
                        y - offset,
                        text.ownerSVGElement
                    ),
                    text.y
                );
                result.lineWidth = measured.width;
                result.wordsInLineCount = 1;
            } else {
                result.lineWidth = lineWidth;
                result.wordsInLineCount += 1;
            }
        } else {
            // line is empty, this is the first word
            returnCarriage(span, x);
            result.linesCount = 1;
            result.lineWidth = measured.width;
            result.wordsInLineCount += 1;
        }
        return result;
    });
}

function isFirstLess(first: number, second: number): boolean {
    return first < second;
}

function isFirstGreater(first: number, second: number): boolean {
    return first > second;
}

/** We want to fix the horizontal position at where the text starts,
    without doing so the tspan elements will position themselves one after another. */
function returnCarriage(span: SVGTSpanElement, x: number): void {
    uv.lengthOn(uv.toLength(x, span.ownerSVGElement), span.x);
}

/** We want to move down by this number which is relative to THE PREVIOUS TSPAN ELEMENT (previous line) */
function feedLine(span: SVGTSpanElement, lineHeight: number): void {
    uv.lengthOn(uv.toLength(lineHeight, span.ownerSVGElement), span.dy);
}

function spaceWord(span: SVGTSpanElement, spaceWidth: number): void {
    uv.lengthOn(uv.toLength(spaceWidth, span.ownerSVGElement), span.dx);
}

function revokeWordSpacing(span: SVGTSpanElement): void {
    spaceWord(span, 0);
}
