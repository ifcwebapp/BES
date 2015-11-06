import * as ex from 'essentials/text';
import * as eo from 'essentials/optional';
import * as en from 'essentials/numbers';
import * as ec from 'essentials/core';
import * as cs from 'common/sides';
import * as usl from 'ui/styles/length';
export * from 'ui/styles/length';

export function fontStyleOutOf(styles: CSSStyleDeclaration): string {
    return styles.fontStyle;
}

export function fontWeightOutOf(styles: CSSStyleDeclaration): eo.Optional<FontWeight> {
    var value = styles.fontWeight;
    return value === ''
        ? eo.noneFrom('Font weight is not specified.')
        : eo.fromSome(parseFontWeight(value, standardStringForFontWeight));
}

export const enum FontWeight {
    Normal,
    Bold,
    Lighter,
    Bolder,
    _100,
    _200,
    _300,
    _400,
    _500,
    _600,
    _700,
    _800,
    _900
}

export interface ForFontWeight<r> {
    caseOfNormal: r;
    caseOfBold: r;
    caseOfLighter: r;
    caseOfBolder: r;
    caseOf100: r;
    caseOf200: r;
    caseOf300: r;
    caseOf400: r;
    caseOf500: r;
    caseOf600: r;
    caseOf700: r;
    caseOf800: r;
    caseOf900: r;
}

export function forFontWeight<r>(
    weight: FontWeight,
    result: ForFontWeight<r>
): r {
    switch (weight) {
        case FontWeight.Normal: return result.caseOfNormal;
        case FontWeight.Bold: return result.caseOfBold;
        case FontWeight.Lighter: return result.caseOfLighter;
        case FontWeight.Bolder: return result.caseOfBolder;
        case FontWeight._100: return result.caseOf100;
        case FontWeight._200: return result.caseOf200;
        case FontWeight._300: return result.caseOf300;
        case FontWeight._400: return result.caseOf400;
        case FontWeight._500: return result.caseOf500;
        case FontWeight._600: return result.caseOf600;
        case FontWeight._700: return result.caseOf700;
        case FontWeight._800: return result.caseOf800;
        case FontWeight._900: return result.caseOf900;
        default: return ec.fail<r>('Unexpected case \'' + weight + '\' of a font weight.');
    }
}

export var standardStringForFontWeight: ForFontWeight<string> = {
    caseOfNormal: 'normal',
    caseOfBold: 'bold',
    caseOfLighter: 'lighter',
    caseOfBolder: 'bolder',
    caseOf100: '100',
    caseOf200: '200',
    caseOf300: '300',
    caseOf400: '400',
    caseOf500: '500',
    caseOf600: '600',
    caseOf700: '700',
    caseOf800: '800',
    caseOf900: '900'
};

export function parseFontWeight(
    value: string,
    results: ForFontWeight<string>
): FontWeight {
    switch (value) {
        case standardStringForFontWeight.caseOfNormal: return FontWeight.Normal;
        case standardStringForFontWeight.caseOfBold: return FontWeight.Bold;
        case standardStringForFontWeight.caseOfLighter: return FontWeight.Lighter;
        case standardStringForFontWeight.caseOfBolder: return FontWeight.Bolder;
        case standardStringForFontWeight.caseOf100: return FontWeight._100;
        case standardStringForFontWeight.caseOf200: return FontWeight._200;
        case standardStringForFontWeight.caseOf300: return FontWeight._300;
        case standardStringForFontWeight.caseOf400: return FontWeight._400;
        case standardStringForFontWeight.caseOf500: return FontWeight._500;
        case standardStringForFontWeight.caseOf600: return FontWeight._600;
        case standardStringForFontWeight.caseOf700: return FontWeight._700;
        case standardStringForFontWeight.caseOf800: return FontWeight._800;
        case standardStringForFontWeight.caseOf900: return FontWeight._900;
        default: return ec.fail<FontWeight>('Unexpected value \'' + value + '\' for a font weight.');
    }
}

