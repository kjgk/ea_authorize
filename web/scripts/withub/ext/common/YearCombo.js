Ext.define('withub.ext.common.YearCombo', {
    extend: 'Ext.form.field.ComboBox',
    alias: 'widget.yearcombo',

    queryMode: 'local',
    displayField: 'label',
    valueField: 'value',
    editable: false,
    range: [0,0],

    initComponent: function() {

        var systemEnabledYear;
        ExtUtil.request({
            async: false,
            url: PageContext.contextPath + '/system/configuration/load',
            success: function(result) {
                systemEnabledYear = result['data']['systemConfigInfo.systemEnabledYear'];
            }
        });

        this.store = Ext.create('Ext.data.ArrayStore', {
            fields: [
                {name: 'label'},
                {name: 'value'}
            ]
        });

        if (this.showAll) {
            this.store.insert(0, [
                {label: '全部', value: ''}
            ]);
        }

        var now = parseInt(Ext.util.Format.date(new Date(), 'Y'));

        var begin = systemEnabledYear + this.range[0];
        var end = now + this.range[1];
        for (var i = 0; i <= end - begin; i++) {
            this.store.add([
                {
                    value: end - i,
                    label: end - i
                }
            ]);
        }

        this.value = this.value || now;

        this.callParent();
    }
});