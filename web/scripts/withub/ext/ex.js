var EX = {};
EX.labelableRender = function () {
    return function () {
        if (this.allowBlank === undefined) {
            this.allowBlank = true;
        }
        return Ext.apply(this.callParent(), {
            afterLabelTextTpl:this.allowBlank === false ? '<span style="font-size: 13px; font-weight: bold; color: red;">*</span>' : undefined
        });
    }
}
Ext.define(null, {override:'Ext.form.field.Base', initRenderData:EX.labelableRender()});
Ext.define(null, {override:'Ext.form.FieldContainer', initRenderData:EX.labelableRender()});
Ext.define(null, {override:'Ext.form.field.HtmlEditor', initRenderData:EX.labelableRender()});

Ext.define(null, {
    override:'Ext.form.field.HtmlEditor',
    fontFamilies:[
        '宋体',
        '黑体',
        '楷体'
    ]
});

Ext.define(null, {
    override:'Ext.form.action.Submit',
    getParams:function (useModelValues) {
        var falseVal = false,
            configParams = this.callParent(),
            fieldParams = this.form.getValues(falseVal, falseVal, this.submitEmptyText !== falseVal, useModelValues);
        var params = Ext.apply({}, fieldParams, configParams);
        var _params = {}, k;
        for (k in params) {
            if (params[k] !== undefined && params[k] !== '') {
                _params[k] = params[k];
            }
        }
        return _params;
    }
});

Ext.util.Observable.observeClass(Ext.data.Connection);

Ext.data.Connection.on('requestcomplete', function (conn, response) {
    if (response.responseText == 'SessionInvalid' || response.responseText == 'SessionExpired') {
        ExtUtil.Msg.info('对不起，当前登录已过期，请重新登录！', function () {
            if (window.top != window.self) {
                window.top.location.href = PageContext.contextPath;
            } else {
                window.location.href = PageContext.contextPath;
            }
        });
    }
});


Ext.define(null, {
    override:'Extensible.calendar.view.AbstractCalendar',
    onClick:function (e, t) {
        var me = this,
            el = e.getTarget(me.eventSelector, 5);

        if (me.dropZone) {
            me.dropZone.clearShims();
        }
        if (me.menuActive === true) {
            me.menuActive = false;
            return true;
        }
        if (el) {
            var id = me.getEventIdFromEl(el),
                rec = me.getEventRecord(id);
            me.fireEvent('eventclick', me, rec, el);
            return true;
        }
    },
    moveEvent:function (rec, dt) {
        this.fireEvent('eventmove', this, rec);
    },
    onDayClick:function (dt, ad, el) {
        this.fireEvent('dayclick', this, dt, ad, el);
        return true;
    }
});


Ext.define(null, {
    override:'Extensible.calendar.gadget.CalendarListPanel',
    onClick:function (e, t) {
        var el;
        if (el = e.getTarget('li', 3, true)) {
            this.toggleCalendar(this.getCalendarId(el));
        }
    },
    toggleCalendar:function (id, commit) {
        var rec = this.store.findRecord(Extensible.calendar.data.CalendarMappings.CalendarId.name, id);
        CM = Extensible.calendar.data.CalendarMappings,
            isHidden = rec.data[CM.IsHidden.name];
        rec.data[CM.IsHidden.name] = !isHidden;

        if (commit !== false) {
            rec.commit();
        }
    }
});



