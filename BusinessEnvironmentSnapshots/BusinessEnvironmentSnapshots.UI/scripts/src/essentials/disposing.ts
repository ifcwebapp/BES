export interface Node {
    value: any;
    previous: Node;
    next: Node;
    list: Disposables;
    dispose: (value: any) => void;
}

export interface Disposables {
    first: Node;
    last: Node;
    dispose: () => void
}

function disposablesFrom(dispose: () => void): Disposables {
    return {
        first: null,
        last: null,
        dispose: dispose
    };
}

function append<a>(list: Disposables, value: a, dispose: (value: a) => void): Node {
    return list.last != null
        ? list.last = list.last.next = {
            previous: list.last,
            next: <Node> null,
            value: value,
            list: list,
            dispose: dispose
        }
        : list.first = list.last = {
            previous: null,
            next: null,
            value: value,
            list: list,
            dispose: dispose
        };
}

function remove<a>(node: Node) {
    if (node.dispose == null) { return; }
    node.dispose(node.value);
    node.dispose = null;
    node.value = null;
    var list = node.list;
    if (list.first === node) {
        if (list.last === node) {
            list.first = list.last = null;
        } else {
            list.first = node.next;
            list.first.previous = null;
        }
    } else {
        if (list.last === node) {
            list.last = node.previous;
            list.last.next = null;
        } else {
            if (node.next != null) {
                node.next.previous = node.previous;
            }
            if (node.previous != null) {
                node.previous.next = node.next;
            }
        }
    }
    node.previous = null;
    node.next = null;
    node.list = null;
    list = null;
}

export function branch(disposables: Disposables) : Disposables {
    var result = disposablesFrom(() => {
        if (node != null) {
            remove(node);
            node = null;
        }
    });
    var node = append(disposables, result, dispose);
    return result;
}

export function dispose<a>(disposables: Disposables): void {
    if (disposables.dispose == null) { return; }
    var node = disposables.first;
    while (node != null) {
        var next = node.next;
        remove(node);
        node = next;
    }
    disposables.dispose();
    disposables.dispose = null;
    disposables.first = null;
    disposables.last = null;
}