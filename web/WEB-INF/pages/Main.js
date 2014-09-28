Ext.define('withub.ext.Main', {
    extend: 'Ext.Viewport',
    layout: 'border',
    initComponent: function () {

        this.formPanel = Ext.create('Ext.form.Panel', {
            bodyStyle: 'padding: 5px 10px',
            border: false,
            layout: 'hbox',
            baseCls: 'x-plain',
            defaultType: 'textfield',
            defaults: {
                labelWidth: 80,
                labelAlign: 'right',
                width: 200,
                anchor: '100%',
                margins: '0 5 0 0'
            },
            items: [
                {
                    fieldLabel: '数据库IP',
                    name: 'dataBaseIp',
                    maxLength: 100,
//                    value: '172.16.162.225',
                    allowBlank: false
                },
                {
                    fieldLabel: '数据库端口',
                    name: 'dataBasePort',
                    value: '5432',
                    allowBlank: false
                },
                {
                    fieldLabel: '数据库名',
                    name: 'dataBaseName',
                    value: 'ea',
                    allowBlank: false
                },
                {
                    fieldLabel: '数据库帐号',
                    name: 'userName',
                    value: 'postgres',
                    allowBlank: false
                },
                {
                    fieldLabel: '数据库密码',
                    name: 'password',
                    inputType: 'password',
//                    value: 'Withub@951BA',
                    allowBlank: false
                },
                {
                    xtype: 'button',
                    text: '连接',
                    width: 60,
                    scope: this,
                    handler: function () {
                        var me = this;
                        var form = this.formPanel.getForm();
                        if (form.isValid()) {
                            form.submit({
                                url: PageContext.contextPath + '/setJdbcServlet/',
                                method: 'POST',
                                success: function (form, action) {
                                    var result = action.result;
                                    if (result.success) {
                                        ExtUtil.Msg.info("连接成功！");
                                        Ext.getCmp('systemDeauthorize').enable();
                                        Ext.getCmp('systemAuthorize').enable();
                                        me.infoPanel.getForm().findField('systemUniqueCode').setValue(result.authorizationInfo.systemUniqueCode);
                                        me.infoPanel.getForm().findField('systemAuthorizationCode').setValue(result.authorizationInfo.systemAuthorizationCode);
                                        me.infoPanel.getForm().findField('systemAuthorizationTime').setValue(result.authorizationInfo.systemAuthorizationTime);
                                        if (!Ext.isEmpty(result.authorizationInfo.systemAuthorizationCode) && !Ext.isEmpty(result.authorizationInfo.systemUniqueCode) && result.authorizationInfo.systemUniqueCode.length > 30) {
                                            me.treePanel.getStore().load({
                                                node: me.treePanel.getStore().getRootNode(),
                                                callback: function () {
                                                    me.treePanel.getStore().getRootNode().collapse();
                                                    me.treePanel.expandAll();
                                                }
                                            });
                                        }
//                                        if (result.systemAuthorize) {
//                                            ExtUtil.Msg.info("连接成功！");
//                                            me.infoPanel.getForm().findField('systemUniqueCode').setValue(result.authorizationInfo.systemUniqueCode);
//                                            me.infoPanel.getForm().findField('systemAuthorizationCode').setValue(result.authorizationInfo.systemAuthorizationCode);
//                                            me.infoPanel.getForm().findField('systemAuthorizationTime').setValue(result.authorizationInfo.systemAuthorizationTime);
//                                            Ext.getCmp('systemDeauthorize').enable();
//                                            Ext.getCmp('systemAuthorize').enable();
//                                            me.treePanel.getStore().load({
//                                                node: me.treePanel.getStore().getRootNode(),
//                                                callback: function () {
//                                                    me.treePanel.getStore().getRootNode().collapse();
//                                                    me.treePanel.expandAll();
//                                                }
//                                            });
//                                            me.gridPanel.getStore().removeAll();
//                                        } else {
//                                            ExtUtil.Msg.confirm('连接成功，是否进行系统授权?', function (select) {
//                                                if (select === 'no') {
//                                                    me.infoPanel.getForm().findField('systemUniqueCode').setValue(result.authorizationInfo.systemUniqueCode);
//                                                    me.infoPanel.getForm().findField('systemAuthorizationCode').setValue(result.authorizationInfo.systemAuthorizationCode);
//                                                    me.infoPanel.getForm().findField('systemAuthorizationTime').setValue(result.authorizationInfo.systemAuthorizationTime);
//                                                    Ext.getCmp('systemAuthorize').enable();
//                                                    Ext.getCmp('systemDeauthorize').disable();
//                                                    return;
//                                                }
//                                                Ext.Ajax.request({
//                                                    method: 'GET',
//                                                    url: PageContext.contextPath + '/system/authorize',
//                                                    params: {
//                                                    },
//                                                    success: function (response) {
//                                                        if (Ext.decode(response.responseText).success) {
//                                                            var result1 = Ext.decode(response.responseText);
//                                                            ExtUtil.Msg.info("系统授权成功！");
//                                                            me.infoPanel.getForm().findField('systemUniqueCode').setValue(result1.authorizationInfo.systemUniqueCode);
//                                                            me.infoPanel.getForm().findField('systemAuthorizationCode').setValue(result1.authorizationInfo.systemAuthorizationCode);
//                                                            me.infoPanel.getForm().findField('systemAuthorizationTime').setValue(result1.authorizationInfo.systemAuthorizationTime);
//                                                            Ext.getCmp('systemDeauthorize').enable();
//                                                            Ext.getCmp('systemAuthorize').disable();
//                                                            me.treePanel.getStore().load({
//                                                                node: me.treePanel.getStore().getRootNode(),
//                                                                callback: function () {
//                                                                    me.treePanel.getStore().getRootNode().collapse();
//                                                                    me.treePanel.expandAll();
//                                                                }
//                                                            });
//                                                            me.gridPanel.getStore().removeAll();
//                                                        } else {
//                                                            ExtUtil.Msg.info("系统授权失败！");
//                                                        }
//                                                    },
//                                                    failure: function () {
//                                                        ExtUtil.Msg.info("系统授权失败！");
//                                                    }
//                                                })
//                                            });
//                                        }
                                    } else {
                                        ExtUtil.Msg.info("连接失败！");
                                    }
                                },
                                failure: function () {
                                    ExtUtil.Msg.info("连接失败！");
                                }
                            });
                        }
                    }
                }
            ]
        });

        this.infoPanel = Ext.create('Ext.form.Panel', {
            bodyStyle: 'padding: 5px 10px',
            border: false,
            layout: 'hbox',
            baseCls: 'x-plain',
            defaultType: 'textfield',
            defaults: {
                labelWidth: 100,
                labelAlign: 'right',
                width: 360,
                readOnly: true,
                anchor: '100%',
                margins: '0 5 0 0'
            },
            items: [
                {
                    fieldLabel: '系统唯一码',
                    name: 'systemUniqueCode',
                    id: 'systemUniqueCode'
                },
                {
                    fieldLabel: '系统授权码',
                    name: 'systemAuthorizationCode',
                    id: 'systemAuthorizationCode'
                },
                {
                    fieldLabel: '系统授权时间',
                    width: 240,
                    name: 'systemAuthorizationTime',
                    id: 'systemAuthorizationTime'
                },
                {
                    xtype: 'button',
                    text: '系统授权',
                    width: 80,
                    id: 'systemAuthorize',
                    disabled: true,
                    scope: this,
                    handler: function () {
                        var me = this;
                        ExtUtil.Msg.confirm('是否进行系统授权?', function (select) {
                            if (select === 'no') {
                                return;
                            }
                            var systemUniqueCode = me.infoPanel.getForm().findField('systemUniqueCode').getValue();
                            if (Ext.isEmpty(systemUniqueCode) || systemUniqueCode.length < 30) {
                                ExtUtil.Msg.info("系统唯一码为空，不能进行系统授权！");
                                return;
                            }
                            Ext.Ajax.request({
                                method: 'GET',
                                url: PageContext.contextPath + '/system/authorize',
                                params: {
                                },
                                success: function (response) {
                                    if (Ext.decode(response.responseText).success) {
                                        ExtUtil.Msg.info("系统授权成功！");
                                        var result = Ext.decode(response.responseText);
                                        Ext.getCmp('systemUniqueCode').setValue(result.authorizationInfo.systemUniqueCode);
                                        Ext.getCmp('systemAuthorizationCode').setValue(result.authorizationInfo.systemAuthorizationCode);
                                        Ext.getCmp('systemAuthorizationTime').setValue(result.authorizationInfo.systemAuthorizationTime);
//                                        Ext.getCmp('systemDeauthorize').enable();
//                                        Ext.getCmp('systemAuthorize').disable();
                                        me.treePanel.getStore().load({
                                            node: me.treePanel.getStore().getRootNode(),
                                            callback: function () {
                                                me.treePanel.getStore().getRootNode().collapse();
                                                me.treePanel.expandAll();
                                            }
                                        });
                                        me.gridPanel.getStore().removeAll();
                                    } else {
                                        ExtUtil.Msg.info("系统授权失败！");
                                    }
                                },
                                failure: function () {
                                    ExtUtil.Msg.info("系统授权失败！");
                                }
                            })
                        });
                    }
                },
                {
                    xtype: 'button',
                    text: '取消授权',
                    width: 80,
                    id: 'systemDeauthorize',
                    disabled: true,
                    scope: this,
                    handler: function () {
                        var me = this;
                        ExtUtil.Msg.confirm('是否取消系统授权?', function (select) {
                            if (select === 'no') {
                                return;
                            }
                            Ext.Ajax.request({
                                method: 'GET',
                                url: PageContext.contextPath + '/system/deauthorize',
                                params: {
                                },
                                success: function (response) {
                                    if (Ext.decode(response.responseText).success) {
                                        ExtUtil.Msg.info("取消授权成功！");
                                        var result = Ext.decode(response.responseText);
                                        Ext.getCmp('systemUniqueCode').setValue(result.authorizationInfo.systemUniqueCode);
                                        Ext.getCmp('systemAuthorizationCode').setValue(result.authorizationInfo.systemAuthorizationCode);
                                        Ext.getCmp('systemAuthorizationTime').setValue(result.authorizationInfo.systemAuthorizationTime);
//                                        Ext.getCmp('systemAuthorize').enable();
//                                        Ext.getCmp('systemDeauthorize').disable();
                                        me.treePanel.getStore().load({
                                            node: me.treePanel.getStore().getRootNode(),
                                            callback: function () {
                                                me.treePanel.getStore().getRootNode().collapse();
                                                me.treePanel.expandAll();
                                            }
                                        });
                                        me.gridPanel.getStore().removeAll();
                                    } else {
                                        ExtUtil.Msg.info("取消授权失败！");
                                    }
                                },
                                failure: function () {
                                    ExtUtil.Msg.info("取消授权失败！");
                                }
                            })
                        });
                    }
                }
            ]
        });

        this.treePanel = Ext.create('withub.ext.common.ManagerTree', {
            region: 'west',
            title: '组件分类',
            split: true,
            width: 200,
            singleExpand: true,
            margins: '5 0 0 0',
            enableOrderItem: false,
            enableDeleteItem: false,
            baseUrl: '/widgetCategory'
        });

        this.gridPanel = Ext.create('withub.ext.common.ManagerGrid', {
            title: '组件列表',
            enableOrderItem: false,
            enableDeleteItem: false,
            entity: 'Widget',
            baseUrl: '/widget',
            region: 'center',
            margins: '5 0 0 0',
            fields: [
                'objectId',
                'name',
                'widgetTag',
                'license'
            ],
            columns: [
                {xtype: 'rownumberer', width: 32},
                {text: '名称', width: 160, dataIndex: 'name', sortable: false},
                {text: '授权', width: 80, dataIndex: 'license', align: 'center', sortable: false, renderer: function (value, record) {
                    if (Ext.isEmpty(value)) {
                        return '否'
                    } else {
                        return '是'
                    }
                }},
                {text: '标识', width: 360, dataIndex: 'widgetTag', sortable: false}
            ]
        })

        this.mainPanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'border',
            margins: '5 0 5 0',
            border: false,
            items: [this.treePanel, this.gridPanel]
        });

        this.northPanel = Ext.create('Ext.panel.Panel', {
            region: 'north',
            layout: 'vbox',
            border: false,
            items: [ this.formPanel, this.infoPanel]
        });

        this.items = [this.northPanel, this.mainPanel];

        this.treePanel.on('select', function (tree, record, index) {
            var store = this.gridPanel.getStore();
            store.getProxy().extraParams['id'] = record.get('objectId');
            store.load();
        }, this);

        this.treePanel.on('createcontextmenu', function (items, store, record, index, event) {
            return false;
        }, this);

        this.gridPanel.on('createcontextmenu', function (items, store, record, index, event) {
            var objectId = record.get('objectId');
            var license = record.get('license');
            if (Ext.isEmpty(license)) {
                items.push({
                    text: '授权',
                    iconCls: 'icon-edit',
                    handler: function () {
                        ExtUtil.Msg.confirm('确认授权?', function (select) {
                            if (select === 'no') {
                                return;
                            }
                            Ext.Ajax.request({
                                method: 'GET',
                                url: PageContext.contextPath + '/widget/authorize',
                                params: {
                                    objectId: objectId
                                },
                                success: function () {
                                    store.load();
                                }
                            })
                        });
                    },
                    scope: this
                });
            } else {
                items.push({
                    text: '取消授权',
                    iconCls: 'icon-edit',
                    handler: function () {
                        ExtUtil.Msg.confirm('确认取消授权?', function (select) {
                            if (select === 'no') {
                                return;
                            }
                            Ext.Ajax.request({
                                method: 'GET',
                                url: PageContext.contextPath + '/widget/deauthorize',
                                params: {
                                    objectId: objectId
                                },
                                success: function () {
                                    store.load();
                                }
                            })
                        });
                    },
                    scope: this
                });
            }
        }, this);

        this.callParent();

        this.on('afterrender', function (view) {

        }, this)
    }
})