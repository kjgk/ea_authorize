Ext.define('withub.ext.common.ManagerGrid', {
    extend: 'withub.ext.base.Grid',
    enablePagginBar: false,
    enableOrderItem: false,
    enableDeleteItem: false,
    enableHseColumnItem: false,

    initComponent: function () {

        this.url = this.url || (this.baseUrl + '/query');

        this.callParent();

        this.on('itemcontextmenu', function (view, record, item, index, event, options) {
            var store = this.getStore(), me = this,
                proxy = store.getProxy(), items = [], objectId = record.get('objectId');

            var flag = this.fireEvent('createcontextmenu', items, store, record, index, event);
            if (flag === false) {
                return;
            }

            if (this.enableOrderItem) {
                items.push({
                    text: '移动',
                    iconCls: 'icon-refresh-small',
                    menu: {
                        items: [
                            {
                                xtype: 'orderitem',
                                move: 'First',
                                entity: this.entity,
                                objectId: objectId,
                                onSuccess: function () {
                                    store.load();
                                }
                            },
                            {
                                xtype: 'orderitem',
                                move: 'Up',
                                entity: this.entity,
                                objectId: objectId,
                                onSuccess: function () {
                                    store.load();
                                }
                            },
                            {
                                xtype: 'orderitem',
                                move: 'Down',
                                entity: this.entity,
                                objectId: objectId,
                                onSuccess: function () {
                                    store.load();
                                }
                            },
                            {
                                xtype: 'orderitem',
                                move: 'Last',
                                entity: this.entity,
                                objectId: objectId,
                                onSuccess: function () {
                                    store.load();
                                }
                            }/*,
                             {
                             xtype: 'orderitem',
                             move: 'Position',
                             entity: this.entity,
                             objectId: objectId,
                             onSuccess: function () {
                             store.load();
                             }
                             }*/
                        ]
                    }
                });
            }

            if (this.enableDeleteItem) {
                items.push({
                    xtype: 'deleteitem',
                    menuTag: 'Delete',
                    text: '删除',
                    url: this.baseUrl + '/delete/' + objectId,
                    onSuccess: function () {
                        if (me.treePanel) {
                            var treeStore = me.treePanel.getStore();
                            var node = treeStore.getNodeById(me.entity + ExtUtil.TREE_NODE_SPLIT + objectId);
                            treeStore.load({
                                node: treeStore.getNodeById(node.get('parentId'))
                            });
                        }
                        store.load();
                    }
                });
            }

            if (items.length == 0) {
                return;
            }

            var menu = Ext.create('Ext.menu.Menu', {
                items: items
            });

            event.preventDefault();
            menu.showAt(event.getXY());
        });
    }
});