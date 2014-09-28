Ext.define('withub.ext.base.Tree', {
    extend: 'Ext.tree.Panel',
    hideHeaders: true,
    rootVisible: false,
    nodeParam: 'node',

    initComponent: function () {
        this.store = Ext.create('Ext.data.TreeStore', {
            fields: ['objectId', 'text', 'type', 'attributes'],
            proxy: {
                type: 'ajax',
                url: PageContext.contextPath + this.url,
                extraParams: this.extraParams,
                reader: {
                    type: 'json',
                    root: 'nodes'
                }
            },
            root: this.root || {
                id: 'Root',
                text: 'Root'
            },
            nodeParam: this.nodeParam
        });
        this.callParent();
    },


    setChecked: function (value) {
        var me = this, checkedNodes, waitIds = [];
        me.clearCheckNode();
        if (Ext.isEmpty(value)) {
            return;
        }
        if (Ext.isArray(value)) {
            checkedNodes = value;
        } else {
            checkedNodes = [value];
        }

        Ext.each(checkedNodes, function (id) {
            if (!me.getStore().getNodeById(id)) {
                waitIds.push(id);
            }
        });
        me.waitIds = waitIds;
        me.checkedNodes = checkedNodes;

        if (me.waitIds.length > 0) {
            me.loadNode(me.waitIds.shift());
        } else {

            me.checkNode();
        }
    },

    expandNode: function (nodeId) {
        var me = this, node = me.getStore().getNodeById(nodeId);
        node.expand(null, function () {
                if (me.waitNids.length > 0) {
                    me.expandNode(me.waitNids.shift());
                } else {
                    if (me.waitIds && me.waitIds.length > 0) {
                        me.loadNode(me.waitIds.shift());
                    } else {
                        me.checkNode();
                    }
                }
            }
        );
    },

    loadNode: function (nodeId) {
        var me = this;
        Ext.Ajax.request({
            url: PageContext.contextPath + me.url + 'Path?' + me.nodeParam + '=' + nodeId,
            params: me.extraParams,
            method: 'GET',
            success: function (response) {
                var result = Ext.decode(response.responseText);
                var nodes = result['node'];
                var waitNids = [nodes[0]];
                nodes.reverse();
                Ext.each(nodes, function (nodeId, index) {
                    if (!me.getStore().getNodeById(nodeId)) {
                        waitNids = nodes.slice(index - 1);
                        return false;
                    }
                });
                if (waitNids.length > 0) {
                    me.expandNode(waitNids.shift());
                }
                me.waitNids = waitNids;
            }
        });
    },

    clearCheckNode: function () {
        var me = this;
        Ext.each(me.getChecked(), function (node) {
            node.set('checked', false);
        });
    },

    checkNode: function () {
        var me = this;
        Ext.each(me.checkedNodes, function (id) {
            var node = me.getStore().getNodeById(id);
            if (node) {
                node.set('checked', true);
            }
        });
    }
});