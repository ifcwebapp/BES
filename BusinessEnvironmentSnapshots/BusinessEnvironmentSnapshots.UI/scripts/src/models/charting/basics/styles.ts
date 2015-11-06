import er = require('essentials/runtime');
import ec = require('essentials/core');
import eo = require('essentials/optional');
import d3 = require('d3');

function renderNothing(): Symbol {
    return d3.svg.symbol().type('circle').size(2);
}

type Symbol = (datum: any, index: number) => string;

function renderCircle(): Symbol {
    return d3.svg.symbol().type('circle').size(30);
}
function renderCross(): Symbol {
    return d3.svg.symbol().type('cross').size(30);
}
function renderSquare(): Symbol {
    return d3.svg.symbol().type('square').size(30);
}
function renderTipDownTriangle(): Symbol {
    return d3.svg.symbol().type('triangle-down').size(30);
}
function renderTipUpTriangle(): Symbol {
    return d3.svg.symbol().type('triangle-up').size(30);
}
function renderDiamond(): Symbol {
    return d3.svg.symbol().type('diamond').size(30);
}
function renderStar(): Symbol {
    return d3.svg.symbol().type('cross').size(30);
}
function renderPentagon(): Symbol {
    return d3.svg.symbol().type('cross').size(30);
}

var series = [
    { line: { style: { 'stroke': '#1b9e77', 'fill': 'none' } }, area: { style: { 'fill': '#1395BA' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#1b9e77' } } },
    { line: { style: { 'stroke': '#d95f02', 'fill': 'none' } }, area: { style: { 'fill': '#F16C20' } }, shape: { shouldShowInLegend: true, toPath: renderCross, style: { 'fill': '#d95f02' } } },
    { line: { style: { 'stroke': '#7570b3', 'fill': 'none' } }, area: { style: { 'fill': '#0D3C55' } }, shape: { shouldShowInLegend: true, toPath: renderSquare, style: { 'fill': '#7570b3' } } },
    { line: { style: { 'stroke': '#e7298a', 'fill': 'none' } }, area: { style: { 'fill': '#EBC844' } }, shape: { shouldShowInLegend: true, toPath: renderTipDownTriangle, style: { 'fill': '#e7298a' } } },
    { line: { style: { 'stroke': '#66a61e', 'fill': 'none' } }, area: { style: { 'fill': '#A2B86C' } }, shape: { shouldShowInLegend: true, toPath: renderTipUpTriangle, style: { 'fill': '#66a61e' } } },
    { line: { style: { 'stroke': '#e6ab02', 'fill': 'none' } }, area: { style: { 'fill': '#C02E1D' } }, shape: { shouldShowInLegend: true, toPath: renderDiamond, style: { 'fill': '#e6ab02' } } },
    { line: { style: { 'stroke': '#a6761d', 'fill': 'none' } }, area: { style: { 'fill': '#5CA793' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#a6761d' } } },
    { line: { style: { 'stroke': '#666666', 'fill': 'none' } }, area: { style: { 'fill': '#D94E1F' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#666666' } } },
];
var sole = { line: { style: { 'stroke': '#03ADEC' } }, area: { style: { 'fill': '#03ADEC' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#03ADEC' } } };
var series1 = [
    { line: { style: { 'stroke': '#03ADEC', 'fill': 'none' } }, area: { style: { 'fill': '#03ADEC' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#03ADEC' } } }
];
var series2 = [
    { line: { style: { 'stroke': '#032F54', 'fill': 'none' } }, area: { style: { 'fill': '#032F54' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#032F54' } } },
    { line: { style: { 'stroke': '#03ADEC', 'fill': 'none' } }, area: { style: { 'fill': '#03ADEC' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#03ADEC' } } }
];
var series3 = [
    { line: { style: { 'stroke': '#032F54', 'fill': 'none' } }, area: { style: { 'fill': '#032F54' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#032F54' } } },
    { line: { style: { 'stroke': '#03ADEC', 'fill': 'none' } }, area: { style: { 'fill': '#03ADEC' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#03ADEC' } } },
    { line: { style: { 'stroke': '#D5D6D6', 'fill': 'none' } }, area: { style: { 'fill': '#D5D6D6' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#D5D6D6' } } },
];
var series4 = [
    { line: { style: { 'stroke': '#032F54', 'fill': 'none' } }, area: { style: { 'fill': '#032F54' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#032F54' } } },
    { line: { style: { 'stroke': '#03ADEC', 'fill': 'none' } }, area: { style: { 'fill': '#03ADEC' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#03ADEC' } } },
    { line: { style: { 'stroke': '#D5D6D6', 'fill': 'none' } }, area: { style: { 'fill': '#D5D6D6' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#D5D6D6' } } },
    { line: { style: { 'stroke': '#5B5B5B', 'fill': 'none' } }, area: { style: { 'fill': '#5B5B5B' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#5B5B5B' } } }
];
var series5 = [
    { line: { style: { 'stroke': '#032F54', 'fill': 'none' } }, area: { style: { 'fill': '#032F54' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#032F54' } } },
    { line: { style: { 'stroke': '#03ADEC', 'fill': 'none' } }, area: { style: { 'fill': '#03ADEC' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#03ADEC' } } },
    { line: { style: { 'stroke': '#0A5690', 'fill': 'none' } }, area: { style: { 'fill': '#0A5690' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#0A5690' } } },
    { line: { style: { 'stroke': '#A5A5A5', 'fill': 'none' } }, area: { style: { 'fill': '#A5A5A5' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#A5A5A5' } } },
    { line: { style: { 'stroke': '#D5D6D6', 'fill': 'none' } }, area: { style: { 'fill': '#D5D6D6' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': '#D5D6D6' } } }
];

var country =
    { line: { style: { 'stroke': '#0D7CC3', 'fill': 'none', 'stroke-width': 2, 'stroke-dasharray': '' } }, shape: { shouldShowInLegend: true, toPath: renderCircle, style: { 'fill': 'white', 'stroke': '#0D7CC3', 'stroke-width': 2, 'stroke-dasharray': '' } } };
var region =
    { line: { style: { 'stroke': '#666666', 'fill': 'none', 'stroke-width': 2, 'stroke-dasharray': '' } }, shape: { shouldShowInLegend: false, toPath: renderNothing, style: { 'fill': '#666666', 'stroke': '', 'stroke-width': 0, 'stroke-dasharray': '' } } };
var comparators = [
    { line: { style: { 'stroke': '#68BFF6', 'fill': 'none', 'stroke-width': 1, 'stroke-dasharray': '' } }, shape: { shouldShowInLegend: false, toPath: renderNothing, style: { 'fill': '#68BFF6', 'stroke': '', 'stroke-width': 0, 'stroke-dasharray': ''} } },
    { line: { style: { 'stroke': '#68BFF6', 'fill': 'none', 'stroke-width': 1, 'stroke-dasharray': '10, 10' } }, shape: { shouldShowInLegend: false, toPath: renderNothing, style: { 'fill': '#68BFF6', 'stroke': '', 'stroke-width': 0, 'stroke-dasharray': '' } } },
    { line: { style: { 'stroke': '#68BFF6', 'fill': 'none', 'stroke-width': 1, 'stroke-dasharray': '5, 5' } }, shape: { shouldShowInLegend: false, toPath: renderNothing, style: { 'fill': '#68BFF6', 'stroke': '', 'stroke-width': 0, 'stroke-dasharray': '' } } },
    { line: { style: { 'stroke': '#68BFF6', 'fill': 'none', 'stroke-width': 1, 'stroke-dasharray': '2, 2' } }, shape: { shouldShowInLegend: false, toPath: renderNothing, style: { 'fill': '#68BFF6', 'stroke': '', 'stroke-width': 0, 'stroke-dasharray': '' } } },
    { line: { style: { 'stroke': '#68BFF6', 'fill': 'none', 'stroke-width': 1, 'stroke-dasharray': '20, 10' } }, shape: { shouldShowInLegend: false, toPath: renderNothing, style: { 'fill': '#68BFF6', 'stroke': '', 'stroke-width': 0, 'stroke-dasharray': '' } } },
    { line: { style: { 'stroke': '#68BFF6', 'fill': 'none', 'stroke-width': 1, 'stroke-dasharray': '10, 5' } }, shape: { shouldShowInLegend: false, toPath: renderNothing, style: { 'fill': '#68BFF6', 'stroke': '', 'stroke-width': 0, 'stroke-dasharray': '' } } },
    { line: { style: { 'stroke': '#68BFF6', 'fill': 'none', 'stroke-width': 1, 'stroke-dasharray': '10, 5, 2, 5, 10' } }, shape: { shouldShowInLegend: false, toPath: renderNothing, style: { 'fill': '#68BFF6', 'stroke': '', 'stroke-width': 0, 'stroke-dasharray': '' } } }
]

var axisColor = '#777';

var base = {
    height: 250,
    format: {
        time: {
            asYear: d3.time.format('%Y')
        }
    },
    referenceLine: {
        styles: {
            'stroke-width': 1,
            'stroke': axisColor,
            'shape-rendering': 'crispEdges',
            'stroke-dasharray': '1 2'
        }
    },
    margin: { top: 15, right: 20, bottom: 35, left: 50 },
    // http://ux.stackexchange.com/questions/17964/how-many-visually-distinct-colors-can-accurately-be-associated-with-a-separate
    // http://ux.stackexchange.com/questions/16520/how-can-i-choose-a-colour-palette-for-multiple-data-visualization-types
    series: {
        fit: [undefined, series1, series2, series3, series4, series5, series, series, series, series, series, series, series, series],
        sole: sole,
        country: country,
        region: region,
        dashed: {
            country: er.mostlyLike(country, but => {
                but.line.style['stroke-dasharray'] = '2 2';
                but.shape.style['stroke-dasharray'] = '1 1';
            }),
            region: er.mostlyLike(region, but => {
                but.line.style['stroke-dasharray'] = '2 2';
            })
        },
        comparators: comparators
    },
    bar: {
        thickness: 5
    },
    charts: {
        radial: {
            axis: {
                style: {
                    'stroke': axisColor,
                    'stroke-dasharray': '1,2'
                }
            },
            backdrop: {
                style: {
                    'fill': 'none',
                    'stroke': '#777',
                    'stroke-width': '1',
                    'stroke-dasharray': '1,2'
                }
            }
        }
    },
    axis: {
        style: {
            'shape-rendering': 'crispEdges'
        },
        line: {
            style: {
                'fill': 'none',
                'stroke': axisColor
            }
        },
        domain: {
            style: {
                'fill': 'none',
                'stroke': axisColor
            }
        },
        label: {
            style: {
                'font-size': '10px'
            }
        },
        valueable: {
            isNice: true,
            vertical: {
                label: {
                    offset: 40
                }
            },
            horizontal: {
                label: {
                    offset: 25
                }
            },
            tick: { size: 4 },
            label: {
                offset: { x: 0, y: 0 },
                wrapping: eo.fromSome({
                    maxLabelLength: eo.fromNoneOf<number>('Should be calulated automaticaly.')
                }),
                angle: 0
            },
            hasSubdividedTicks: true
        },
        categorial: {
            isNice: false,
            vertical: {
                label: {
                    offset: <number>undefined
                }
            },
            horizontal: {
                label: {
                    offset: <number>undefined
                }
            },
            tick: { size: 4 },
            label: {
                offset: { x: 0, y: 0 },
                wrapping: eo.fromSome({
                    maxLabelLength: eo.fromNoneOf<number>('Should be calulated automaticaly.')
                }),
                angle: 0
            },
            hasSubdividedTicks: false
        }
    },
    noSymbol: renderNothing
};
export = base; 


