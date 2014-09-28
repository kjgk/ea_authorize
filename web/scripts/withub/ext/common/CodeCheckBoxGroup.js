Ext.define('withub.ext.common.CodeCheckBoxGroup', {
    extend: 'withub.ext.base.CheckboxGroup',
    alias: 'widget.codecheckboxgroup',
    url: PageContext.contextPath + '/system/code/listCodeByCodeColumn',
    initComponent: function() {
        this.params = {codeColumnTag: this.codeColumnTag};
        this.callParent();
    }
});
