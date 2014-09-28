Ext.define('withub.ext.WidgetModel', {
    extend: 'Ext.data.Model',
    fields: [
        'objectId',
        'widgetCategory',
        'name',
        'widgetTag',
        'widgetVersion',
        'licenseWidget',
        'license',
        'installTime',
        'allowEvaluate',
        'evaluateExpiredTime',
        'status',
        'description'
    ]
});