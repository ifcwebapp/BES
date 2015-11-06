
declare module 'html2canvas-svg' {
    var html2canvas: (element: HTMLElement, options: {
        onrendered(canvas: HTMLCanvasElement) : void,
        logging: boolean
    }) => any
    export = html2canvas;
}