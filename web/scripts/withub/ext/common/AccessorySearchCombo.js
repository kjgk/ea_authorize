Ext.define('withub.ext.common.AccessorySearchCombo', {
    extend: 'withub.ext.base.SearchCombo',
    alias: 'widget.accessorysearchcombo',
    emptyText: '请输入配料的拼音首字母',
    url: '/cloth/accessory/search',
    valueField: 'objectId',
    displayField: 'name',

    initComponent: function() {
        this.listConfig = {
            loadingText: '检索中...',
            emptyText: '没有数据.',
            getInnerTpl: function() {
                return '<a class="user-search-item">' + '<h3><span>{accessorycode}</span>{name}</h3>' + '</a>';
            }
        };
        this.model = 'withub.ext.system.user.AccessorySearchModel';
        this.callParent();
    }
});

Ext.define('withub.ext.system.user.AccessorySearchModel', {
    extend: 'Ext.data.Model',
    fields: [
        'objectId',
        'accessorycode',
        'name'
     ]
});