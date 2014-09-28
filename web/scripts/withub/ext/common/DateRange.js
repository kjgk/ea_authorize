Ext.define('withub.ext.common.DateRange', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.daterange',
    width: 200,
    height: 22,
    style: 'padding-top: 1px;',
    layout: {
        type: 'hbox',
        align: 'stretch'
    },
    beginDateName: 'startDate',
    endDateName: 'endDate',
    range: '-1y',
    defaultInterval : Date.DAY,

    initComponent: function() {
        var now = new Date(),endDate,beginDate,rangeValue,interval;

        if (!Ext.isEmpty(this.range)) {
            if (Ext.isString(this.range)) {
                this.range = this.range.toLowerCase();
                rangeValue = new Number(this.range);
                if (isNaN(rangeValue)) {
                    rangeValue = new Number(this.range.substring(0, this.range.length - 1));
                    interval = this.range.substring(this.range.length - 1, this.range.length);
                } else {
                    interval = this.defaultInterval;
                }
            } else if (Ext.isNumber(this.range)) {
                rangeValue = this.range;
                interval = this.defaultInterval;
            }
            if (interval == 'm') {
                interval = 'mo';
            }

            if (rangeValue > 0) {
                beginDate = now;
                endDate = Ext.Date.add(now, interval, rangeValue);
            } else {
                beginDate = Ext.Date.add(now, interval, rangeValue);
                endDate = now;
            }
        }


        this.beginTimeField = Ext.create('Ext.form.field.Date', {
            name: this.beginDateName,
            flex: 1,
            format: 'Y-m-d',
            showToday: true,
            value: beginDate ? Ext.Date.format(beginDate, 'Y-m-d') : undefined
        });

        this.endTimeField = Ext.create('Ext.form.field.Date', {
            name: this.endDateName,
            flex: 1,
            format: 'Y-m-d',
            showToday: true,
            value: endDate ? Ext.Date.format(endDate, 'Y-m-d') : undefined
        });

        this.items = [this.beginTimeField, {xtype: 'label', text: '至', style: 'padding: 2px;'} , this.endTimeField];

        this.callParent();
    },

    getBeginDate:function() {
        if (arguments.length > 0 && arguments[0] === true) {
            return this.beginTimeField.getValue();
        }
        return this.beginTimeField.getRawValue();
    },

    getEndDate:function() {
        if (arguments.length > 0 && arguments[0] === true) {
            return this.endTimeField.getValue();
        }
        return this.endTimeField.getRawValue();
    }
});