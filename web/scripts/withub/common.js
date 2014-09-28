PageContext = {
    contextPath: '',
    loadMsg: '加载中，请稍候...',
    waitMsg: '处理中，请稍候...',
    waitTitle: '信息',
    msgTitle: '信息',
    pageSize: 25
};

Ext.apply(Ext.form.VTypes, {

    inputConfirm: function (val, field) {
        if (field.confirmTarget) {
            var confirmTarget = Ext.getCmp(field.confirmTarget);
            return val == confirmTarget.getValue();
        }
    },

    isNotRepeat: function (val, field) {
        if (field.confirmTarget) {
            var confirmTarget = Ext.getCmp(field.confirmTarget);
            return field.getValue() != confirmTarget.getValue();
        }
    },

    unique: function (value, field) {
        var flag;
        var params = {};
        Ext.apply(params, {
            entity: field.vtypeEntity,
            property: field.vtypeProperty || 'name',
            value: value
        });
        this.uniqueText = Ext.String.format(this._uniqueText, value);
        if (value === field.originalValue) {
            field.clearInvalid();
            return true;
        }
        ExtUtil.request({
            url: PageContext.contextPath + '/system/user/checkAccountExists',
            params: params,
            async: false,
            success: function (result) {
                flag = result['data'];
            }
        });
        return !flag;
    },
    _uniqueText: '”{0}“已经被使用',

    daterange: function (val, field) {
        var date = field.parseDate(val);

        if (!date) {
            return false;
        }
        if (field.startDateField && (!this.dateRangeMax || (date.getTime() != this.dateRangeMax.getTime()))) {
            var start = field.up('form').down('#' + field.startDateField);
            start.setMaxValue(date);
            start.validate();
            this.dateRangeMax = date;
        }
        else if (field.endDateField && (!this.dateRangeMin || (date.getTime() != this.dateRangeMin.getTime()))) {
            var end = field.up('form').down('#' + field.endDateField);
            end.setMinValue(date);
            end.validate();
            this.dateRangeMin = date;
        }
        return true;
    },

    passwordstrength: function (value, field) {

        var passwordLength = 6;
        var passwordStrengthType = 'Normal';

        ExtUtil.request({
            url: PageContext.contextPath + '/system/account/loadPasswordConfig',
            async: false,
            success: function (result) {
                var data = result.data;
                passwordStrengthType = data.passwordStrengthType;
                passwordLength = data.passwordLength;
            }
        });

        if (field.getValue().length < passwordLength) {
            this.passwordstrengthText = Ext.String.format('密码最小长度为{0}', passwordLength);
            return false;
        }

        var findNumber = false;
        var findLowerChar = false;
        var findUpperChar = false;
        var findSpecialChar = false;
        for (var i = 0; i < value.length; i++) {
            var keyCode = value.charCodeAt(i);
            if (keyCode >= 48 && keyCode <= 57) {
                findNumber = true;
            } else if (keyCode >= 97 && keyCode <= 122) {
                findLowerChar = true;
            } else if (keyCode >= 65 && keyCode <= 90) {
                findUpperChar = true;
            } else {
                findSpecialChar = true;
            }
        }
        var totalScore = 0;
        if (findNumber) {
            totalScore += 1;
        }
        if (findLowerChar) {
            totalScore += 2;
        }
        if (findUpperChar) {
            totalScore += 3;
        }
        if (findSpecialChar) {
            totalScore += 4;
        }

        if (totalScore >= 10) {
            return true;
        }

        if (passwordStrengthType == "Weak") {
            return  totalScore > 0;
        }

        if (passwordStrengthType == "Normal") {
            if (totalScore <= 3) {
                this.passwordstrengthText = '密码必须包含数字和字母';
                return false;
            }
        }

        if (passwordStrengthType == "Good") {
            if (totalScore < 5) {
                this.passwordstrengthText = '密码必须包含大小写字母';
                return false;
            }
        }

        if (passwordStrengthType == "Strong") {

            if (totalScore < 10) {
                this.passwordstrengthText = '密码必须包含数字,大小写字母,特殊字符';
                return false;
            }
        }
        return true;
    }

});

DateFormat = {
    DAY: 'Y-m-d',
    HOUR: 'Y-m-d H',
    MINUTE: 'Y-m-d H:i',
    SECOND: 'Y-m-d H:i:s',
    TIMESTAMP: 'Y-m-d H:i:s.u'
};

