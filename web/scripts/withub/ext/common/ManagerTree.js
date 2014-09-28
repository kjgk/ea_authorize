Ext.define('withub.ext.common.ManagerTree', {
    extend: 'withub.ext.base.Tree',
    enableOrderItem: false,
    enableDeleteItem: false,
    rootDepth: 1,
    initComponent: function () {

        this.url = this.url || (this.baseUrl + '/loadManagerTree');

        this.callParent();

        this.on('load', function (store, record, successful, options) {
            if (record.get('depth') < this.rootDepth) {
                return;
            }
            this.view.select(record, false, false);
        }, this);

        this.on('itemcontextmenu', function (view, record, item, index, event, options) {
            var store = this.getStore(), entity = record.get('type'),
                proxy = store.getProxy(), items = [], objectId = record.get('objectId');

            var flag = this.fireEvent('createcontextmenu', items, store, record, index, event);
            if (flag === false) {
                return;
            }
            if (record.get('depth') > this.rootDepth) {
                if (this.enableOrderItem) {
                    items.push({
                        text: '移动',
                        iconCls: 'icon-refresh-small',
                        menu: {
                            items: [
                                {
                                    xtype: 'orderitem',
                                    move: 'First',
                                    entity: entity,
                                    objectId: objectId,
                                    onSuccess: function () {
                                        store.load({
                                            node: store.getNodeById(record.get('parentId'))
                                        });
                                    }
                                },
                                {
                                    xtype: 'orderitem',
                                    move: 'Up',
                                    entity: entity,
                                    objectId: objectId,
                                    onSuccess: function () {
                                        store.load({
                                            node: store.getNodeById(record.get('parentId'))
                                        });
                                    }
                                },
                                {
                                    xtype: 'orderitem',
                                    move: 'Down',
                                    entity: entity,
                                    objectId: objectId,
                                    onSuccess: function () {
                                        store.load({
                                            node: store.getNodeById(record.get('parentId'))
                                        });
                                    }
                                },
                                {
                                    xtype: 'orderitem',
                                    move: 'Last',
                                    entity: entity,
                                    objectId: objectId,
                                    onSuccess: function () {
                                        store.load({
                                            node: store.getNodeById(record.get('parentId'))
                                        });
                                    }
                                }/*,
                                 {
                                 xtype: 'orderitem',
                                 move: 'Position',
                                 entity: entity,
                                 objectId: objectId,
                                 onSuccess: function() {
                                 store.load({
                                 node: store.getNodeById(record.get('parentId'))
                                 });
                                 }
                                 }*/
                            ]
                        }
                    });
                }

                if (this.enableDeleteItem) {
                    var prefix = this.baseUrl.substring(0, this.baseUrl.lastIndexOf('/'));
                    var lowerCaseEntity = entity.substring(0, 1).toLowerCase() + entity.substring(1, entity.length);
                    items.push({
                        xtype: 'deleteitem',
                        text: '删除',
                        url: prefix + '/' + lowerCaseEntity + '/delete/' + objectId,
                        onSuccess: function () {
                            store.load({
                                node: store.getNodeById(record.get('parentId'))
                            });
                        }
                    });
                }
            }

            var menu = Ext.create('Ext.menu.Menu', {
                items: items
            });
            event.preventDefault();
            menu.showAt(event.getXY());
        });
    }
});