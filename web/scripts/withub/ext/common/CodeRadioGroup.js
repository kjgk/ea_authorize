Ext.define('withub.ext.common.CodeRadioGroup', {
    extend: 'withub.ext.base.RadioGroup',
    alias: 'widget.coderadiogroup',
    url: PageContext.contextPath + '/system/code/listCodeByCodeColumn',
    initComponent: function() {
        this.params = {codeColumnTag: this.codeColumnTag};
        this.callParent();
    }
});
