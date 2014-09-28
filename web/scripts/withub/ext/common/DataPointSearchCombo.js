Ext.define('withub.ext.common.DataPointSearchCombo', {
    extend: 'withub.ext.base.Combo',
    alias: 'widget.datapointsearchcombo',

    queryMode: 'remote',
    typeAhead: false,
    hideTrigger: true,
    editable: true,
    minChars: 1,
    queryParam: 'keyword',
    autoLoad: false,

    emptyText: '请输入数据点名称',
    url: '/system/dataPoint/search',
    valueField: 'objectId',
    displayField: 'name',

    initComponent: function () {

        this.listConfig = {
            loadingText: '检索中...',
            emptyText: '没有数据.',
            getInnerTpl: function () {
                return '<a >' + '<tpl if="name !== undefined"><h3><span>{name}</span></h3></tpl>' + '{dataPointTag}' + '</a>';
            }
        };

        this.model = 'withub.ext.system.dataPoint.DataPointSearchModel';

        this.on('select', function (combo, records, eOpts) {

            if (records[0].data.name == null) {
                this.displayTplData[0].name = records[0].data.dataPointTag;
                this.setRawValue(records[0].data.dataPointTag);
            }

        });

        this.callParent();

        this.store.on('load', function (store, records, successful, operation, options) {
            Ext.each(records, function (record) {
//                this.setValue(record.get(this.valueField));
//
//                if (record.data.name == null) {
//                    this.displayTplData[0].name = record.data.dataPointTag;
//                    this.setRawValue(record.data.dataPointTag);
//                }
//
//                if (records.length == 1) {
//                    this.collapse();
//                }
//                return false;

            }, this);
        }, this);
    },

    setValue: function (value) {
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

Ext.define('withub.ext.system.dataPoint.DataPointSearchModel', {
    extend: 'Ext.data.Model',
    fields: [
        'objectId',
        'name',
        'dataPointTag'
    ]
});

