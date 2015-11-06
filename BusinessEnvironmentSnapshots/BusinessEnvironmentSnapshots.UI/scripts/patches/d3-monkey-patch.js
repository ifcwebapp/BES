define(['require', 'exports', 'd3-original'], function (require, exports, d3) {
    d3.selection.prototype.use = function (use) {
        return this.each(function (node, data, i, j) {
            use(this, node, data, i, j);
        });
    };
    d3.selection.prototype.stylePer = function (toStyle) {
        return this.use(function (node, data, index) {
            d3.select(node).style(toStyle(data, index));
        });
    };
    return d3;
});