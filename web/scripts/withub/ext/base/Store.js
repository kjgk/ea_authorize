Ext.define('withub.ext.base.Store', {
    extend: 'Ext.data.Store',

    constructor: function (config) {
        config = config || {};
        Ext.applyIf(config, {
            proxy: {
                type: 'ajax',
                pageParam: 'pageNo',
                limitParam: 'pageSize',
                url: PageContext.contextPath + config.url,
                extraParams: config.extraParams,
                timeout: 1000 * 60 * 60 * 24,
                reader: {
                    type: 'json',
                    root: config.root || 'items',
                    totalProperty: config.totalProperty || 'total',
                    idProperty: config.objectId || 'objectId'
                }
            },
            pageSize: config.pageSize || PageContext.pageSize
        });
        this.callParent([config]);

        /*this.getProxy().on('exception', function (proxy, response, operation) {
            if (operation.getError() == undefined) {
                ExtUtil.Msg.error(Ext.decode(response.responseText)['message']);
            } else {
                if (Ext.isString(operation.getError())) {
                    ExtUtil.Msg.error(operation.getError());
                } else if (Ext.isObject(operation.getError())) {
                    ExtUtil.Msg.error(operation.getError()['status'] + '：' + operation.getError()['statusText']);
                }
            }
        }, this);*/
    }
});