export const enum BorderStyle {
    Solid
}

export function parseBorderStyle(value: string): eo.Optional<BorderStyle> {
    switch (value) {
        case 'solid': return eo.fromSome(BorderStyle.Solid);
        case 'none': return eo.noneFrom('No border.');
        default: return ec.fail<eo.Optional<BorderStyle>>('Unexpected value \'' + value + '\' for a border style.');
    }
}

export function isDisplayed(styles: CSSStyleDeclaration): boolean {
    return styles.display !== 'none' && styles.visibility !== 'hidden'
}

export interface BorderAccessor {
    colorOf(styles: CSSStyleDeclaration): string;
    styleOf(styles: CSSStyleDeclaration): string;
    widthOf(styles: CSSStyleDeclaration): string;
}

export var borderTopAccessor: BorderAccessor = {
    colorOf: styles => styles.borderTopColor,
    styleOf: styles => styles.borderTopStyle,
    widthOf: styles => styles.borderTopWidth
};

export var borderRightAccessor: BorderAccessor = {
    colorOf: styles => styles.borderRightColor,
    styleOf: styles => styles.borderRightStyle,
    widthOf: styles => styles.borderRightWidth
};

export var borderBottomAccessor: BorderAccessor = {
    colorOf: styles => styles.borderBottomColor,
    styleOf: styles => styles.borderBottomStyle,
    widthOf: styles => styles.borderBottomWidth
};

export var borderLeftAccessor: BorderAccessor = {
    colorOf: styles => styles.borderLeftColor,
    styleOf: styles => styles.borderLeftStyle,
    widthOf: styles => styles.borderLeftWidth
};

export function withBorder<r>(
    styles: CSSStyleDeclaration,
    accessor: BorderAccessor,
    haveStyles: (color: eo.Optional<Color>, style: eo.Optional<BorderStyle>, width: number) => r
): r {
    return haveStyles(
        tryParseColor(accessor.colorOf(styles)),
        parseBorderStyle(accessor.styleOf(styles)),
        en.toIntegerOrDie(accessor.widthOf(styles), 'Unable to get a width of a border.')
    );
}

export function tryParseColor(value: string): eo.Optional<Color> {
    let first = tryParseRgbColor(value);
    if (eo.isSome(first)) {
        return first;
    } else {
        let second = tryParseRgbaColor(value);
        if (eo.isSome(second)) {
            return second;
        } else {
            return eo.noneFrom(first.none + ' ' + second.none);
        }
    }
}

export function tryParseRgbColor(value: string): eo.Optional<Color> {
    var matches = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(value);
    if (matches != null) {
        var red = matches[1];
        var green = matches[2];
        var blue = matches[3];
        if (red != null && green != null && blue != null) {
            return eo.someFrom<Color>({
                red: en.toIntegerUnsafe(red),
                green: en.toIntegerUnsafe(green),
                blue: en.toIntegerUnsafe(blue),
                opacity: 1.0
            });
        } else {
            return eo.noneFrom(dueTo.invalidRgbValue);
        }
    } else {
        return eo.noneFrom(dueTo.invalidRgbValue);
    }
}

export function tryParseRgbaColor(value: string): eo.Optional<Color> {
    var matches = /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\,*\s(\d?\.?\d+)\s*\)/.exec(value);
    if (matches != null) {
        var red = matches[1];
        var green = matches[2];
        var blue = matches[3];
        var opacity = matches[4];
        if (red != null && green != null && blue != null && opacity != null) {
            return eo.someFrom<Color>({
                red: en.toIntegerUnsafe(red),
                green: en.toIntegerUnsafe(green),
                blue: en.toIntegerUnsafe(blue),
                opacity: en.toFloatUnsafe(opacity)
            });
        } else {
            return eo.noneFrom(dueTo.invalidRgbaValue);
        }
    } else {
        return eo.noneFrom(dueTo.invalidRgbaValue);
    }
}

