declare module jasmine {
    interface Matchers {
        toEqual(expected: any, message?: string): boolean;
    }
} 