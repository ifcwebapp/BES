import ko = require('knockout');
interface LightboxManager {
    
}

interface Lightbox {
}

export function toLightbox(
    manager: LightboxManager,
    make: (close: () => void) => Lightbox
) : Lightbox {
    return {};
}

function withFirstThat<r>(
    element: HTMLElement,
    isThat: (element: HTMLElement) => boolean,
    haveThat: (element: HTMLElement) => r,
    haveNone: (reason: string) => r
) : r {
    for (var current = element; current != null; current = current.parentElement) {
        if (isThat(current)) {
            return haveThat(current);
        }
    }
    return haveNone('Unable to find an element.');
}