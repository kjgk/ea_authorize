Ext.define('withub.ext.common.SimpleCombo', {
    extend: 'withub.ext.base.Combo',
    alias: 'widget.simplecombo',

    url: '/system/metadata/listEntity',

    initComponent: function() {
        this.extraParams = {
            order: this.order,
            entity: this.entity
        };
        this.callParent();
    }
});