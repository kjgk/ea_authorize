Ext.define('withub.ext.common.ClientUserSearchField', {
    extend: 'Ext.form.field.Picker',
    alias: 'widget.clientusersearchfield',

    enableKeyEvents: true,
    queryDelay: 10,
    queryProperty: 'userName',
    submitValue: false,
    url: '/guardium/clientUser/serach',

    initComponent: function() {
        this.initDv();
        this.doQueryTask = Ext.create('Ext.util.DelayedTask', this.doRawQuery, this);
        this.callParent();
    },

    initEvents: function() {
        var me = this;
        me.callParent();
        me.mon(me.inputEl, 'keyup', me.onKeyUp, me);
    },

    onKeyUp: function(e, t) {
        var me = this,key = e.getKey();
        me.lastKey = key;
        if (!e.isSpecialKey() || key == e.BACKSPACE || key == e.DELETE) {
            this.doQueryTask.delay(me.queryDelay);
        }
        me.callParent(arguments);
    },

    onFocus: function() {
        this.callParent(arguments);
        this.expand();
    },

    collapse: function() {
        this.callParent();
        this.refreshRawValue();
    },

    expand: function() {
        var me = this;
        me.setRawValue('');
        me.dv1.getStore().removeAll();
        me.callParent();
    },

    doRawQuery: function() {
        this.doQuery(this.getRawValue());
    },

    doQuery: function(keyword) {
        this.dv1.getStore().load({
            params: {
                keyword: keyword
            }
        });
    },

    alignPicker: function() {
        var me = this,
            picker, isAbove,
            aboveSfx = '-above';

        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth) {
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                picker.alignTo(me.inputEl, me.pickerAlign, me.pickerOffset);
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
            }
        }
    },

    initDv: function() {
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

    createPicker: function() {

        var store1 = this.dv1.getStore(), store2 = this.dv2.getStore();

        this.dv1.on('itemdblclick', function(view, record, item, index) {
            var sel = true;
            store2.each(function(r) {
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

        this.dv2.on('itemdblclick', function(view, record, item, index) {
            var sel = true;
            store1.each(function(r) {
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
            floating: true,
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

    refreshRawValue: function() {
        var label = new Array();
        this.dv2.getStore().each(function(record, index) {
            label += (index == 0 ? '' : ',') + record.get('label');
        }, this);
        this.setRawValue(label);
        this.clearInvalid();
    },

    setValue: function(value) {
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

    getValue: function() {
        var value = [];
        this.dv2.getStore().each(function(record) {
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