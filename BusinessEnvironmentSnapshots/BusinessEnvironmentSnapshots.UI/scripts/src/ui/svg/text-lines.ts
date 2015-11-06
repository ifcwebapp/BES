import * as ec from 'essentials/core';
import * as el from 'essentials/list';

export interface Spacing {
    spacing: number;
}

export interface Word {
    word: string;
}

export type Item = Spacing | Word;

export interface Line {
    x: number;
    y: number;
    items: el.List<Item>;
}

export function toLine(x: number, y: number): Line {
    return lineFrom(x, y, el.toListOf<Item>());
}

export function lineFrom(x: number, y: number, items: el.List<Item>): Line {
    return {
        x: x,
        y: y,
        items: items
    };
}

export function spacingFrom(spacing: number): Spacing {
    return {
        spacing: spacing
    };
}

export function wordFrom(word: string): Word {
    return {
        word: word
    };
}

export interface ViaItem<r> {
    caseOfSpacing(item: Spacing): r;
    caseOfWord(item: Word): r;
}

export function viaItem<r>(item: Item, via: ViaItem<r>): r {
    var key = ec.toKeyOrDie(item, 'Unable to get the key of an item.');
    switch (key) {
        case 'spacing': return via.caseOfSpacing(<Spacing>item);
        case 'word': return via.caseOfWord(<Word>item);
        default: return ec.fail<r>('Unexpected case \'' + key + '\' of an item.');
    }
}

export function measure(
    items: el.List<Item>,
    toWidth: (word: string) => number
): number {
    return el.fold(
        items, 0,
        (width, item) => viaItem(item, {
            caseOfWord: item => width + toWidth(item.word),
            caseOfSpacing: item => width + item.spacing
        })
    );
}