DisplayType = {
    Text: 'Text',
    Number: 'Number',
    DateDay: 'DateDay',
    DateHour: 'DateHour',
    DateMinute: 'DateMinute',
    DateSecond: 'DateSecond',
    BooleanValue: 'BooleanValue',
    URl: 'URl'
}

TimeNames = {
    Second: '秒',
    Minute: '分钟',
    Hour: '小时',
    Day: '天',
    Month: '月',
    Year: '年'
};

ExtUtil = {

    TREE_NODE_SPLIT: '_',

    emptyText: '——',

    lookup: function (obj) {
        var result = '';
        for (var key in obj) {
            if (Ext.isFunction(obj[key])) {
                result += (key + ' --- ' + 'Fn()' + '<br/>');
            } else {
                result += (key + ' --- ' + obj[key] + '<br/>');
            }
        }
        Ext.create('Ext.window.Window', {
            height: ExtUtil.getFitHeight(),
            width: ExtUtil.getFitWidth(),
            autoScroll: true,
            html: result
        }).show();
//        alert(result);
    },

    failureHandler: function (mask) {
        return function (response) {
            if (mask) {
                mask.hide();
            }
            ExtUtil.Msg.error(response.responseText);
        }
    },

    getFitHeight: function () {
        var maxHeight = arguments[0] || 600;
        var bodyHeight = document.documentElement.clientHeight;
        return bodyHeight - 20 > maxHeight ? maxHeight : bodyHeight - 20;
    },

    getFitWidth: function () {
        var maxWidth = arguments[0] || 960;
        var bodyWidth = document.documentElement.clientWidth;
        return bodyWidth - 20 > maxWidth ? maxWidth : bodyWidth - 20;
    },

    getXHR: function () {
        var xhr;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }
        return xhr;
    },

    request: function (args) {
        var xhr = this.getXHR(), k, paramsArr = [], params = args['params'], url = args['url'];
        if (params) {
            for (k in params) {
                paramsArr.push(k + '=' + params[k]);
            }
        }
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    args.success.call(args['scope'] || args.success, Ext.decode(xhr.responseText));
                }
            }
        };
        Ext.applyIf(args, {
            async: true,
            success: Ext.emptyFn
        });

        if (paramsArr.length > 0) {
            if (url.indexOf('?') == -1) {
                url += '?' + paramsArr.join('&');
            } else {
                url += '&' + paramsArr.join('&');
            }
        }

        xhr.open('GET', url, args['async']);
        xhr.send('');
    },

    showWindow: function () {
        var windowConfig = {
            resizable: false,
            modal: true,
            layout: 'fit',
            border: false
        }, paramConfig, arg0 = arguments[0], arg1 = arguments[1], arg2 = arguments[2], panel;

        if (Ext.isString(arg0)) {
            panel = Ext.create(arg0, arg1);
            paramConfig = arg2;
        } else {
            panel = arg0;
            paramConfig = arg1;
        }
        if (panel.title) {
            windowConfig.title = panel.title;
            panel.setTitle(undefined);
        }
        windowConfig.items = panel;
        windowConfig.buttons = [
            {
                text: '关闭',
                handler: function () {
                    win.close();
                }
            }
        ];
        Ext.apply(windowConfig, paramConfig);
        var win = Ext.create('Ext.window.Window', windowConfig);
        win.show();
        return win;
    },

    dateRenderer: function () {
        var format = arguments[0];
        var emptyText = arguments[1] || '';
        return function (value) {
            if (Ext.isEmpty(value)) {
                return emptyText;
            }
            if (Ext.isString(value)) {
                if (format == DateFormat.DAY) {
                    return value.substr(0, 10);
                }
                if (format == DateFormat.HOUR) {
                    return value.substr(0, 13);
                }
                if (format == DateFormat.MINUTE) {
                    return value.substr(0, 16);
                }
                if (format == DateFormat.SECOND) {
                    return value.substr(0, 19);
                }
                return value;
            } else if (Ext.isNumber(value)) {
                return Ext.util.Format.date(new Date(value), format);
            } else {
                return Ext.util.Format.date(value, format);
            }
        }
    },

    baseRenderer: function (value) {
        if (Ext.isEmpty(value)) {
            return ExtUtil.emptyText;
        } else {
            return value;
        }
    },

    propertyRenderer: function (data, depend) {
        return function (value, md, record) {
            if (Ext.isEmpty(value)) {
                return ExtUtil.emptyText;
            }
            if (Ext.isObject(data)) {
                if (data[value]) {
                    return Ext.isArray(data[value]) ? data[value][0] : data[value];
                } else {
                    return value;
                }
            }
            if (Ext.isArray(data)) {
                for (var i = 0; i < data.length; i++) {
                    var item = data[i];
                    if (item.value == value) {
                        if (Ext.isEmpty(item.parent) || Ext.isEmpty(depend)) {
                            return item.label;
                        } else {
                            if (record.get(depend) == item.parent) {
                                return item.label;
                            }
                        }
                    }
                }
                return value;
            }
        }
    },

    linkRenderer: function (page) {
        return function (value, metaData, record) {
            var id = Ext.id();
            var fn = function () {
                Ext.get(id).on('click', function () {
                    ExtUtil.showWindow(page, {
                        objectId: record.get('objectId')
                    });
                })
            }
            setTimeout(fn, 800);
            return Ext.String.format('<a id="{0}" style="cursor: pointer;" class="default-link">{1}</a>', id, value);
        }
    },

    getUuid: function () {
        var s = [];
        var itoh = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
        // Make array of random hex digits. The UUID only has 32 digits in it, but we
        // allocate an extra items to make room for the '-'s we'll be inserting.
        for (var i = 0; i < 36; i++) s[i] = Math.floor(Math.random() * 0x10);

        // Conform to RFC-4122, section 4.4
        s[14] = 4;  // Set 4 high bits of time_high field to version
        s[19] = (s[19] & 0x3) | 0x8;  // Specify 2 high bits of clock sequence

        // Convert to hex chars
        for (var i = 0; i < 36; i++) s[i] = itoh[s[i]];

        s[8] = s[13] = s[18] = s[23] = '-';
        return s.join('');
    },

    toFixed: function (number, decimals) {
        var value = 0;
        var decimalsLength = (decimals === undefined ? 2 : decimals);

        if (Ext.isNumber(number)) {
            value = number.toFixed(decimalsLength);
        } else {
            value = value.toFixed(decimalsLength);
        }
        return value;
    },

    exportData: function (config) {
        var mask = new Ext.LoadMask(Ext.getBody(), {
            msg: '正在准备数据，请稍候...'
        });
        mask.show();
        Ext.Ajax.request({
            url: PageContext.contextPath + config.url,
            method: config.method || 'GET',
            params: config.params,
            timeOut: 1000 * 60 * 60 * 24,
            timeout: 1000 * 60 * 60 * 24,
            success: function (response) {
                mask.hide();
                var result = Ext.decode(response.responseText);
                if (result.success) {
                    var windId = Ext.id();
                    var url = Ext.String.format(PageContext.contextPath + '/system/common/downloadTempFile?fileName={0}&tempFileName={1}'
                        , config.fileName || result.data['fileName'], result.data['tempFileName']);
                    var template = new Ext.XTemplate('<div style="padding: 20px 10px; font-size: 15px; text-align: center;">' +
                        '<a href="{url}" onclick="Ext.getCmp(\'' + windId + '\').close();" >{fileName}</a>' +
                        '</div>');
                    var wind = new Ext.Window({
                        id: windId,
                        title: config.title || '报表下载',
                        height: 95,
                        width: 320,
                        plain: true,
                        resizable: false,
                        modal: true
                    });
                    wind.on('afterrender', function () {
                        template.overwrite(wind.body, {
                            url: url,
                            fileName: result.data['fileName']
                        });
                    }, this);
                    wind.show();
                } else {
                    ExtUtil.Msg.error(result.message);
                }
            },
            failure: function (response) {
                mask.hide();
                ExtUtil.Msg.error('导出失败！')
            }
        });
    }
};

ExtUtil.Msg = {

    info: function (msg, fn, scope) {
        Ext.Msg.show({
            title: PageContext.msgTitle,
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.INFO,
            fn: fn,
            scope: scope
        });
    },

    warning: function (msg, fn, scope) {
        Ext.Msg.show({
            title: PageContext.msgTitle,
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.WARNING,
            fn: fn,
            scope: scope
        });
    },

    confirm: function (msg, handler, scope) {
        Ext.Msg.confirm(PageContext.msgTitle, msg, handler, scope);
    },

    error: function (msg, fn, scope) {
        Ext.Msg.show({
            title: PageContext.msgTitle,
            msg: msg,
            buttons: Ext.Msg.OK,
            icon: Ext.Msg.ERROR,
            fn: fn,
            scope: scope
        });
    }
}