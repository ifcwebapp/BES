import * as eo from 'essentials/optional';

export type State = FillAndStrokeState
| FillState | StrokeState | LineWidthState
| TranslateByState | RotateByState | ScaleByState | FontSizeState
| LineDashnessState | LinkState | FontStyleState | WordSpacingState | LetterSpacingState;

export type Snapshot = FillState
& StrokeState & LineWidthState
& FontSizeState & LineDashnessState
& TranslateByState & RotateByState & ScaleByState
& LinkState & FontStyleState & WordSpacingState & LetterSpacingState;


export interface LinkState {
    link: eo.Optional<string>;
}
export function isLinkState(state: State): state is LinkState {
    return (<LinkState> state).link != null;
}


export interface Dashness {
    dashLength: number;
    gapLength: number;
    phase: number;
}
export interface LineDashnessState {
    lineDashness: eo.Optional<Dashness>;
}
export function isLineDashnessState(state: LineDashnessState): state is LineDashnessState {
    return (<LineDashnessState> state).lineDashness != null;
}

export interface FontStyleState {
    isBold: boolean;
    isItalic: boolean;    
}

export function isFontStyleState(state: State): state is FontStyleState {
    return (<FontStyleState> state).isBold != null;
}


export interface WordSpacingState {
    wordSpacing: eo.Optional<number>;
}

export function isWordSpacingState(state: State) : state is WordSpacingState {
    return (<WordSpacingState> state).wordSpacing != null;
}

export interface LetterSpacingState {
    letterSpacing: eo.Optional<number>;
}

export function isLetterSpacingState(state: State): state is LetterSpacingState {
    return (<LetterSpacingState> state).letterSpacing != null;
}

export interface FontSizeState {
    fontSize: number;
}
export function isFontSizeState(state: State): state is FontSizeState {
    return (<FontSizeState> state).fontSize != null;
}


export interface TranslateByState {
    x: number;
    y: number;
}
export function isTranslateByState(state: State): state is TranslateByState {
    return (<TranslateByState> state).x != null;
}


export interface ScaleByState {
    sx: number;
    sy: number;
}
export function isScaleByState(state: State): state is ScaleByState {
    return (<ScaleByState> state).sx != null;
}


export interface RotateByState {
    a: number;
}
export function isRotateByState(state: State): state is RotateByState {
    return (<RotateByState> state).a != null;
}


export module FillAndStrokeState {
    export const enum Brand { }
}
export interface FillAndStrokeState {
    'a brand': FillAndStrokeState.Brand;
    fillColor: string;
    fillOpacity: number;
    strokeColor: string;
    strokeOpacity: number;
}
export function isFillAndStroke(state: State): state is FillAndStrokeState {
    return 'fillColor' in <any>state && 'strokeColor' in <any>state;
}


export interface FillState {
    fillColor: string;
    fillOpacity: number;
}
export function isFillState(state: State): state is FillState {
    return 'fillColor' in <any>state && !('strokeColor' in <any>state);
}


export interface StrokeState {
    strokeColor: string;
    strokeOpacity: number;
}
export function isStrokeState(state: State): state is StrokeState {
    return 'strokeColor' in <any>state && !('fillColor' in <any>state);
}


export interface LineWidthState {
    lineWidth: number;
}
export function isLineWidth(state: State): state is LineWidthState {
    return (<LineWidthState> state).lineWidth != null;
}

