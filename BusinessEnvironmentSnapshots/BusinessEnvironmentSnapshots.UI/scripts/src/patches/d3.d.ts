declare module D3 {
    
    interface TypedSelection<a> {
        use(use: (element: Element, data: a, index: number) => void): TypedSelection<a>;
        stylePer(toStyle: (data: a, index: number) => any): TypedSelection<a>;
        select(selector: string): TypedSelection<a>;
        selectAll(selector: string): TypedSelection<a>;
        data<b>(map: (value: a, index: number) => b[], toKey: (value: b) => string) : TypedSelection<b>;
        data<b>(map: (value: a, index: number) => b[]) : TypedSelection<b>;
        data(): a[];
        datum<b>(map: (value: a, index: number) => b[]) : Selection;
        datum() : a;
        enter(): TypedSelection<a>;
        append(tagName: string): TypedSelection<a>;
        length: number;
        attr(name: string, toValue: (value: a, index: number) => any): TypedSelection<a>;
        attr(toValue: (value: a, index: number) => any): TypedSelection<a>;
        attr(name: string, value: any): TypedSelection<a>;
        attr(name: string): string;
        attr(values: Object): TypedSelection<a>;

        classed(name: string): boolean;
        classed(name: string, value: a): TypedSelection<a>;
        classed(name: string, valueFunction: (data: a, index: number) => boolean): TypedSelection<a>;
        classed(classValueMap: Object): Selection;

        node(): Element;
        
        text(): string;
        text(text: string): TypedSelection<a>;
        text(toText: (value: a, index: number) => string): TypedSelection<a>;
        on(type: string): (data: a, index: number) => any;
        on(type: string, listener: (data: a, index: number) => any, capture?: boolean): TypedSelection<a>;
        
        style(name: string): string;
        style(name: string, valueFunction: (data: a, index: number) => any, priority?: string): TypedSelection<a>;
        style(name: string, value: any, priority?: string): TypedSelection<a>;
        style(toStyle: (data: a, index: number) => Object): TypedSelection<a>;
        style(styleValueMap: Object): TypedSelection<a>;
    }

    interface Selector<a> {
    }

    interface Selectors {
        select<a>(selector: string): TypedSelection<a>;
    }

    interface Selection {
        data<a>(values: a[], toKey: (value: a, index: number) => string): TypedSelection<a>;
        data<a>(values: a[]): TypedSelection<a>;
    }


}