export interface Color {
    red: number;
    green: number;
    blue: number;
    opacity: number;
}

export function formatColorAsHex6(color: Color): string {
    return '#' +
        ex.engraveRight('00', en.fromatAsHex(color.red)) +
        ex.engraveRight('00', en.fromatAsHex(color.green)) +
        ex.engraveRight('00', en.fromatAsHex(color.blue));
}

export function normalizeFloatAsText(value: string): string {
    return ex.startsWith(value, '.') ? '0' + value : value;
}


export function toPadding(styles: CSSStyleDeclaration): cs.SidesOf<usl.Length> {
    return cs.map({
        top: usl.tryParseLength(styles.paddingTop, 'Unable to get top padding.'),
        right: usl.tryParseLength(styles.paddingRight, 'Unable to get right padding.'),
        bottom: usl.tryParseLength(styles.paddingBottom, 'Unable to get bottom padding.'),
        left: usl.tryParseLength(styles.paddingLeft, 'Unable to get left padding.')
    }, value => eo.asSomeOrDie(value, 'Unable to get padding.'))
}

var dueTo = {
    invalidRgbValue: 'Invalid RGB value.',
    invalidRgbaValue: 'Invalid RGBA value.'
};


export function isUnderlined(styles: CSSStyleDeclaration): boolean {
    return styles.textDecoration === 'underline';
}

export const enum LineHeight {
    Normal
}

export interface ForLineHeight<r> {
    caseOfNormal: r;
}

var standardStringForLineHeight: ForLineHeight<string> = {
    caseOfNormal: 'normal'
};

export function lineHeightFromString(value: string): LineHeight {
    return lineHeightFromStringExt(value, standardStringForLineHeight);
}

export function lineHeightFromStringExt(value: string, stringForLineHeight: ForLineHeight<string>): LineHeight {
    switch (value) {
        case stringForLineHeight.caseOfNormal: return LineHeight.Normal;
        default: 'Unexpected value \'' + value + '\' for a line height.';
    }
}

export function forLineHeight<r>(value: LineHeight, result: ForLineHeight<r>): r {
    switch (value) {
        case LineHeight.Normal: return result.caseOfNormal;
        default: 'Unexpected case \'' + value + '\' of a line height.';
    }
}

export function lineHeightToString(value: LineHeight): string {
    return forLineHeight(value, standardStringForLineHeight);
}

export interface ViaLineHeightAlpha<Alpha, r> {
    caseOfNormal(alpha: Alpha): r;
}

export function lineHeightOutOf(styles: CSSStyleDeclaration): eo.Optional<usl.Length | string> {
    var value = styles.lineHeight;
    var asLength = usl.tryParseLength(value, 'Unable to get a line height.');
    if (eo.isSome(asLength)) {
        return asLength;
    } else {
        return eo.fromSome(
            lineHeightToString(
                lineHeightFromString(value)
            )
        );
    }
}

export function fontSizeOutOf(styles: CSSStyleDeclaration): eo.Optional<usl.Length> {
    return usl.tryParseLength(styles.fontSize, 'Unable to get a font size.');
}

export function textTransformationOutOf(styles: CSSStyleDeclaration): string {
    return styles.textTransform;
}

export function toEffectiveLineHeight(
    styles: CSSStyleDeclaration,
    normalLineHeightToFontSizeRatio: number
): eo.Optional<usl.Length> {
    var lineHeight = lineHeightOutOf(styles);
    if (eo.isSome(lineHeight)) {
        let length = lineHeight.some;
        if (typeof length === 'string') {
            return forLineHeight(lineHeightFromString(length), {
                caseOfNormal: () => {
                    var size = fontSizeOutOf(styles);
                    return eo.isSome(size)
                        ? eo.fromSome(usl.map(size.some, value => value * normalLineHeightToFontSizeRatio))
                        : size
                }
            })();
        } else {
            return eo.fromSome(length);
        }
    } else {
        return lineHeight;
    }
}