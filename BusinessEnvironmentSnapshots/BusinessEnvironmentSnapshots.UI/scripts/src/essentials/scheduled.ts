import ec = require('essentials/core');

export type Scheduled = { handler: number; }

export function toScheduled() : Scheduled { return { handler: 0 }; }

export function reschedule(scheduled: Scheduled, delay: number, act: ec.Act) : void {
    cancel(scheduled);
    scheduled.handler = setTimeout(act, delay);
}

export function cancel(scheduled: Scheduled): void {
    if (scheduled.handler) {
        clearTimeout(scheduled.handler);
        scheduled.handler = 0;
    }
}