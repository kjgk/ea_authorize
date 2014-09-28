Ext.define('withub.ext.base.TreeCombo', {
    extend: 'Ext.form.field.Picker',
    requires: ['Ext.tree.Panel'],
    alias: 'widget.treecombo',
    rootId: 'Root',
    rootText: 'Root',
    nodeParam: 'node',
    editable: false,
    enableClear: false,
    selectType: null,
    treeWidth: null,
    showPathName: false,
    pathNameDepth: 0,
    trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
    trigger2Cls: Ext.baseCSSPrefix + 'form-trigger',

    initComponent: function () {
        var me = this;
        me.picker = this.createPicker();
        me.callParent();

        me.mon(me.picker.getStore(), {
            scope: me,
            load: me.onLoad
        });

//        me.on('afterrender', function () {
//            me.expand();
//            me.collapse();
//        });

        if (me.selectType) {
            me.on('beforeselect', function (nodeId, objectId, nodeType, record, index) {
                var selectType = me.selectType;
                if (Ext.isArray(selectType)) {
                    selectType = selectType.join(',');
                }
                return selectType.indexOf(nodeType) != -1;
            });
        }
    },

    afterRender: function () {
        this.callParent();
        this.triggerCell.item(0).setDisplayed(false);
    },

    onTrigger1Click: function () {
        this.clearValue();
        this.triggerCell.item(0).setDisplayed(false);
        this.updateLayout();
    },

    createPicker: function () {
        var store = Ext.create('Ext.data.TreeStore', {
            fields: ['objectId', 'text', 'type', 'attributes'],
            proxy: {
                type: 'ajax',
                url: PageContext.contextPath + this.url,
                extraParams: this.params,
                reader: {
                    type: 'json',
                    root: 'nodes'
                }
            },
            root: {
                id: this.rootId,
                text: this.rootText
            },
            nodeParam: this.nodeParam
        });

        var picker = new Ext.tree.Panel({
            height: 300,
            width: this.treeWidth ? this.treeWidth : undefined,
            autoScroll: true,
            floating: true,
            focusOnToFront: false,
            shadow: true,
            ownerCt: this.ownerCt,
            useArrows: false,
            store: store,
            rootVisible: false,
            resizable: true
        });

        store.on('load', function (store, records, successful, options) {
            if (this.isLoadingWaitNodes) {
                this.doLoadWaitNode();
            }
        }, this);

        picker.on('itemclick', function (view, record, item, index, event, options) {
            var nodeType = record.get('type');
            var nodeId = record.get('id');
            var objectId = record.get('objectId');
            if (this.fireEvent('beforeselect', nodeId, objectId, nodeType, record, index) === false) {
                return;
            }
            this.setValue(nodeId);
            this.fireEvent('select', nodeId, objectId, nodeType, record, index);
            this.collapse();
        }, this);

        return picker;
    },

    getValue: function () {
        return this.value;
    },

    getSubmitValue: function () {
        return this.objectValue || this.getValue();
    },

    getObjectValue: function () {
        return this.objectValue;
    },

    getObjectType: function () {
        var view = this.getPicker().getView();
        if (view.getSelectedNodes().length > 0) {
            return view.getRecord(view.getSelectedNodes()[0]).get('type');
        }
        return undefined;
    },

    clearValue: function () {
        this.setValue(undefined);
        this.objectValue = undefined;
        var view = this.getPicker().getView();
        view.deselect(view.getRecord(view.getSelectedNodes()[0]), false);
    },

    setValue: function (value) {
        var me = this, treePanel = me.getPicker(), store = treePanel.getStore();
        me.value = value;
        if (Ext.isEmpty(value)) {
            this.callParent(arguments);
            return me;
        }

        if (treePanel.getStore().loading) {
            return me;
        }

        var node = store.getNodeById(value);
        if (node) {
            this.callParent(arguments);
            this.objectValue = node.get('objectId');
            var text = node.get('text');
            if (this.showPathName && node.getDepth() >= this.pathNameDepth) {
                var _n = node;
                text = '';
                while (_n.getDepth() >= this.pathNameDepth) {
                    text = _n.get('text') + ' ' + text;
                    _n = _n.parentNode;
                }
            }
            this.setRawValue(text);
            treePanel.getView().select(node, false, false);

            if (me.enableClear) {
                me.triggerCell.item(0).setDisplayed(true);
                me.updateLayout();
            }
        } else {
            me.waitNodes = [];
            Ext.Ajax.request({
                url: PageContext.contextPath + me.url + 'Path?' + this.nodeParam + '=' + value,
                method: 'GET',
                success: function (response) {
                    var result = Ext.decode(response.responseText);
                    Ext.each(result['node'].reverse(), function (nodeId) {
                        me.waitNodes.push(nodeId);
                    });
                    me.doLoadWaitNode();
                }
            });
        }
        return me;
    },

    doLoadWaitNode: function () {
        if (Ext.isDefined(this.waitNodes) && this.waitNodes.length > 0) {
            var nodeId = this.waitNodes.shift();
            var node = this.getPicker().getStore().getNodeById(nodeId);
            if (node.isLoaded()) {
                node.expand(false, this.doLoadWaitNode, this);
            } else {
                this.isLoadingWaitNodes = true;
                node.expand();
            }
        } else {
            this.isLoadingWaitNodes = false;
            this.setValue(this.value);
        }
    },

    alignPicker: function () {
        var me = this, picker, isAbove, aboveSfx = '-above';
        if (this.isExpanded) {
            picker = me.getPicker();
            if (me.matchFieldWidth && this.treeWidth == undefined) {
                picker.setWidth(me.bodyEl.getWidth());
            }
            if (picker.isFloating()) {
                picker.alignTo(me.inputEl, '', me.pickerOffset);// ''->tl
                isAbove = picker.el.getY() < me.inputEl.getY();
                me.bodyEl[isAbove ? 'addCls' : 'removeCls'](me.openCls + aboveSfx);
                picker.el[isAbove ? 'addCls' : 'removeCls'](picker.baseCls + aboveSfx);
            }
        }
    },

    onLoad: function () {
        var me = this;
        if (me.value) {
            setTimeout(function () {
                me.setValue(me.value);
            }, 100)
        }
    }
});