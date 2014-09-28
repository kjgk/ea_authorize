Ext.define('withub.ext.base.ComboModel', {
    extend: 'Ext.data.Model',
    fields: [
        'value',
        'label'
    ]
});

Ext.define('withub.ext.base.ArrayCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.arraycombo',
    queryMode: 'local',
    displayField: 'label',
    valueField: 'value',
    editable: false,
    model: 'withub.ext.base.ComboModel',
    showAll: false,
    showNull: false,
    idProperty: 'value',

    initComponent: function () {

        this.data = this.data || {};
        this.data = Ext.clone(this.data);
        var data = [];
        if (Ext.isEmpty(this.depend)) {
            if (Ext.isObject(this.data)) {
                for (var key in this.data) {
                    var item = this.data[key];
                    data.push({
                        value: key,
                        label: Ext.isArray(item) ? item[0] : item
                    });
                }
            } else {
                data = this.data
            }

            if (this.showAll === true) {
                Ext.Array.insert(data, 0, [
                    {value: '', label: '全部'}
                ]);
            }

            if (this.showNull === true) {
                data.push({value: '', label: '无'});
            }
        }

        this.store = Ext.create('Ext.data.Store', {
            model: this.model,
            data: data
        });

        this.callParent();

        if (!Ext.isEmpty(this.depend)) {
            var depend = Ext.getCmp(this.depend);
            depend.on('change', function (field, value) {
                data = [];
                this.setValue(null);
                this.getStore().removeAll();
                if (Ext.isObject(this.data)) {
                    for (var key in this.data) {
                        var item = this.data[key];
                        if (item[1] == value) {
                            data.push({
                                value: key,
                                label: item[0]
                            });
                        }
                    }
                } else {
                    Ext.each(this.data, function (item) {
                        if (item['parent'] == value) {
                            data.push(item);
                        }
                    });
                }
                this.getStore().loadData(data);
            }, this);

            var value = this.getValue();
            var parent = '';
            if (!Ext.isEmpty(value)) {
                if (Ext.isObject(this.data)) {
                    for (var key in this.data) {
                        if (this.getValue() == key) {
                            parent = this.data[key][1];
                            break;
                        }
                    }
                } else {
                    Ext.each(this.data, function (item) {
                        if (this.getValue() == item.value) {
                            parent = item.parent;
                            return false;
                        }
                    });
                }
                depend.setValue(parent + '');
                this.setValue(value);
            }
        }
    }
});