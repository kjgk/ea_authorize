Ext.define('withub.ext.common.UserSearchCombo', {
    extend: 'withub.ext.base.SearchCombo',
    alias: 'widget.usersearchcombo',
    emptyText: '请输入用户姓名的拼音首字母',
    url: '/system/user/search',
    valueField: 'objectId',
    displayField: 'name',

    initComponent: function() {
        this.listConfig = {
            loadingText: '检索中...',
            emptyText: '没有数据.',
            getInnerTpl: function() {
                return '<a class="user-search-item">' + '<h3><span>{code}</span>{name}</h3>' + '{organizationName}' + '</a>';
            }
        };
        this.model = 'withub.ext.system.user.UserSearchModel';
        this.callParent();
    }
});

Ext.define('withub.ext.system.user.UserSearchModel', {
    extend: 'Ext.data.Model',
    fields: [
        'objectId',
        'name',
        'code',
        'organizationName'
    ]
});