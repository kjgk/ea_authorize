Ext.define('withub.ext.common.SimpleSearchField', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.simplesearchfield',

    enableKeyEvents: true,
    queryDelay: 10,
    queryProperty: 'name',
    submitValue: false,
    url: '/system/metadata/searchEntity',

    initComponent: function () {
        this.initDv();
        this.doQueryTask = Ext.create('Ext.util.DelayedTask', this.doRawQuery, this);
        this.callParent();
    },

    initEvents: function () {
        var me = this;
        me.callParent();
        me.mon(me.inputEl, 'keyup', me.onKeyUp, me);
    },

    onKeyUp: function (e, t) {
        var me = this, key = e.getKey();
        me.lastKey = key;
        if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
            this.doQueryTask.delay(me.queryDelay);
        }
        me.callParent(arguments);
    },

    onFocus: function () {

        if (!this.isExpanded) {
            this.expand();
            this.inputEl.focus(100)
        }
    },

    collapse: function () {
        this.callParent();
        this.refreshRawValue();
    },

    expand: function () {

        var me = this;
        me.setRawValue('');
        me.dv1.getStore().removeAll();
        me.callParent();
    },

    doRawQuery: function () {
        this.doQuery(this.getRawValue());
    },

    doQuery: function (keyword) {
        this.dv1.getStore().load({
            params: {
                keyword: keyword
            }
        });
    },

    initDv: function () {
        this.dv1 = Ext.create('Ext.view.View', {
            store: Ext.create('withub.ext.base.Store', {
                url: this.url,
                model: 'SimpleSearchModel',
                extraParams: {
                    queryProperty: this.queryProperty,
                    entity: this.entity
                }
            }),
            tpl: new Ext.XTemplate(
                '<tpl for="."><div class="search-item">',
                '<h3>&nbsp;&nbsp;{label}&nbsp;&nbsp;</h3>',
                '</div></tpl>'
            ),
            style: 'padding: 5px 0px 5px 5px;',
            trackOver: true,
            multiSelect: true,
            overItemCls: 'search-item-over',
            itemSelector: 'div.search-item',
            flex: 1
        });

        this.dv2 = Ext.create('Ext.view.View', {
            store: Ext.create('withub.ext.base.Store', {
                url: this.url,
                model: 'SimpleSearchModel',
                extraParams: {
                    queryProperty: this.queryProperty,
                    entity: this.entity
                }
            }),
            tpl: new Ext.XTemplate(
                '<tpl for="."><div class="search-item">',
                '<h3>&nbsp;&nbsp;{label}&nbsp;&nbsp;</h3>',
                '</div></tpl>'
            ),
            trackOver: true,
            multiSelect: true,
            overItemCls: 'search-item-over',
            itemSelector: 'div.search-item',
            width: 120
        });
    },

    createPicker: function () {

        var store1 = this.dv1.getStore(), store2 = this.dv2.getStore(), me = this;

        this.dv1.on('itemdblclick', function (view, record, item, index) {
            var sel = true;
            store2.each(function (r) {
                if (r.get('value') == record.get('value')) {
                    sel = false;
                    return false;
                }
            });
            if (sel) {
                store2.add(record);
            }
            store1.remove(record);
            this.collapse();
        }, this);

        this.dv2.on('itemdblclick', function (view, record, item, index) {
            var sel = true;
            store1.each(function (r) {
                if (r.get('value') == record.get('value')) {
                    sel = false;
                    return false;
                }
            });
            if (sel) {
                store1.add(record);
            }
            store2.remove(record);
        }, this);

        var panel = Ext.create('Ext.Panel', {
            layout: 'hbox',
            pickerField: me,
            ownerCt: me.ownerCt,
            renderTo: document.body,
            floating: true,
            hidden: true,
            items: [this.dv1, {xtype: 'splitter'}, {
                xtype: 'fieldset',
                title: '已选列表',
                height: 240,
                style: {
                    marginRight: '5px'
                },
                items: [this.dv2]
            }]
        });
        return panel;
    },

    refreshRawValue: function () {
        var label = new Array();
        this.dv2.getStore().each(function (record, index) {
            label += (index == 0 ? '' : ',') + record.get('label');
        }, this);
        this.setRawValue(label);
        this.clearInvalid();
    },

    setValue: function (value) {
        var params = {};
        if (Ext.isArray(value)) {
            params['objectIds'] = value.join(',');
        } else {
            params['objectId'] = value;
        }
        this.dv2.getStore().load({
            params: params,
            callback: this.refreshRawValue,
            scope: this
        });
        this.value = value;
    },

    getValue: function () {
        var value = [];
        this.dv2.getStore().each(function (record) {
            value.push(record.get('value'));
        }, this);
        return value;
    }
});

Ext.define('SimpleSearchModel', {
    extend: 'Ext.data.Model',
    fields: [
        {name: 'label', type: 'string'},
        {name: 'value', type: 'string'}
    ],
    idProperty: 'value'
});