export function valueOf<a>(anything: { value: a; }) : a {
    return anything.value;
}
export function valuesOf<a>(anything: { values: a; }) : a {
    return anything.values;
}
export function fromOf<a>(anything: { from: a; }) : a {
    return anything.from;
}
export function toOf<a>(anything: { to: a; }) : a {
    return anything.to;
}
export function minOf<a>(anything: { min: a; }) : a {
    return anything.min;
}
export function maxOf<a>(anything: { max: a; }) : a {
    return anything.max;
}
export function categoryOf<a>(anything: { category: a; }) : a {
    return anything.category;
}
export function nameOf<a>(anything: { name: a; }) : a {
    return anything.name;
}
export function alwaysValueOf<a>(): (value: { value: a; }) => a  {
    return valueOf;
}