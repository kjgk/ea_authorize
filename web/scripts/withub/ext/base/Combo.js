Ext.define('withub.ext.base.Combo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.basecombo',

    queryMode: 'local',
    displayField: 'label',
    valueField: 'value',
    editable: false,
    model: 'withub.ext.base.ComboModel',
    showAll: false,
    showNull: false,
    initComponent: function() {

        var autoLoad;
        if (Ext.isBoolean(this.autoLoad)) {
            autoLoad = this.autoLoad;
        } else {
            if (this.extraParams) {
                autoLoad = {
                    params: this.extraParams
                }
            } else {
                autoLoad = false;
            }
        }

        this.autoLoad = undefined;

        this.store = Ext.create('withub.ext.base.Store', {
            model: this.model,
            url: this.url,
            pageSize: this.pageSize,
            extraParams: this.extraParams,
            autoLoad: autoLoad
        });

        this.callParent();

        this.store.on('load', function(store, records, successful, operation, options) {
            if (this.showAll) {
                var record = Ext.ModelManager.create({value:'',label:'全部'}, 'withub.ext.base.ComboModel');
                this.store.insert(0, [record]);
                this.setValue('');
            }
            if (this.showNull) {
                record = Ext.ModelManager.create({value:'',label:'(无)'}, 'withub.ext.base.ComboModel');
                this.store.insert(0, [record]);
            }
            if (!Ext.isEmpty(this.value)) {
                this.setValue(this.value);
                this.clearInvalid();
            }
        }, this);
    },

    getStore: function() {
        return this.store;
    }
});

Ext.define('withub.ext.base.ComboModel', {
    extend: 'Ext.data.Model',
    fields: [
        'value',
        'label'
    ]
});