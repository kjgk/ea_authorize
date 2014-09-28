Ext.define('withub.ext.base.SWFUpload', {
    extend: 'Ext.Component',
    alias: 'widget.baseswfupload',

    buttonText: '浏览',
    buttonWidth: 68,
    buttonHeight: 19,

    url: PageContext.contextPath + '/std/swf/upload',
    postName: 'attachment',
    params: {},

    fileLabel: '附件',
    fileTypes: '*.*',
    fileTypesDescription: '所有文件',
    fileSizeLimit: '1000 MB',
    fileUploadLimit: 0,

    multiFile: true,

    initComponent: function() {
        var me = this;
        me.fileList = [];
        me.placeholder = Ext.id();
        me.html = '<div id="' + me.placeholder + '"></div>';
        var uploaderConfig = {
            file_post_name: me.postName,
            upload_url: me.url,
            post_params: me.params,

            file_size_limit: me.fileSizeLimit,
            file_types: me.fileTypes,
            file_types_description: me.fileTypesDescription,
            file_upload_limit: me.fileUploadLimit,

            button_image_url: PageContext.contextPath + '/scripts/swfupload/SmallSpyGlassWithTransperancy_17x18.png',
            button_placeholder_id: me.placeholder,
            button_width: me.buttonWidth,
            button_height: me.buttonHeight,
            button_text: '<span class="btn-browse">' + me.buttonText + '</span>',
            button_text_style: '.btn-browse {font-size: 12px; font-family: Arial}',
            button_text_top_padding: 0,
            button_text_left_padding: 18,
            button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
            button_cursor: SWFUpload.CURSOR.HAND,

            flash_url : PageContext.contextPath + '/scripts/swfupload/swfupload.swf',
            flash9_url : PageContext.contextPath + '/scripts/swfupload/swfupload_fp9.swf',

            file_queued_handler: function(file) {
                if (!me.multiFile && me.fileList.length == 1) {
                    this.cancelUpload(me.fileList[0].id, null);
                    me.fileList = [];
                }
                me.fileList.push(file);
                me.fireEvent('filequeued', file);
            },
            file_dialog_complete_handler : function(numFilesSelected, numFilesQueued) {
                me.fireEvent('dialogcomplete', numFilesSelected, numFilesQueued);
            },
            upload_progress_handler : function(file, bytesLoaded) {
                me.fireEvent('uploadprogress', file, bytesLoaded);
            },
            upload_error_handler : function(file, errorCode, message) {
                me.fireEvent('uploaderror', file, errorCode, message);
            },
            upload_success_handler : function(file, serverData) {
                me.fireEvent('uploadsuccess', file, serverData);
            }
        };
        me.callParent();
        me.on('afterrender', function() {
            me.uploader = new SWFUpload(uploaderConfig);
        });
    },

    removeFile: function(fileId) {
        Ext.each(this.fileList, function(file, index) {
            if (file.id == fileId) {
                this.fileList.splice(index, 1);
                return false;
            }
        }, this);
    },

    getUploader: function() {
        return this.uploader;
    },

    doUpload: function(callback, scope) {
        var me = this, uploader = me.getUploader();
        if (uploader.getStats()['files_queued'] == 0) {
            ExtUtil.Msg.info('请选择要上传的文件！', Ext.emptyFn(), null);
            return;
        }
        var msgBox = Ext.MessageBox.show({
            title: PageContext.msgTitle,
            msg: '开始上传' + this.fileLabel + '...',
            width: 300,
            progress : true
        });
        var totalSize = 0, totalSizeUploaded = 0, uploadedFileList = [];
        Ext.each(me.fileList, function(file) {
            totalSize += file.size;
        }, this);
        me.on('uploadprogress', function(file, bytesLoaded) {
            var percentUploaded = (totalSizeUploaded + file.sizeUploaded) / totalSize;
            var progressText = SWFUpload.speed.formatBytes(totalSizeUploaded + file.sizeUploaded) + '/' + SWFUpload.speed.formatBytes(totalSize) + '（' + SWFUpload.speed.formatPercent(percentUploaded * 100) + '）';
            msgBox.updateProgress(percentUploaded, progressText, '正在上传' + this.fileLabel + '...');
        });
        me.on('uploadsuccess', function(file, serverdata) {
            totalSizeUploaded += file.size;
            uploadedFileList.push(Ext.decode(serverdata));
            if (uploadedFileList.length == me.fileList.length) {
                msgBox.updateProgress(1, this.fileLabel + '上传完成', '正在保存...');
                msgBox.hide();
                me.fileList = [];
                if (me.multiFile) {
                    callback.call(scope, uploadedFileList);
                } else {
                    callback.call(scope, uploadedFileList[0]);
                }
            }
        });
        uploader.startUpload();
    }
});