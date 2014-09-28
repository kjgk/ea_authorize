Ext.define('Ext.ux.form.DateTimeField', {
    extend: 'Ext.form.field.Date',
    alias: 'widget.datetimefield',
    format: 'Y-m-d',
    showSeconds: false,
    requires: ['Ext.ux.DateTimePicker'],

    initComponent: function () {
        this.format = this.format + ' ' + 'H:i' + (this.showSeconds ? ':s' : '');
        this.callParent();
    },

    triggerBlur: function () {
        this.setValue(this.value);
        this.callParent();
    },

    // overwrite
    createPicker: function () {
        var me = this, format = Ext.String.format;

        return Ext.create('Ext.ux.DateTimePicker', {
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            focusOnShow: true,
            minDate: me.minValue,
            maxDate: me.maxValue,
            disabledDatesRE: me.disabledDatesRE,
            disabledDatesText: me.disabledDatesText,
            disabledDays: me.disabledDays,
            disabledDaysText: me.disabledDaysText,
            format: me.format,
            showToday: me.showToday,
            startDay: me.startDay,
            minText: format(me.minText, me.formatDate(me.minValue)),
            maxText: format(me.maxText, me.formatDate(me.maxValue)),
            showSeconds: me.showSeconds,
            listeners: {
                scope: me,
                select: me.onSelect
            },
            keyNavConfig: {
                esc: function () {
                    me.collapse();
                }
            }
        });
    }
});