RendererUtil = {

    stringRenderer: function () {
        return function (value) {
            return Ext.util.Format.htmlEncode(value)
        };
    },

    booleanValueRenderer: function () {
        return function (value) {
            return value === 1 || value === true ? '是' : '否'
        }
    },

    pageRenderer: function (page) {
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
            var text = Ext.util.Format.htmlEncode(value);
            return Ext.String.format('<a id="{0}" style="cursor: pointer;" class="default-link">{1}</a>', id, text);
        }
    },

    hrefRenderer: function (page) {
        return function (value, metaData, record) {
            var html = '<a href="' + PageContext.contextPath + page
                + record.get('objectId') + '.page" target="_blank">'
                + Ext.util.Format.htmlEncode(record.get('title')) + '</a>'
            return html;
        }
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

    numberRenderer: function (format) {
        return Ext.util.Format.numberRenderer(format);
    },

    proportionRenderer: function (denominatorColumn, numeratorColumn, fractionalDigits) {
        return function (v, m, r) {
            var denominator = r.get(denominatorColumn);
            var numerator = r.get(numeratorColumn);
            if (denominator == 0) {
                return '-';
            }
            var result = numerator / denominator;
            if (result == 0) {
                return 0;
            }

            if (fractionalDigits == undefined) {
                fractionalDigits = 4;
            }
            var v = Math.pow(10, fractionalDigits);
            return Math.round(result * v) / 100;
        }
    },

    URLRenderer: function () {
        return function (value) {
            if (Ext.isEmpty(value)) {
                return;
            }
            return '<a style="color: #0000FF;" target="_blank" href="' + value + '">' + value + '</a>'
        }

    }
};