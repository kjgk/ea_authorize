PageContext.extRoot = PageContext.contextPath + '/scripts/extjs';
Ext.Loader.setConfig({
    enabled: true,
    paths: {
        'Ext.ux': PageContext.extRoot + '/ux',
        'withub.ext': PageContext.contextPath + '/loadScript',
        'withub.ext.base': PageContext.contextPath + '/scripts/withub/ext/base',
        'withub.ext.common': PageContext.contextPath + '/scripts/withub/ext/common'
    }
});

Ext.require([

    'Ext.ux.form.TimePickerField',
    'Ext.ux.form.DateTimeField',
    'Ext.ux.DateTimeMenu',
    'Ext.ux.DateTimePicker',

    'withub.ext.base.Store',
    'withub.ext.base.Grid',
    'withub.ext.base.Tree',
    'withub.ext.base.TreeCombo',
    'withub.ext.base.CheckboxGroup',
    'withub.ext.base.Combo',
    'withub.ext.base.ArrayCombo',
    'withub.ext.base.RadioGroup',
    'withub.ext.base.SearchCombo',
    'withub.ext.base.SmartColumn',
    'withub.ext.base.SWFUpload',

    'withub.ext.common.CodeCheckBoxGroup',
    'withub.ext.common.CodeCombo',
    'withub.ext.common.CodeRadioGroup',
    'withub.ext.common.ColorSelector',
    'withub.ext.common.DateRange',
    'withub.ext.common.DeleteItem',
    'withub.ext.common.ManagerGrid',
    'withub.ext.common.ManagerTree',
    'withub.ext.common.OrderItem',
    'withub.ext.common.SimpleCombo',
    'withub.ext.common.SimpleSearchCombo',
    'withub.ext.common.SimpleSearchField',
    'withub.ext.common.SwfUploadField',
    'withub.ext.common.SwfUploadList',
    'withub.ext.common.UserSearchCombo',
    'withub.ext.common.DataPointSearchCombo',
    'withub.ext.common.AccessorySearchCombo',
    'withub.ext.common.YearCombo',
    'withub.ext.common.Window',
    'withub.ext.common.ClientUserSearchField',
    'withub.ext.common.YearRange'
]);

Ext.tip.QuickTipManager.init();

Ext.BLANK_IMAGE_URL = PageContext.extRoot + '/resources/themes/images/default/tree/s.gif';