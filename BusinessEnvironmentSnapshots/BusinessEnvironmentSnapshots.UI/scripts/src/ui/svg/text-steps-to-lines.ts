import * as ec from 'essentials/core';
import * as ea from 'essentials/array';
import * as el from 'essentials/list';
import * as zs from 'ui/svg/text-steps';
import * as zl from 'ui/svg/text-lines';

export type Lines = el.List<zl.Line>;
export type Chunk = zl.Line;
export type Items = el.Node<zl.Item>;

function withLines<r>(
    chunks: Lines,
    haveNothing: (chunks: Lines) => Lines,
    haveNewborn: (chunks: Lines, chunk: Chunk) => Lines,
    haveMature: (chunks: Lines, chunk: Chunk, items: Items) => Lines
): el.List<zl.Line> {
    if (el.hasAny(chunks)) {
        // there is a at least one chunk in the making
        let chunk = chunks.value;
        let items = chunk.items;
        if (el.hasAny(items)) {
            // the chunk was created long ago it's time to cut it off and start a new one
            return haveMature(chunks, chunk, items);
        } else {
            // the chunk was just created, no items yet
            return haveNewborn(chunks, chunk);
        }
    } else {
        // there is nothing yet
        return haveNothing(chunks);
    }
}

export function toLines(
    steps: zs.Step[],
    defaultX: number,
    defaultY: number
): el.List<zl.Line> {
    return ea.fold(
        steps,
        el.toListOf<zl.Line>(),
        (lines, step) => zs.viaStep(step, {
            caseOfX: step => withLines(
                lines,
                // no lines yet, first one
                lines => el.add(
                    lines,
                    zl.toLine(step.x, defaultY)
                ),
                (lines, line) => {
                    line.x = step.x;
                    return lines;
                },
                (lines, previousLine) => el.add(
                    lines,
                    zl.toLine(step.x, previousLine.y)
                )
            ),
            caseOfY: step => withLines(
                lines,
                lines => el.add(
                    lines,
                    zl.toLine(defaultX, step.y)
                ),
                (lines, line) => {
                    line.y = step.y;
                    return lines;
                },
                lines => el.add(
                    lines,
                    zl.toLine(defaultX, step.y)
                )
            ),
            caseOfDX: step => withLines(
                lines,
                //no lines yet
                lines => el.add(lines, zl.toLine(defaultX + step.dx, defaultY)),
                // an empty line gets DX
                (lines, emptyLine) => {
                    emptyLine.x += step.dx;
                    return lines;
                },
                // a line with items gets some spacing
                (lines, currentLine, currentItems) => {
                    currentLine.items = el.add(currentItems, zl.spacingFrom(step.dx));
                    return lines;
                }
            ),
            caseOfDY: step => withLines(
                lines,
                lines => el.add(lines, zl.toLine(defaultX, defaultY + step.dy)),
                // an empty line gets DY
                (lines, emptyLine) => {
                    emptyLine.y += step.dy;
                    return lines;
                },
                // starting a new line thank to DY relative to the previous line which we have
                (lines, previousLine) => el.add(
                    lines,
                    zl.toLine(defaultX, previousLine.y + step.dy)
                )
            ),
            caseOfText: step => withLines(
                lines, 
                // situation of a text element with no positioning but some text
                lines => el.add(
                    lines,
                    zl.lineFrom(
                        defaultX,
                        defaultY,
                        el.fromOne(zl.wordFrom(step.text))
                    )
                ),
                // an empty line gets a word
                (lines, emptyLine) => {
                    emptyLine.items = el.fromOne(zl.wordFrom(step.text));
                    return lines;
                },
                (lines, currentLine, currentItems) => {
                    currentLine.items = el.add(currentItems, zl.wordFrom(step.text));
                    return lines;
                }
            )
        })
    );
}
