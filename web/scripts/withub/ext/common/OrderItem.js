Ext.define('withub.ext.common.OrderItem', {
    extend: 'Ext.menu.Item',
    alias: 'widget.orderitem',
    moveText: {
        Up: '上移',
        Down: '下移',
        First: '移到第一个',
        Last: '移到最后一个',
        Position: '移到指定位置'
    },
    moveIcon: {
        Up: 'icon-arrow-up',
        Down: 'icon-arrow-down',
        First: 'icon-arrow-top',
        Last: 'icon-arrow-bottom',
        Position: 'icon-bullet-black'
    },
    constructor: function(config) {
        config = config || {};
        Ext.applyIf(config, {
            text: this.moveText[config.move],
            iconCls: this.moveIcon[config.move],
            handler: this.createHandler(config.move)
        });
        this.callParent([config]);
    },

    createHandler: function() {
        var me = this;
        return function() {
            var _me = this;
            if (me.move == 'Position') {
                Ext.Msg.prompt('HSE', '请输入排序号：', function(btn, text) {
                    if (btn == 'ok') {
                        var mask = new Ext.LoadMask(Ext.getBody(), {msg: '正在移动...'});
                        mask.show();
                        Ext.Ajax.request({
                            url: PageContext.contextPath + '/system/metadata/orderEntity',
                            params: {
                                orderNo: text,
                                entity: me.entity,
                                objectId: me.objectId
                            },
                            success: function(response) {
                                mask.hide();
                                var result = Ext.decode(response.responseText);
                                if (result.success == true) {
                                    me.onSuccess.apply(_me);
                                } else {
                                    ExtUtil.Msg.error(result.message);
                                }
                            },
                            failure: function(response) {
                                mask.hide();
                                ExtUtil.Msg.error(response.responseText);
                            }
                        });
                    }
                });
            } else {
                var mask = new Ext.LoadMask(Ext.getBody(), {msg: '正在移动...'});
                mask.show();
                Ext.Ajax.request({
                    url: PageContext.contextPath + '/system/menu/orderEntity',
                    params: {
                        move: me.move,
                        entity: me.entity,
                        objectId: me.objectId
                    },
                    success: function(response) {
                        mask.hide();
                        var result = Ext.decode(response.responseText);
                        if (result.success == true) {
                            me.onSuccess.apply(_me);
                        } else {
                            ExtUtil.Msg.error(result.message);
                        }
                    },
                    failure: function(response) {
                        mask.hide();
                        ExtUtil.Msg.error(response.responseText);
                    }
                });
            }
        }
    }
});

