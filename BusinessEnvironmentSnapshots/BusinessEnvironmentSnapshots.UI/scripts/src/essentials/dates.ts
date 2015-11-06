export function isFirstOlder(first: Date, second: Date) : boolean {
    return first.getTime() < second.getTime();
}

export function isFirstMoreRecent(first: Date, second: Date) : boolean {
    return first.getTime() > second.getTime();
}