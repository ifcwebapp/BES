interface PDFPageOptions {
    size?: string|[number, number];
    /** portrait | * */
    layout?: string;
    margin?: number;
    margins?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}

interface PDFImageOptions {
    width?: number;
    height?: number;
    /** center | bottom | * */
    valign?: string;
    /** center | right | * */
    fit?: [number, number];
    stretch?: [number, number];
    align?: string;
}

interface PDFTextOptions {
    lineBreak?: boolean;
    /** 0 */
    columns?: number;
    /** 18: 1/4 inch */
    columnGap?: number;
    /** 0 */
    lineGap?: number;
    /** left | right | center | justify */
    align?: string;
    lineWidth?: number;
    wordCount?: number;
    link?: string;
    underline?: boolean;
    strike?: boolean;
    stroke?: string;
    fill?: string;
    width?: number;
    characterSpacing?: number;
    wordSpacing?: number;
    indent?: number;
    ellipsis?: number;
    height?: number;
}

interface PDFDocument {
    widthOfString(text: string, options?: any): number;
    heightOfString(text: string, options?: any): number;
    moveTo(x: number, y: number): PDFDocument;
    lineTo(x: number, y: number): PDFDocument;
    /** WARNING: Impossible to add opacity.
        If color is provided then `strokeColor` is called first. */
    stroke(color?: string): void;
    /** WARNING: Impossible to specify opacity.
        If color is provided then `fillColor` is called first. 
        @param rule 'even-odd'|'non-zero' */
    fill(value?: string, rule?: string): PDFDocument;
    /** WARNING: Impossible to add opacity.
        @param rule 'even-odd'|'non-zero' */
    fillAndStroke(fill?: string, stoke?: string, rule?: string): PDFDocument;
    rect(x: number, y: number, width: number, height: number): PDFDocument;
    lineWidth(value: number): PDFDocument;
    /** WARNING: Overwrites stroke opacity with null!!! */
    fillOpacity(value: number): PDFDocument;
    fillColor(value: string/*, opacity?: number */): PDFDocument;
    /** The only true (undestood by PDF) way to deal with opacities is to set them both at the same time. */
    _doOpacity(fillOpacityOpt: number, strokeOpacityOpt: number): PDFDocument;
    strokeColor(value: string/*, opacity?: number */): PDFDocument;
    // USELESS: opacity(value: number): PDFDocument;
    /** WARNING: Overwrites fill opacity with null!!! */
    strokeOpacity(value: number): PDFDocument;
    roundedRect(x: number, y: number, width: number, height: number, radius: number): PDFDocument;
    addPage(options: PDFPageOptions): PDFDocument;
    currentLineHeight(includeGap?: boolean): number;
    circle(x: number, y: number, radius: number): PDFDocument;
    path(path: string): PDFDocument;
    image(dataUrl: string, x: number, y: number, options?: PDFImageOptions): PDFDocument;
    pipe(stream: any): Stream;
    font(registration: string): PDFDocument;
    fontSize(value: number): PDFDocument;
    text(value: string, x?: number, y?: number, options?: PDFTextOptions, lineCallback?: Function): void;
    /** Same as `text` but without wrapping and other shit. */
    _fragment(value: string, x: number, y: number, options: PDFTextOptions): void;
    end(): void;
    dash(value: number, options: { space: number; phase: number; }): PDFDocument;
    undash(): PDFDocument;

    /** If a transformation is going to be reverted use `save` before it and `restore` after. */
    save(): PDFDocument;
    /** Consider using `save`/`restore` if the transformation is temporary. */
    transform(m11: number, m12: number, m21: number, m22: number, dx: number, dy: number): PDFDocument;
    /** Consider using `save`/`restore` if the transformation is temporary. */
    translate(x: number, y: number): PDFDocument;
    /** Consider using `save`/`restore` if the transformation is temporary. */
    rotate(angle: number, origin?: [number, number]): PDFDocument;
    /** Consider using `save`/`restore` if the transformation is temporary. */
    scale(sx: number, sy: number): PDFDocument;
    /** Counter-part of the `save` method. If a transformation (`tranform`, `translate`, `rotate`) is going to be reverted use `save` before it and `restore` after. */
    restore(): PDFDocument;
}

interface PDFDocumentOptions extends PDFPageOptions {
    //autoFirstPage: boolean;
    compress: boolean;
    info: {
        Producer: string;
        Creator: string;
        CreationDate: Date;
        Title: string;
        Author: string;
        Subject: string;
        Keywords: string;
        ModDate: Date;
    }
}

declare module 'pdf-kit' {

    interface PDFDocumentStatic {
        new (
            options: PDFDocumentOptions,
            sanitize: (value: number) => number
        ): PDFDocument;
    }
    var a: PDFDocumentStatic;
    export = a;
}