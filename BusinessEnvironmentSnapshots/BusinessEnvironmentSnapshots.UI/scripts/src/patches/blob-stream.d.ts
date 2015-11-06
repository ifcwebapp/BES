interface Stream {
    on(name: string, handler: () => void): void;
    toBlob(mimeType: string): Blob;
    toBlobURL(mimeType: string): string;
}

declare module 'blob-stream' {
    
    var a : () => any;
    export = a;
} 