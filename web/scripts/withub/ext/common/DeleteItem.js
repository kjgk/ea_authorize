Ext.define('withub.ext.common.DeleteItem', {
    extend: 'Ext.menu.Item',
    alias: 'widget.deleteitem',

    constructor: function(config) {
        config = config || {};
        Ext.applyIf(config, {
            text: '删除',
            iconCls: 'icon-delete',
            handler: this.createHandler()
        });
        this.callParent([config]);
    },

    createHandler: function() {
        var me = this;
        return function() {
            var _me = this;
            ExtUtil.Msg.confirm('确认删除?', function(select) {
                if (select == 'no') {
                    return;
                }
                var mask = new Ext.LoadMask(Ext.getBody(), {msg: '正在删除...'});
                mask.show();
                Ext.Ajax.request({
                    url: PageContext.contextPath + me.url,
                    params: me.params,
                    success: function(response) {
                        mask.hide();
                        var result = Ext.decode(response.responseText);
                        if (result.success == true) {
                            ExtUtil.Msg.info("删除成功！", function() {
                                me.onSuccess.apply(_me);
                            });
                        } else {
                            ExtUtil.Msg.error(result.message);
                        }
                    },
                    failure: function(response) {
                        mask.hide();
                        ExtUtil.Msg.error(response.responseText);
                    }
                });
            });
        }
    }
});
