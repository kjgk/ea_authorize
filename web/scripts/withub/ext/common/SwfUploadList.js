Ext.define('withub.ext.common.SwfUploadList', {
    extend: 'Ext.grid.Panel',
    alias: 'widget.swfuploadlist',
    height: 150,
    attachLabel: '附件',
    enableDescription: false,
    initComponent: function () {

        var fileTypes = '*.*';
        var fileTypesDescription = '所有文件';

        if (this.attachType == 'Image') {
            this.attachLabel = '图片';
            fileTypes = '*.jpg;*.jpeg;*.png;*.gif;*.bmp;';
            fileTypesDescription = '所有图片';
        }

        if (this.attachType == 'Video') {
            this.attachLabel = '视频';
            fileTypes = '*.mp4;*.flv;';
            fileTypesDescription = '所有视频';
        }

        this.removeAttachments = [];

        this.swfUpload = Ext.create('withub.ext.base.SWFUpload', {
            buttonText: '添加' + this.attachLabel,
            fileTypes: fileTypes,
            fileTypesDescription: fileTypesDescription,
            width: 70
        });

        this.plugins = [
            Ext.create('Ext.grid.plugin.CellEditing', {
                clicksToEdit: 1
            })
        ];

        this.store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'fileId'},
                {name: 'fileName'},
                {name: 'tempFileName'},
                {name: 'fileDescription'},
                {name: 'fileStatus'}
            ]
        });

        this.columns = [
            Ext.create('Ext.grid.RowNumberer'),
            {
                text: this.attachLabel + '名称',
                flex: 1,
                dataIndex: 'fileName',
                renderer: function (value, metaData, record) {
                    if (record.get('fileStatus') == 'Remote') {
                        return '<a target="_blank" href="' + PageContext.contextPath + '/std/file/download?fileInfoId=' + record.get('fileId') + '">' + value + '</a>';
                    } else {
                        return value;
                    }
                },
                scope: this
            },
            {
                text: this.attachLabel + '描述',
                flex: 2,
                hidden: !this.enableDescription,
                dataIndex: 'fileDescription',
                field: {
                    xtype: 'textfield'
                }
            }
        ];

        this.tbar = [
            this.swfUpload,
            {
                text: '删除' + this.attachLabel,
                iconCls: 'icon-delete',
                handler: function () {
                    var records = this.getSelectionModel().getSelection();
                    Ext.each(records, function (record) {
                        if (record.get('fileStatus') == 'Remote') {
                            this.removeAttachments.push(record.get('fileId'));
                        }
                        if (record.get('fileStatus') == 'Local') {
                            this.swfUpload.removeFile(record.get('fileId'));
                        }
                    }, this);
                    this.getStore().remove(records);
                    this.fireEvent('remove', records);
                },
                scope: this
            }
        ];

        this.callParent();

        this.swfUpload.on('filequeued', function (file) {

            var flag = true;
            this.getStore().each(function (record) {
                if (file.name == record.get('fileName')) {
                    ExtUtil.Msg.info('文件“' + file.name + '”已经存在，不能重复上传。');
                    flag = false;
                    return false;
                }
            }, this);

            if (flag) {
                this.getStore().loadData([
                    {
                        fileId: file.id,
                        fileName: file.name,
                        fileDescription: '',
                        fileStatus: 'Local'
                    }
                ], true);
            }
        }, this);
    }
});