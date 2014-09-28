Ext.define('withub.ext.common.CodeCombo', {
    extend: 'withub.ext.base.Combo',
    alias: 'widget.codecombo',

    model: 'withub.ext.base.CodeComboModel',
    url: '/system/code/listCodeByCodeColumn',
    codeTags: null,

    initComponent: function() {

        this.extraParams = {
            codeColumnTag: this.codeColumnTag
        };

        this.callParent();

        this.store.on('load', function(store, records, successful, operation, options) {
            // 设定默认选中
            if (Ext.isEmpty(this.value)) {
                Ext.each(records, function(record) {
                    if (this.defaultCodeTag == record.get('codeTag')) {
                        this.setValue(record.get(this.valueField));
                        return false;
                    }
                    if (record.get('defaultValue') && this.value == undefined) {
                        this.setValue(record.get(this.valueField));
                        return true;
                    }
                }, this);
            }

            //
            if (!Ext.isEmpty(this.codeTags)) {
                var codeTags = this.codeTags.join(',');
                Ext.each(records, function(record) {
                    if (codeTags.indexOf(record.get('codeTag')) == -1) {
                        store.remove(record);
                    }
                }, this);
            }
        }, this);
    }
});

Ext.define('withub.ext.base.CodeComboModel', {
    extend: 'Ext.data.Model',
    fields: [
        'value',
        'label',
        'codeTag',
        {name: 'defaultValue', type: 'boolean', mapping: 'checked'}
    ]
});