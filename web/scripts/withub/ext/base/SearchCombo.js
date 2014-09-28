Ext.define('withub.ext.base.SearchCombo', {
    extend: 'withub.ext.base.Combo',
    alias: 'widget.basesearchcombo',

    queryMode: 'remote',
    typeAhead: false,
    hideTrigger: true,
    editable: true,
    minChars: 1,
    queryParam: 'keyword',
    autoLoad: false,

    initComponent: function() {
        this.listConfig = this.listConfig || {
            loadingText: '检索中...',
            emptyText: '没有数据.',
            getInnerTpl: function() {
                return '<a>' + '{label}' + '</a>';
            }
        };
        this.callParent();
        this.store.on('load', function(store, records, successful, operation, options) {
            Ext.each(records, function(record) {
                if (record.get(this.displayField) == this.getRawValue()) {
                    this.setValue(record.get(this.valueField));
                    if (records.length == 1) {
                        this.collapse();
                    }
                    return false;
                }
            }, this);
        }, this);
    },

    getErrors: function(value) {
        var me = this, errors = me.callParent(arguments);
        if (errors.length > 0) {
            return errors;
        }
        if (me.getDisplayValue() !== me.getRawValue()) {
            errors.push('"' + me.getRawValue() + '"' + '不存在，请在检索结果中选择。')
        }
        return errors;
    },

    setValue: function(value) {
        var me = this, record;
        if (Ext.isArray(value) && Ext.isObject(value[0])) {
            record = value[0];
        } else {
            record = me.findRecordByValue(value);
        }
        if (Ext.isEmpty(value) || record) {
            me.callParent(arguments);
        } else {
            this.value = value;
            me.store.load({
                params: {
                    objectId: value
                },
                scope: this
            });
        }
        return me;
    }
});