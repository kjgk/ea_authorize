Ext.define('withub.ext.base.CheckboxGroup', {
    extend: 'Ext.form.CheckboxGroup',
    alias: 'widget.basecheckboxgroup',
    valueField: 'value',
    displayField: 'label',
    initComponent: function() {
        var items = new Array();
        ExtUtil.request({
            async: false,
            url: this.url,
            params: this.params,
            success: function(result) {
                Ext.each(result.items, function(item, index) {
                    items[index] = {
                        name: this.name,
                        inputValue: item[this.valueField],
                        boxLabel: item[this.displayField],
                        checked: item.checked
                    }
                }, this)
            },
            scope:this
        });
        this.name = undefined;
        this.items = items;
        this.callParent();
    }
});
