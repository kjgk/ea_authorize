Ext.define('withub.ext.base.Grid', {
    extend: 'Ext.grid.Panel',
    emptyText: '没有符合条件的数据！',
    enablePagginBar: false,
    enableAutoRefresh: false,
    autoRefreshInterval: 60,
    autoDimension: false,
    autoQuery: false,

    initComponent: function () {

        this.store = this.store || Ext.create('withub.ext.base.Store', {
            model: this.model,
            fields: this.fields,
            url: this.url,
            pageSize: this.pageSize,
            extraParams: this.extraParams
        });

        if (this.enablePagginBar === true) {
            this.bbar = {
                xtype: 'pagingtoolbar',
                store: this.store,
                dock: 'bottom',
                displayInfo: true
            }
        }

        this.store.getProxy().on('exception', function (proxy, response, operation) {
            var message = "";
            if (Ext.isString(operation.getError())) {
                message = operation.getError();
            } else if (Ext.isObject(operation.getError())) {
                message = operation.getError()['status'] + '：' + operation.getError()['statusText'];
            } else {
                var result = Ext.decode(response.responseText);
                message = result.message;
            }
            Ext.log(message)
        }, this);

        this.viewConfig = this.viewConfig || {
            stripeRows: true,
            enableTextSelection: true
        }

        Ext.each(this.columns, function (column) {
            column.xtype = column.xtype || 'smartcolumn'
        }, this);

        if (this.autoDimension === true) {
            this.height = ExtUtil.getFitHeight();
            this.width = ExtUtil.getFitWidth();
        }

        if (this.enableAutoRefresh == true) {
            this.autoRefreshItemId = Ext.id();
            var intervals = this.autoRefreshIntervals || [1 * 60, 2 * 60, 5 * 60, 10 * 60, 0], menus = [];
            Ext.each(intervals, function (interval) {
                var text = '';
                if (interval == 0) {
                    text = '不刷新';
                } else {
                    if (interval / 60 / 60 >= 1) {
                        text = interval / 60 / 60 + '小时'
                    } else if (interval / 60 >= 1) {
                        text = interval / 60 + '分钟'
                    } else {
                        text = interval + '秒'
                    }
                }
                menus.push({
                    text: text,
                    interval: interval,
                    iconCls: interval == this.autoRefreshInterval ? 'icon-tick' : '',
                    handler: function () {
                        this.autoRefreshInterval = interval;
                        this.doAutoRefresh();
                    },
                    scope: this
                });

            }, this);
            this.on('afterrender', function () {
                this.getAutoRefreshContainer().add({
                    itemId: this.autoRefreshItemId,
                    text: '定时刷新',
                    menu: menus,
                    listeners: {
                        afterrender: this.doAutoRefresh,
                        scope: this
                    }
                });
            }, this);
        }

        this.callParent();

        if (this.autoQuery === true) {
            this.on('afterrender', function () {
                Ext.defer(function(){
                    this.store.loadPage(1);
                }, 200, this);
            }, this);
        }
    },

    getAutoRefreshContainer: function () {
        return this.getDockedItems('toolbar[dock="top"]')[0];
    },

    doAutoRefresh: function () {
        if (this.task) {
            Ext.TaskManager.stop(this.task);
            this.task = undefined;
        }
        if (this.autoRefreshInterval != 0) {
            this.task = {
                run: function () {
                    this.getStore().load();
                },
                interval: this.autoRefreshInterval * 1000,
                scope: this
            };
            Ext.defer(function () {
                Ext.TaskManager.start(this.task);
            }, this.autoRefreshInterval * 1000, this);
        }

        Ext.each(this.down('#' + this.autoRefreshItemId).menu.items.items, function (item) {
            if (item.interval == this.autoRefreshInterval) {
                item.setIconCls('icon-tick');
            } else {
                item.setIconCls('');
            }
        }, this);
    }
});