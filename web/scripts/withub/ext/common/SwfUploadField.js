Ext.define('withub.ext.common.SwfUploadField', {
    extend: 'Ext.form.FieldContainer',
    alias: 'widget.swfuploadfield',
    height: 22,
    layout: 'hbox',
    fieldLabel: '附件',

    initComponent: function() {

        this.infoText = Ext.create('Ext.form.field.Text', {
            readOnly: true,
            submitValue: false,
            style: 'color: gray; margin-top: 2px;',
            swfUploadFieldSign: true,
            flex: 1
        });

        this.swfUpload = Ext.create('withub.ext.base.SWFUpload', Ext.apply({
            width: 46,
            multiFile: false,
            fileLabel: this.fileLabel || this.fieldLabel,
            style: 'margin: 2px 0px 0px 2px;'
        }, this.swfUploadConfig));

        this.items = [
            this.infoText,
            this.swfUpload
        ];

        this.swfUpload.on('filequeued', function(file) {
            this.infoText.setValue(file.name);
        }, this);

        this.callParent();

        this.relayEvents(this.swfUpload, ['filequeued', 'dialogcomplete', 'uploadprogress', 'uploaderror', 'uploadsuccess']);
    },

    getUploader: function() {
        return this.swfUpload.getUploader();
    },

    doUpload: function(callback, scope) {
        return this.swfUpload.doUpload(callback, scope);
    }
});