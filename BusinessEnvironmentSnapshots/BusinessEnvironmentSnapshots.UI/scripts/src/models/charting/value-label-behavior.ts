import esch = require('essentials/scheduled');

export interface ValueLabelBehaviorContext {
    containerElement: HTMLElement;
    label: D3.Selection;
    scheduled: {
        showing: esch.Scheduled;
        hiding: esch.Scheduled;
    };
    lastElementOpt: Element;
}

export function toValueLabelBehaviorContext(
    containerElement: HTMLElement
) : ValueLabelBehaviorContext {
    return {
        containerElement: containerElement,
        label: d3.select(containerElement).append('div').attr('class', 'chart-label'),
        scheduled: {
            showing: esch.toScheduled(),
            hiding: esch.toScheduled()
        },
        lastElementOpt: null
    };
}

export function enableValueLabelBehavior<a>(
    selection: D3.TypedSelection<a>,
    context: ValueLabelBehaviorContext,
    valueSuffixOpt: string,
    formatPoint: (point: a, valueSuffixOpt: string) => string,
    toLabeledElement: (element: Element) => Element,
    toOutlinedElement: (element: Element) => Element
) : void {
    selection
    .on('mouseover', function(data) {
        var element = <Element> this;
        var labeledElement = toLabeledElement(element);
        var pointAt = labeledElement.getBoundingClientRect();

        var containerAt = context.containerElement.getBoundingClientRect();    
        var left = pointAt.left - containerAt.left;
        var top = pointAt.top - containerAt.top;
        var width = pointAt.right - pointAt.left;
        var height = pointAt.bottom - pointAt.top;
        var x = left + width;
        var y = top + height / 2;
                                        
        esch.cancel(context.scheduled.showing);
        esch.reschedule(context.scheduled.hiding, 0, function() {
            context.label
            .style('left', x  + 'px')
            .style('top', y + 'px' )
            .style('display', 'block')
            .text(() => formatPoint(data, valueSuffixOpt));
            if (context.lastElementOpt != null) {
                
                d3.select(toOutlinedElement(context.lastElementOpt)).classed('as-hovered', false);
                d3.select(context.lastElementOpt).style('z-index', '0');
            }
            d3.select(toOutlinedElement(element)).classed('as-hovered', true);
            d3.select(element).style('z-index', '1');
            context.lastElementOpt = element;
        });
    })
    .on('mouseout', function(data) {
        var pointElement = <Element> this;
        esch.cancel(context.scheduled.showing);
        esch.reschedule(context.scheduled.hiding, 3000, function() {
            context.label.style('display', 'none');
            if (context.lastElementOpt != null) {
                d3.select(context.lastElementOpt).classed('as-hovered', false);
            }
        })
    });
}