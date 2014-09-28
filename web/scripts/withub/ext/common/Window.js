Ext.define('withub.ext.common.Window', {
    extend: 'Ext.Window',
    width: 480,
    resizable: false,
    modal: true,
    enableButton1: true,
    enableButton2: false,
    button1Text: '保存',
    button2Text: '提交',
    buttonCloseText: '关闭',
    action: 'create',
    button2Action: 'submit',

    initComponent: function() {

        this.baseUrl = PageContext.contextPath + this.baseUrl;

        this.buttons = this.buttons || [];

        this.buttons.push({
            text: this.button2Text,
            hidden: !this.enableButton2,
            handler: function() {
                var form = this.formPanel.getForm(), params = {};
                if (!form.isValid()) {
                    return;
                }
                if (this.fireEvent('beforesave', form, params) === false) {
                    return;
                }

                this.doCommand({
                    action: this.button2Action,
                    text: this.button2Text
                }, params);
            },
            scope: this
        });

        this.buttons.push({
            text: this.button1Text,
            hidden: !this.enableButton1,
            handler: function() {
                var form = this.formPanel.getForm(), params = {};
                if (!form.isValid()) {
                    return;
                }
                if (this.fireEvent('beforesave', form, params) === false) {
                    return;
                }

                this.doCommand({
                    action: this.action,
                    text: this.button1Text
                }, params);
            },
            scope: this
        });

        this.buttons.push({
            text: this.buttonCloseText,
            handler: this.close,
            scope: this
        });

        this.callParent();

        /*this.on('show', function() {
         var textfields = Ext.ComponentQuery.query(".textfield", this.formPanel);
         if (textfields.length > 0) {
         textfields[0].focus(false, 500);
         }
         }, this);*/

        if (!Ext.isEmpty(this.objectId)) {
            this.action = 'update',
            this.on('show', this.doLoad, this);
        }
    },

    // private
    doCommand: function(command, params) {
        if (this.getSwfUploadList() || this.getSwfUploadField()) {
            this.doUpload(command, params);
        } else {
            this.doSave(command, params);
        }
    },

    // private
    getSwfUploadList: function() {
        if (this.attachList && this.attachList.getXType() === 'swfuploadlist') {
            return this.attachList;
        }
    },

    // private
    getSwfUploadField: function() {
        var form = this.formPanel.getForm();
        var swfUploadField;
        Ext.each(form.getFields().items, function(field) {
            if (field.swfUploadFieldSign == true) {
                swfUploadField = field.ownerCt;
                return false;
            }
        }, this);
        return swfUploadField;
    },

    /**
     * private
     * 加载表单数据
     */
    doLoad: function() {
        var mask = new Ext.LoadMask(this.getId(), {msg: PageContext.loadMsg});
        var form = this.formPanel.getForm();
        mask.show();
        form.load({
            url: this.baseUrl + '/load/' + this.objectId,
            method: 'GET',
            timeout: 60 * 1000,
            success: function(form, action) {
                mask.hide();
                var result = Ext.decode(action.response.responseText);
                var swfUploadField = this.getSwfUploadField();
                var swfUploadList = this.getSwfUploadList();

                if (swfUploadField && !Ext.isEmpty(result.data[swfUploadField.name])) {
                    swfUploadField.infoText.setVisible(false);
                    swfUploadField.swfUpload.setVisible(false);
                    swfUploadField.add([
                        {
                            xtype: 'component',
                            flex: 1,
                            html: Ext.String.format('<div style="padding-top: 3px;"><a href="{0}" target="_blank" class="file-download">{1}</a></div>'
                                    , PageContext.contextPath + '/std/file/download?fileInfoId=' + result.data[swfUploadField.name]['fileId']
                                    , result.data[swfUploadField.name]['fileName'])
                        },
                        {
                            xtype: 'button',
                            text: '替换',
                            width: 50,
                            handler: function() {
                                swfUploadField.infoText.setVisible(true);
                                swfUploadField.swfUpload.setVisible(true);
                                swfUploadField.getComponent(2).setVisible(false);
                                swfUploadField.getComponent(3).setVisible(false);
                            },
                            scope: this
                        }
                    ]);
                }

                if (swfUploadList) {
                    swfUploadList.getStore().loadData(result.data['attachments']);
                }

                {
                    var dateTimeFields = [];
                    Ext.each(form.getFields().items, function(field) {
                        if (field.dateFieldSign === true || field.timeFieldSign === true) {
                            if (!Ext.Array.contains(dateTimeFields, field.ownerCt) && !field.ownerCt.isDisabled()) {
                                dateTimeFields.push(field.ownerCt);
                            }
                        }
                    }, this);
                    Ext.each(dateTimeFields, function(dateTimeField) {
                        dateTimeField.setValue(new Date(result.data[dateTimeField.name]));
                    }, this)
                }

                this.fireEvent('load', form, action);
            },
            failure: function(form, action) {
                mask.hide();
            },
            scope: this
        });
    },

    /**
     * private
     * swf上传
     */
    doUpload: function(command, params) {
        var swfUploadField = this.getSwfUploadField();
        var swfUploadList = this.getSwfUploadList();
        var requireUploadField = false;
        var requireUploadList = false;

        if (swfUploadField) {
            requireUploadField = swfUploadField.swfUpload.getUploader().getStats()['files_queued'] != 0
        }

        if (swfUploadList) {
            swfUploadList.getStore().each(function(record) {
                if (record.get('fileStatus') == 'Local' && Ext.isEmpty(record.get('tempFileName'))) {
                    requireUploadList = true;
                    return false;
                }
            }, this);
        }

        if (requireUploadField && requireUploadList) {
            swfUploadField.swfUpload.doUpload(function(file) {
                swfUploadField.uploadedFile = file;
                swfUploadList.swfUpload.doUpload(function(files) {
                    Ext.each(files, function(file, _index) {
                        swfUploadList.getStore().each(function(record) {
                            if (record.get('fileStatus') == 'Local' && record.get('fileName') == file['fileName']) {
                                record.set({
                                    tempFileName: file['tempFileName']
                                });
                                record.commit();
                                return false;
                            }
                        }, this);
                    }, this);
                    this.doSave(command, params);
                }, this);
            }, this);
            return;
        }

        if (requireUploadField) {
            swfUploadField.swfUpload.doUpload(function(file) {
                swfUploadField.uploadedFile = file;

                this.doSave(command, params);
            }, this);
            return;
        }

        if (requireUploadList) {
            swfUploadList.swfUpload.doUpload(function(files) {
                Ext.each(files, function(file, _index) {
                    swfUploadList.getStore().each(function(record) {
                        if (record.get('fileStatus') == 'Local' && record.get('fileName') == file['fileName']) {
                            record.set({
                                tempFileName: file['tempFileName']
                            });
                            record.commit();
                            return false;
                        }
                    }, this);
                }, this);
                this.doSave(command, params);
            }, this);
            return;
        }

        this.doSave(command, params);
    },

    /**
     * private
     * 保存
     */
    doSave: function(command, params) {
        var form = this.formPanel.getForm();
        var swfUploadField = this.getSwfUploadField();
        var swfUploadList = this.getSwfUploadList();

        if (swfUploadField) {
            if (swfUploadField.allowBlank === false && swfUploadField.swfUpload.isVisible() && swfUploadField.uploadedFile == undefined) {
                ExtUtil.Msg.info(swfUploadField.fieldLabel + '不能为空！');
                return;
            }
            if (swfUploadField.uploadedFile != undefined) {
                params[swfUploadField.name + '.fileName'] = swfUploadField.uploadedFile['fileName'];
                params[swfUploadField.name + '.tempFileName'] = swfUploadField.uploadedFile['tempFileName'];
            }
        }

        if (swfUploadList) {
            var index = 0;
            if (swfUploadList.allowBlank === false && swfUploadList.getStore().getCount() == 0) {
                ExtUtil.Msg.info(swfUploadList.attachLabel + '不能为空！');
                return;
            }

            // 记录被删除的文件
            Ext.each(swfUploadList.removeAttachments, function(fileId) {
                params['attachments[' + index + '].fileId'] = fileId;
                params['attachments[' + index + '].fileDelete'] = 1;
                index++;
            }, this);

            // 记录备注修改过的文件
            swfUploadList.getStore().each(function(record) {
                if (record.get('fileStatus') == 'Remote' && record.isModified('fileDescription')) {
                    params['attachments[' + index + '].fileId'] = record.get('fileId');
                    params['attachments[' + index + '].fileDescription'] = record.get('fileDescription');
                    index++;
                }
                if (record.get('fileStatus') == 'Local') {
                    params['attachments[' + index + '].fileName'] = record.get('fileName');
                    params['attachments[' + index + '].tempFileName'] = record.get('tempFileName');
                    params['attachments[' + index + '].fileDescription'] = record.get('fileDescription');
                    params['attachments[' + index + '].fileOrderNo'] = index + 1;
                    index++;
                }
            }, this);
        }

        // 处理dateTimeField控件的取值
        {
            var dateFields = [], timeFields = [];
            Ext.each(form.getFields().items, function(field) {
                if (field.dateFieldSign === true) {
                    dateFields.push(field)
                }
                if (field.timeFieldSign === true) {
                    timeFields.push(field)
                }
            }, this);
            Ext.each(dateFields, function(field) {
                params[field.name] = field.getRawValue();
            }, this);
            Ext.each(timeFields, function(field) {
                var fieldValue = field.getRawValue() ? field.getRawValue() : '00:00';
                if (!Ext.isEmpty(params[field.name])) {
                    params[field.name] = params[field.name] + ' ' + fieldValue;
                }
            }, this);
        }

        form.submit({
            url: this.url || this.baseUrl + '/' + command.action,
            params: params,
            success: function(form, action) {
                ExtUtil.Msg.info(command.text + '成功！', function() {
                    this.fireEvent('success');
                    this.close();
                }, this);
            },
            failure: function(form, action) {
                ExtUtil.Msg.error(action.result.message);
            },
            method: 'POST',
            timeout: 60 * 1000,
            scope: this,
            waitMsg: PageContext.waitMsg,
            waitTitle: PageContext.msgTitle
        });
    }
});

