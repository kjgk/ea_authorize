Ext.define('withub.ext.base.SmartColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.smartcolumn',
    requires: ['Ext.util.Format'],
    displayType: DisplayType.Text,
    sortable: false,
    constructor: function () {

        var config = arguments[0];
        var me = this;
        var renderer = Ext.emptyFn();
        if (!config.renderer) {
            this.displayType = config.displayType || this.displayType;
            if (this.displayType.indexOf('Date') != -1) {
                this.align = config.align || 'center';
            }
            if (this.displayType == DisplayType.Number) {
                this.align = config.align || 'right';
            }

            if (this.displayType == DisplayType.Text) {
                renderer = RendererUtil.stringRenderer();
            } else if (this.displayType == DisplayType.DateDay) {
                renderer = RendererUtil.dateRenderer(DateFormat.DAY);
            } else if (this.displayType == DisplayType.DateHour) {
                renderer = RendererUtil.dateRenderer(DateFormat.HOUR);
            } else if (this.displayType == DisplayType.DateMinute) {
                renderer = RendererUtil.dateRenderer(DateFormat.MINUTE);
            } else if (this.displayType == DisplayType.DateSecond) {
                renderer = RendererUtil.dateRenderer(DateFormat.SECOND);
            } else if (this.displayType == DisplayType.Number) {
                renderer = RendererUtil.numberRenderer(config.format || '0,000');
            } else if (this.displayType == DisplayType.BooleanValue) {
                renderer = RendererUtil.booleanValueRenderer();
            } else if (this.displayType == DisplayType.URl){
                renderer = RendererUtil.URLRenderer();
            }

            if (config.prepareRenderer) {
                this.renderer = function (value, metaData , record, rowIndex, cellIndex, colIndex, store, view) {
                    var result = config.prepareRenderer.call(config.scope || me, value, metaData , record, rowIndex, cellIndex, colIndex, store, view);
                    return renderer.call(config.scope || me, result, metaData , record, rowIndex, cellIndex, colIndex, store, view);
                }
            } else {
                this.renderer = renderer;
            }
        }

        this.callParent(arguments);
    }
});