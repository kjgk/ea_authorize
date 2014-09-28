Ext.define('withub.ext.common.SimpleSearchCombo', {
    extend: 'withub.ext.base.SearchCombo',
    alias: 'widget.simplesearchcombo',

    url: '/system/metadata/searchEntity',
    queryProperty: 'name',

    initComponent: function() {
        this.extraParams = {entity : this.entity,queryProperty:this.queryProperty};
        this.callParent();
    }
});