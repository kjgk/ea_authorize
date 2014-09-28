Ext.define('withub.ext.common.DateTimeField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.datetimefield',
    layout: 'hbox',
    height: 22,
    allowBlank: true,

    initComponent: function() {

        this.dateField = Ext.create('Ext.form.field.Date', {
            format: 'Y-m-d',
            allowBlank: this.allowBlank,
            name: this.name,
            submitValue: false,
            dateFieldSign: true,
            flex: 1
        });

        this.timeField = Ext.create('Ext.form.field.Time', {
            increment: 30,
            format: 'H:i',
            allowBlank: this.allowBlank,
            name: this.name,
            submitValue: false,
            timeFieldSign: true,
            flex: 1
        });

        this.items = [
            this.dateField,
            {
                xtype: 'splitter'
            },
            this.timeField
        ];

        this.callParent();

        if (this.value != undefined) {
            this.setValue(this.value);
        }
    },

    getValue: function() {
        return new Date(this.dateField.getRawValue() + ' ' + this.timeField.getRawValue());
    },

    setValue: function(dateTime) {
        var value;
        if (Ext.isString(dateTime)) {
            value = new Date(dateTime);
        } else {
            value = dateTime;
        }
        this.value = value;
        this.dateField.setValue(value);
        this.timeField.setValue(value);
    }
});

